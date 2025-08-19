// src/lib/server/auth.ts
import { SvelteKitAuth } from '@auth/sveltekit';
import CredentialsProvider from '@auth/core/providers/credentials';
import GoogleProvider from '@auth/core/providers/google';
import GitHubProvider from '@auth/core/providers/github';
import { compare } from 'bcryptjs';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

// Drizzle client & schema
import { db } from '$lib/server/db/index.js';
import * as schema from '$lib/server/db/schema.js';
import { eq, and } from 'drizzle-orm';
import { env as privateEnv } from '$env/dynamic/private';

// Type definitions for Auth.js callbacks - using any for Auth.js compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SignInParams = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SessionParams = any;

export const authOptions = {
	adapter: DrizzleAdapter(db),

	session: {
		strategy: 'database' as const // Store sessions in DB, not JWT
	},

	providers: [
		GoogleProvider({
			clientId: privateEnv.GOOGLE_CLIENT_ID!,
			clientSecret: privateEnv.GOOGLE_CLIENT_SECRET!
		}),
		GitHubProvider({
			clientId: privateEnv.GITHUB_CLIENT_ID!,
			clientSecret: privateEnv.GITHUB_CLIENT_SECRET!
		}),
		CredentialsProvider({
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(creds: Partial<Record<'email' | 'password', unknown>>) {
				console.log('🔐 Credentials authorize called with:', {
					email: creds?.email,
					hasPassword: !!creds?.password
				});

				if (!creds?.email || !creds?.password) {
					console.log('❌ Missing credentials');
					throw new Error('Email and password required');
				}

				// Fetch user from your database
				const user = await db.query.users.findFirst({
					where: eq(schema.users.email, (creds.email as string).toLowerCase())
				});
				console.log('🔍 User lookup result:', {
					found: !!user,
					userId: user?.id,
					userRole: user?.role
				});

				if (!user) {
					console.log('❌ User not found');
					throw new Error('Invalid credentials');
				}

				// Fetch stored password hash from your credentials table
				const account = await db.query.accounts.findFirst({
					where: and(
						eq(schema.accounts.userId, user.id),
						eq(schema.accounts.provider, 'credentials')
					)
				});
				console.log('🔍 Account lookup result:', {
					found: !!account,
					hasPassword: !!account?.password
				});

				if (!account?.password) {
					console.log('❌ Account or password not found');
					throw new Error('Invalid credentials');
				}

				const valid = await compare(creds.password as string, account.password as string);
				console.log('🔑 Password validation result:', valid);

				if (!valid) {
					console.log('❌ Password mismatch');
					throw new Error('Invalid credentials');
				}

				const userData = {
					id: String(user.id),
					email: user.email,
					name: user.name ?? null,
					role: user.role
				};
				console.log('✅ Credentials authorize successful, returning user data:', userData);

				return userData;
			}
		})
	],

	callbacks: {
		async signIn(params: SignInParams) {
			const { account, profile } = params;
			console.log('🔐 SignIn callback triggered:', {
				account: account?.provider,
				profile: profile?.email
			});

			if (!account || account.provider === 'credentials') {
				console.log('✅ Credentials provider, allowing sign in');
				return true;
			}

			const email = profile?.email;
			if (!email) {
				console.log('⚠️ No email in profile, allowing sign in');
				return true;
			}

			// Find existing user
			const existingUser = await db.query.users.findFirst({
				where: eq(schema.users.email, email.toLowerCase())
			});
			console.log('🔍 Existing user check:', { email, found: !!existingUser });

			if (!existingUser) {
				console.log('✅ New OAuth user, allowing sign in');
				// New OAuth users will get default role from schema
				return true;
			}

			// Get linked providers for this user
			const linkedAccounts = await db.query.accounts.findMany({
				where: eq(schema.accounts.userId, existingUser.id)
			});
			const linkedProviders = linkedAccounts.map((a) => a.provider);
			console.log('🔗 Linked providers:', linkedProviders);

			if (!linkedProviders.includes(account.provider)) {
				const suggested = linkedProviders[0] ?? 'password';
				const params = new URLSearchParams({
					error: 'OAuthAccountExists',
					provider: suggested
				});
				console.log('❌ OAuth account exists with different provider, redirecting');
				return `/login?${params.toString()}`;
			}

			console.log('✅ OAuth sign in allowed');
			return true;
		},

		async session(params: SessionParams) {
			const { session, user } = params;
			console.log('📋 Session callback triggered:', {
				sessionUserId: session?.user?.id,
				dbUserId: user?.id,
				userRole: user?.role,
				sessionUser: session?.user
			});

			if (session.user && user && user.id && user.email && user.name) {
				session.user.id = String(user.id);
				// Add role to session for RBAC - ensure default role for OAuth users
				session.user.role = user.role || 'user';
				console.log('✅ Session updated with user data:', session.user);
			} else {
				console.log('⚠️ Session callback: missing user data', { session, user });
			}
			return session;
		},

		async jwt({ token }: { token: Record<string, unknown> }) {
			console.log('🎫 JWT callback triggered:', token);
			return token;
		},

		// Prevent automatic redirects
		async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
			console.log('🔄 Redirect callback:', { url, baseUrl });
			// Allow relative URLs and same-origin redirects
			if (url.startsWith('/')) return url;
			if (url.startsWith(baseUrl)) return url;
			// Default to chatbot UI for external URLs
			return `${baseUrl}/chat`;
		}
	}
};

export const { handle, signIn, signOut } = SvelteKitAuth(authOptions);

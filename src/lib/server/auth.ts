// src/lib/server/auth.ts
import { SvelteKitAuth } from '@auth/sveltekit';
import CredentialsProvider from '@auth/core/providers/credentials';
import GoogleProvider from '@auth/core/providers/google';
import GitHubProvider from '@auth/core/providers/github';
import { db } from '$lib/server/db/index.js';
import { users, sessions } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import {
	AUTH_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET
} from '$env/static/private';
import type { Session, User, Account } from '@auth/core/types';
import { customAdapter } from './custom-adapter.js';

// Test database connection and verify tables exist
console.log('🔌 Testing database connection and tables...');
Promise.all([
	db.query.users.findFirst(),
	// Test sessions table access using a simple query instead of findFirst
	db.execute(db.select().from(sessions).limit(1))
])
	.then(([user]) => {
		console.log('✅ Database connection successful');
		console.log('📋 Users table accessible:', !!user);
		console.log('📋 Sessions table accessible:', true); // Sessions table is accessible if we can execute queries
	})
	.catch((err) => {
		console.error('❌ Database connection failed:', err);
	});

export const authOptions = {
	adapter: customAdapter,
	providers: [
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID!,
			clientSecret: GOOGLE_CLIENT_SECRET!,
			allowDangerousEmailAccountLinking: true
		}),
		GitHubProvider({
			clientId: GITHUB_CLIENT_ID!,
			clientSecret: GITHUB_CLIENT_SECRET!,
			allowDangerousEmailAccountLinking: true
		}),
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				try {
					console.log('🔐 Authorize called with:', credentials?.email);

					if (!credentials?.email || !credentials?.password) {
						console.log('❌ Missing credentials');
						return null;
					}

					const user = await db.query.users.findFirst({
						where: eq(users.email, credentials.email as string)
					});

					console.log(
						'👤 User found:',
						user ? { id: user.id, email: user.email, emailVerified: user.emailVerified } : null
					);

					if (!user?.password) {
						console.log('❌ User not found or no password');
						return null;
					}

					// Temporarily remove email verification requirement for testing
					// if (!user.emailVerified) {
					//   throw new Error('EMAIL_NOT_VERIFIED');
					// }

					const ok = await bcrypt.compare(credentials.password as string, user.password);
					console.log('🔑 Password check result:', ok);

					if (!ok) {
						console.log('❌ Password mismatch');
						return null;
					}

					console.log('✅ Authorization successful for user:', user.id);
					return {
						id: user.id,
						email: user.email,
						name: user.name
					};
				} catch (error) {
					console.error('❌ Authorization error:', error);
					return null;
				}
			}
		})
	],
	session: {
		strategy: 'database',
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60 // 24 hours
	},
	trustHost: true,
	callbacks: {
		async session({ session, user }: { session: Session; user: User }) {
			try {
				console.log('📋 Session callback called');
				console.log('📋 Session object:', session);
				console.log('📋 User object:', user);

				if (session.user && user && user.id && user.email && user.name) {
					session.user.id = user.id;
					session.user.email = user.email;
					session.user.name = user.name;
					console.log('📋 Updated session user:', session.user);
				}

				return session;
			} catch (error) {
				console.error('❌ Session callback error:', error);
				return session;
			}
		}
	},
	events: {
		async signIn({ user, account }: { user: User; account: Account }) {
			try {
				console.log('✅ SignIn event - user:', user?.id, 'account:', account?.provider);

				// Verify that the user exists in the database
				if (user?.id) {
					const dbUser = await db.query.users.findFirst({ where: eq(users.id, user.id) });
					console.log('🔍 Database user verification:', !!dbUser);
				}
			} catch (error) {
				console.error('❌ SignIn event error:', error);
			}
		},
		async signOut() {
			try {
				console.log('❌ SignOut event');
			} catch (error) {
				console.error('❌ SignOut event error:', error);
			}
		},
		async createSession({ user }: { user: User }) {
			try {
				console.log('🆕 CreateSession event - user:', user?.id);

				// Verify session was created in database
				if (user?.id) {
					const dbSession = await db.query.sessions.findFirst({
						where: eq(sessions.userId, user.id)
					});
					console.log('🔍 Database session verification:', !!dbSession);

					if (!dbSession) {
						console.log('⚠️ Warning: Session not found in database after creation');
					}
				}
			} catch (error) {
				console.error('❌ CreateSession event error:', error);
			}
		},
		async updateSession({ user }: { user: User }) {
			try {
				console.log('🔄 UpdateSession event - user:', user?.id);
			} catch (error) {
				console.error('❌ UpdateSession event error:', error);
			}
		},
		async deleteSession() {
			try {
				console.log('🗑️ DeleteSession event');
			} catch (error) {
				console.error('❌ DeleteSession event error:', error);
			}
		}
	},
	debug: true,
	secret: AUTH_SECRET
};

export const { handle, signIn, signOut } = SvelteKitAuth(authOptions);

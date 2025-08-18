import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { users, accounts, verificationTokens } from '$lib/server/db/schema.js';
import { sendEmail, generateVerificationEmailHtml } from '$lib/server/email.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, email, password } = await request.json();
		const normalizedEmail = String(email).toLowerCase();

		if (!name || !email || !password) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		if (password.length < 8) {
			return json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
		}

		// Check if user already exists
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, normalizedEmail)
		});

		if (existingUser) {
			return json({ error: 'User already exists' }, { status: 409 });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create user (unverified) with password
		const newUser = await db
			.insert(users)
			.values({
				name,
				email: normalizedEmail,
				password: hashedPassword, // Store password in users table
				emailVerified: null // User is not verified yet
			})
			.returning();

		// Create credentials account
		try {
			await db.insert(accounts).values({
				userId: newUser[0].id,
				type: 'credentials',
				provider: 'credentials',
				providerAccountId: newUser[0].id
				// No password needed here since it's stored in users table
			});
		} catch {
			// Clean up the user since account creation failed
			await db.delete(users).where(eq(users.id, newUser[0].id));
			throw new Error('Failed to create credentials account');
		}

		// Generate verification code
		const verificationCode = randomBytes(3).toString('hex').toUpperCase();
		const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

		// Store verification token
		await db.insert(verificationTokens).values({
			identifier: normalizedEmail,
			token: verificationCode,
			expires
		});

		// Send verification email
		const emailSent = await sendEmail({
			to: normalizedEmail,
			subject: 'Verify Your Email Address',
			html: generateVerificationEmailHtml(normalizedEmail, verificationCode, name)
		});

		if (!emailSent) {
			return json({ error: 'Failed to send verification email' }, { status: 500 });
		}

		return json({
			message: 'User created successfully. Please check your email to verify your account.',
			userId: newUser[0].id
		});
	} catch (error) {
		console.error('Signup error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

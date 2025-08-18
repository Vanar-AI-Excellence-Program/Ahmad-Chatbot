import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { users, verificationTokens } from '$lib/server/db/schema.js';
import { eq, and, gt } from 'drizzle-orm';
import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, code } = await request.json();
		const normalizedEmail = String(email).toLowerCase();

		if (!email || !code) {
			return json({ error: 'Missing email or verification code' }, { status: 400 });
		}

		// Find the verification token
		const token = await db.query.verificationTokens.findFirst({
			where: and(
				eq(verificationTokens.identifier, normalizedEmail),
				eq(verificationTokens.token, code),
				gt(verificationTokens.expires, new Date())
			)
		});

		if (!token) {
			return json({ error: 'Invalid or expired verification code' }, { status: 400 });
		}

		// Update user to verified
		await db
			.update(users)
			.set({ emailVerified: new Date() })
			.where(eq(users.email, normalizedEmail));

		// Delete the used verification token
		await db
			.delete(verificationTokens)
			.where(
				and(eq(verificationTokens.identifier, normalizedEmail), eq(verificationTokens.token, code))
			);

		return json(
			{
				message: 'Email verified successfully! You can now sign in to your account.',
				verified: true
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Email verification error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

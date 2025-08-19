import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/admin.js';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async (event) => {
	try {
		// Ensure user is admin
		await requireAdmin(event);

		const { userId, role } = await event.request.json();

		if (!userId || !role) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		if (!['user', 'admin'].includes(role)) {
			return json({ error: 'Invalid role' }, { status: 400 });
		}

		// Update user role
		const updatedUser = await db
			.update(users)
			.set({ role })
			.where(eq(users.id, userId))
			.returning();

		if (!updatedUser.length) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		return json({
			message: 'User role updated successfully',
			user: updatedUser[0]
		});
	} catch (error) {
		console.error('Update role error:', error);

		// If it's a redirect error, re-throw it
		if (error instanceof Response) {
			throw error;
		}

		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

import { db } from '$lib/server/db/index.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async (event) => {
	try {
		console.log('🔍 Admin page load - event.locals:', Object.keys(event.locals));
		console.log('🔍 Admin page load - getSession function:', typeof event.locals.getSession);

		// Check if user is authenticated and has admin role
		const session = await event.locals.getSession();
		console.log('🔍 Admin page load - session result:', session);
		console.log('🔍 Admin page load - session user:', session?.user);
		console.log(
			'🔍 Admin page load - session user role:',
			(session?.user as { role?: string })?.role
		);

		if (!session?.user?.id) {
			console.log('❌ No session or user ID found');
			// Return error state instead of redirecting
			return {
				error: 'Authentication required',
				authenticated: false,
				users: []
			};
		}

		if ((session.user as { role?: string }).role !== 'admin') {
			console.log('❌ User is not admin, role:', (session.user as { role?: string }).role);
			// Return error state instead of redirecting
			return {
				error: 'Admin access required',
				authenticated: false,
				users: []
			};
		}

		console.log('✅ User is authenticated and is admin, fetching users...');

		// User is authenticated and is admin, fetch data
		const allUsers = await db.query.users.findMany({
			with: {
				accounts: true
			},
			orderBy: (users, { desc }) => [desc(users.createdAt)]
		});

		console.log('🔍 Fetched users:', allUsers.length);

		// Transform data for display
		const usersWithDetails = allUsers.map((user) => ({
			id: user.id,
			name: user.name,
			email: user.email,
			role: (user as { role?: string }).role || 'user',
			emailVerified: user.emailVerified,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			hasPassword:
				(user.accounts as { provider: string; password?: string }[])?.some(
					(acc) => acc.provider === 'credentials' && acc.password
				) || false,
			providers: (user.accounts as { provider: string }[])?.map((acc) => acc.provider) || []
		}));

		console.log('✅ Admin page load successful, returning data');

		return {
			users: usersWithDetails,
			authenticated: true,
			error: null
		};
	} catch (error) {
		console.error('❌ Admin page error:', error);
		return {
			error: 'Failed to load admin data',
			authenticated: false,
			users: []
		};
	}
};

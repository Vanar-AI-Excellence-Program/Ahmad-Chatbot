import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load: PageServerLoad = async ({ locals }: { locals: any }) => {
	const session = await locals.getSession();

	if (!session?.user?.id) {
		// Redirect unauthenticated users to login
		throw redirect(302, '/login');
	}

	// Return session data for the chat interface
	return {
		user: session.user
	};
};

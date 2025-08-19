import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load: PageServerLoad = async ({ locals }: { locals: any }) => {
	const session = await locals.getSession();

	if (session?.user?.id) {
		// Redirect authenticated users to chatbot
		throw redirect(302, '/chat');
	}

	// Return empty data for unauthenticated users (they'll see the home page)
	return {};
};

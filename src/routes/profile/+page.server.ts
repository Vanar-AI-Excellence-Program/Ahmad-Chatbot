import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
	console.log('🔍 Profile page load - locals:', locals);
	
	const session = await locals.getSession();
	console.log('🔍 Profile page load - session:', session);
	
	if (!session) {
		console.log('❌ No session found, redirecting to login');
		throw redirect(302, '/login');
	}
	
	console.log('✅ Session found, user:', session.user);
	
	return {
		session
	};
};

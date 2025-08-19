import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async ({ locals }) => {
	console.log('🔍 Layout server load - locals keys:', Object.keys(locals));
	console.log('🔍 Layout server load - getSession function:', typeof locals.getSession);

	const session = await locals.getSession();
	console.log('🔍 Layout server load - session result:', session);
	console.log('🔍 Layout server load - session user:', session?.user);
	console.log(
		'🔍 Layout server load - session user role:',
		(session?.user as { role?: string })?.role
	);

	return {
		session
	};
};

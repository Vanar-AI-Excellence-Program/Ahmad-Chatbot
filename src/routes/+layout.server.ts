import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	
	return {
		session
	};
};

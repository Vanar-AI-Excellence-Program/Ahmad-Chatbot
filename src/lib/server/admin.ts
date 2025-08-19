import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function requireAdmin(event: RequestEvent) {
	const session = await event.locals.getSession();

	if (!session?.user?.id) {
		throw redirect(302, '/login');
	}

	// Check if user has admin role
	if ((session.user as any).role !== 'admin') {
		throw redirect(302, '/');
	}

	return session;
}

export function isAdmin(session: any): boolean {
	return session?.user?.role === 'admin';
}

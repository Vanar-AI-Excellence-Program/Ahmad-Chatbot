// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, DefaultSession } from '@auth/core/types';

declare global {
	namespace App {
		interface Locals {
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Error {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Extend the Session type to include user id
declare module '@auth/core/types' {
	interface Session {
		user: {
			id: string;
			email: string;
			name: string;
			image?: string;
		} & DefaultSession['user'];
	}
}

export {};

import { Auth } from '@auth/core';
import { authOptions } from '$lib/server/auth.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async (event) => {
	return await Auth(event.request, authOptions);
};

export const POST: RequestHandler = async (event) => {
	return await Auth(event.request, authOptions);
};

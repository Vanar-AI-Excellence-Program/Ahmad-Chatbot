import { json } from '@sveltejs/kit';
import { generateResponse } from '$lib/server/ai.js';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	try {
		// Test the API connection by trying to generate a simple response
		await generateResponse('Hello');

		return json({
			status: 'healthy',
			message: 'Gemini API connection successful',
			model: 'gemini-1.5-flash',
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('❌ Health check failed:', error);

		const errorMessage = error instanceof Error ? error.message : String(error);
		return json(
			{
				status: 'unhealthy',
				error: errorMessage,
				timestamp: new Date().toISOString()
			},
			{ status: 500 }
		);
	}
};

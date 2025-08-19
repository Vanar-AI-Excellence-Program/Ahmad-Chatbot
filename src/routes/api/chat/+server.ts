import { json } from '@sveltejs/kit';
import { generateResponse } from '$lib/server/ai.js';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message } = await request.json();

		if (!message || typeof message !== 'string') {
			return json({ error: 'Message is required' }, { status: 400 });
		}

		console.log('💬 Chat API: Processing message:', message.substring(0, 100) + '...');

		// Generate AI response
		const response = await generateResponse(message);

		console.log('✅ Chat API: Response generated successfully');
		return json({ response });
	} catch (error) {
		console.error('❌ Chat API error:', error);

		const errorMessage = error instanceof Error ? error.message : String(error);
		return json({ error: errorMessage }, { status: 500 });
	}
};

import { generateStreamingResponse } from '$lib/server/ai.js';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message } = await request.json();

		if (!message || typeof message !== 'string') {
			return new Response(JSON.stringify({ error: 'Message is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		console.log('💬 Chat API: Processing streaming message:', message.substring(0, 100) + '...');

		// Create a ReadableStream for streaming the response
		const stream = new ReadableStream({
			async start(controller) {
				try {
					// Generate streaming AI response
					for await (const chunk of generateStreamingResponse(message)) {
						if (chunk.isComplete) {
							// Send completion signal
							const data = JSON.stringify({
								type: 'complete',
								model: chunk.model,
								fullText: chunk.fullText
							});
							controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
							break;
						} else {
							// Send streaming chunk
							const data = JSON.stringify({
								type: 'chunk',
								text: chunk.text,
								model: chunk.model
							});
							controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
						}
					}

					controller.close();
				} catch (error) {
					console.error('❌ Streaming error:', error);
					const errorData = JSON.stringify({
						type: 'error',
						error: error instanceof Error ? error.message : String(error)
					});
					controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`));
					controller.close();
				}
			}
		});

		console.log('✅ Chat API: Streaming response initiated');

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Cache-Control'
			}
		});
	} catch (error) {
		console.error('❌ Chat API error:', error);

		const errorMessage = error instanceof Error ? error.message : String(error);
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

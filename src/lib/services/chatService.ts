import type { Message } from '$lib/stores/chat.js';

export interface StreamingChunk {
	type: 'chunk' | 'complete' | 'error';
	text?: string;
	model?: string;
	fullText?: string;
	error?: string;
}

export class ChatService {
	private static instance: ChatService;
	private baseUrl: string;

	private constructor() {
		this.baseUrl = '/api/chat';
	}

	public static getInstance(): ChatService {
		if (!ChatService.instance) {
			ChatService.instance = new ChatService();
		}
		return ChatService.instance;
	}

	async sendMessage(message: string): Promise<string> {
		try {
			const response = await fetch(this.baseUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message })
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data.response;
		} catch (error) {
			console.error('Chat service error:', error);
			throw new Error('Failed to get response from AI');
		}
	}

	async sendStreamingMessage(
		message: string,
		onChunk: (chunk: StreamingChunk) => void
	): Promise<void> {
		try {
			console.log('🌐 Starting streaming request for message:', message.substring(0, 50) + '...');

			const response = await fetch(this.baseUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message })
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			if (!response.body) {
				throw new Error('No response body for streaming');
			}

			console.log('📡 Response received, starting to read stream...');
			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			try {
				while (true) {
					const { done, value } = await reader.read();

					if (done) {
						console.log('📡 Stream reading completed');
						break;
					}

					const chunk = decoder.decode(value);
					console.log('📦 Raw chunk received:', chunk);
					const lines = chunk.split('\n');

					for (const line of lines) {
						if (line.startsWith('data: ')) {
							try {
								const data = JSON.parse(line.slice(6));
								console.log('📡 Parsed SSE data:', data);
								onChunk(data);

								// If this is the completion signal, we're done
								if (data.type === 'complete' || data.type === 'error') {
									console.log('🏁 Received completion signal:', data.type);
									return;
								}
							} catch (parseError) {
								console.warn('⚠️ Failed to parse SSE data:', parseError, 'Line:', line);
							}
						}
					}
				}
			} finally {
				reader.releaseLock();
			}
		} catch (error) {
			console.error('❌ Streaming chat service error:', error);
			onChunk({
				type: 'error',
				error: error instanceof Error ? error.message : String(error)
			});
		}
	}

	createUserMessage(content: string): Message {
		return {
			id: Date.now().toString(),
			content,
			role: 'user',
			timestamp: new Date()
		};
	}

	createAssistantMessage(content: string): Message {
		return {
			id: (Date.now() + 1).toString(),
			content,
			role: 'assistant',
			timestamp: new Date()
		};
	}
}

export const chatService = ChatService.getInstance();

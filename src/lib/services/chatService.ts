import type { Message } from '$lib/stores/chat.js';

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

import { writable } from 'svelte/store';

export interface Message {
	id: string;
	content: string;
	role: 'user' | 'assistant';
	timestamp: Date;
	isStreaming?: boolean;
}

interface ChatState {
	messages: Message[];
	isLoading: boolean;
	error: string | null;
}

function createChatStore() {
	const { subscribe, set, update } = writable<ChatState>({
		messages: [
			{
				id: 'welcome',
				content: "Hello! I'm your AI assistant. How can I help you today?",
				role: 'assistant',
				timestamp: new Date()
			}
		],
		isLoading: false,
		error: null
	});

	return {
		subscribe,
		addMessage: (message: Message) => {
			update((state) => ({
				...state,
				messages: [...state.messages, message]
			}));
		},
		updateStreamingMessage: (messageId: string, content: string, isComplete: boolean = false) => {
			update((state) => ({
				...state,
				messages: state.messages.map((msg) =>
					msg.id === messageId
						? {
								...msg,
								content,
								isStreaming: !isComplete
							}
						: msg
				)
			}));
		},
		setLoading: (loading: boolean) => {
			update((state) => ({
				...state,
				isLoading: loading
			}));
		},
		setError: (error: string | null) => {
			update((state) => ({
				...state,
				error
			}));
		},
		clearError: () => {
			update((state) => ({
				...state,
				error: null
			}));
		},
		reset: () => {
			set({
				messages: [
					{
						id: 'welcome',
						content: "Hello! I'm your AI assistant. How can I help you today?",
						role: 'assistant',
						timestamp: new Date()
					}
				],
				isLoading: false,
				error: null
			});
		}
	};
}

export const chatStore = createChatStore();

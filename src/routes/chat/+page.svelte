<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import ChatLoading from '$lib/components/ChatLoading.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import { chatStore } from '$lib/stores/chat.js';
	import { chatService } from '$lib/services/chatService.js';

	let chatContainer: HTMLElement;

	// Check if user is authenticated
	$: isAuthenticated = $page.data.session?.user?.id;

	// Subscribe to chat store
	$: ({ messages, isLoading, error } = $chatStore);

	onMount(() => {
		// Reset chat on mount
		chatStore.reset();
	});

	async function sendMessage(messageContent: string) {
		if (!messageContent.trim() || isLoading) return;

		// Add user message
		const userMessage = chatService.createUserMessage(messageContent);
		chatStore.addMessage(userMessage);
		chatStore.clearError();
		chatStore.setLoading(true);

		try {
			// Get AI response
			const response = await chatService.sendMessage(messageContent);

			// Add assistant message
			const assistantMessage = chatService.createAssistantMessage(response);
			chatStore.addMessage(assistantMessage);
		} catch (err) {
			chatStore.setError('Failed to get response. Please try again.');
			console.error('Chat error:', err);
		} finally {
			chatStore.setLoading(false);
		}

		// Scroll to bottom after message
		setTimeout(() => {
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}, 100);
	}
</script>

<svelte:head>
	<title>AI Chat - Your AI Assistant</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800"
>
	<!-- Header -->
	<header
		class="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80"
	>
		<div class="mx-auto max-w-4xl px-4 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600"
					>
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
							/>
						</svg>
					</div>
					<div>
						<h1 class="text-xl font-bold text-slate-900 dark:text-white">AI Chat Assistant</h1>
						<p class="text-sm text-slate-600 dark:text-slate-400">Powered by Gemini AI</p>
					</div>
				</div>
				<div class="flex items-center space-x-2">
					{#if isAuthenticated}
						<span
							class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
						>
							Connected
						</span>
					{:else}
						<span
							class="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
						>
							Guest Mode
						</span>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<!-- Main Chat Interface -->
	<div class="mx-auto max-w-4xl px-4 py-6">
		<div
			class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
		>
			<!-- Chat Messages -->
			<div bind:this={chatContainer} class="h-[600px] space-y-4 overflow-y-auto p-6">
				{#each messages as message (message.id)}
					<ChatMessage {message} />
				{/each}

				{#if isLoading}
					<ChatLoading />
				{/if}

				{#if error}
					<div class="flex justify-center">
						<div
							class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-900/20"
						>
							<div class="flex items-center space-x-2">
								<svg
									class="h-5 w-5 text-red-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span class="text-sm text-red-700 dark:text-red-400">{error}</span>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Input Area -->
			<ChatInput onSend={sendMessage} {isLoading} />
		</div>

		<!-- Features Section -->
		<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
			<div
				class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20"
				>
					<svg
						class="h-6 w-6 text-blue-600 dark:text-blue-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Fast & Responsive</h3>
				<p class="text-sm text-slate-600 dark:text-slate-400">
					Get instant AI-powered responses with our optimized Gemini integration.
				</p>
			</div>

			<div
				class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20"
				>
					<svg
						class="h-6 w-6 text-purple-600 dark:text-purple-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Secure & Private</h3>
				<p class="text-sm text-slate-600 dark:text-slate-400">
					Your conversations are secure and private, with enterprise-grade security.
				</p>
			</div>

			<div
				class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20"
				>
					<svg
						class="h-6 w-6 text-green-600 dark:text-green-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
					Smart & Contextual
				</h3>
				<p class="text-sm text-slate-600 dark:text-slate-400">
					Advanced AI that understands context and provides relevant, helpful responses.
				</p>
			</div>
		</div>
	</div>
</div>

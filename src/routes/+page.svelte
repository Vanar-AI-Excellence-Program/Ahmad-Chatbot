<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	$: session = $page.data.session;
	$: isAdmin = (session?.user as any)?.role === 'admin';

	async function handleSignOut() {
		await goto('/api/auth/signout');
	}

	onMount(() => {
		// Redirect authenticated users to chatbot UI
		if (session?.user) {
			setTimeout(() => {
				goto('/chat');
			}, 2000); // Give them 2 seconds to see the home page
		}
	});
</script>

<svelte:head>
	<title>AI Chat Assistant - Home</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800"
>
	<!-- Hero Section -->
	<div class="relative overflow-hidden">
		<div class="mx-auto max-w-7xl">
			<div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
				<main
					class="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
				>
					<div class="sm:text-center lg:text-left">
						<h1
							class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white"
						>
							<span class="block">Your AI Assistant</span>
							<span class="block text-blue-600 dark:text-blue-400">Powered by Gemini</span>
						</h1>
						<p
							class="mt-3 text-base text-slate-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0 dark:text-slate-400"
						>
							Experience the future of AI conversation with our advanced chat interface. Get
							instant, intelligent responses to your questions and tasks.
						</p>
						<div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
							{#if session?.user}
								<div class="rounded-md shadow">
									<a
										href="/chat"
										class="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:px-10 md:py-4 md:text-lg"
									>
										Start Chatting
									</a>
								</div>
								<div class="mt-3 sm:mt-0 sm:ml-3">
									<a
										href="/profile"
										class="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-100 px-8 py-3 text-base font-medium text-blue-700 hover:bg-blue-200 md:px-10 md:py-4 md:text-lg"
									>
										View Profile
									</a>
								</div>
								<div class="mt-3 sm:mt-0 sm:ml-3">
									<a
										href="/chat"
										class="flex w-full items-center justify-center rounded-md border border-transparent bg-green-100 px-8 py-3 text-base font-medium text-green-700 hover:bg-green-200 md:px-10 md:py-4 md:text-lg"
									>
										Go to Chat
									</a>
								</div>
							{:else}
								<div class="rounded-md shadow">
									<a
										href="/signup"
										class="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:px-10 md:py-4 md:text-lg"
									>
										Get Started
									</a>
								</div>
								<div class="mt-3 sm:mt-0 sm:ml-3">
									<a
										href="/login"
										class="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-100 px-8 py-3 text-base font-medium text-blue-700 hover:bg-blue-200 md:px-10 md:py-4 md:text-lg"
									>
										Sign In
									</a>
								</div>
							{/if}
						</div>
					</div>
				</main>
			</div>
		</div>
	</div>

	<!-- Features Section -->
	<div class="bg-white py-12 dark:bg-slate-800">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="lg:text-center">
				<h2
					class="text-base font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400"
				>
					Features
				</h2>
				<p
					class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white"
				>
					Everything you need for AI-powered conversations
				</p>
			</div>

			<div class="mt-10">
				<div class="space-y-10 md:grid md:grid-cols-2 md:space-y-0 md:gap-x-8 md:gap-y-10">
					<div class="relative">
						<div
							class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white"
						>
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
						</div>
						<p class="ml-16 text-lg leading-6 font-medium text-slate-900 dark:text-white">
							AI Chat Interface
						</p>
						<dd class="mt-2 ml-16 text-base text-slate-500 dark:text-slate-400">
							Professional chat interface powered by Google's Gemini AI. Get instant, intelligent
							responses to your questions.
						</dd>
					</div>

					<div class="relative">
						<div
							class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white"
						>
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
						</div>
						<p class="ml-16 text-lg leading-6 font-medium text-slate-900 dark:text-white">
							Secure Authentication
						</p>
						<dd class="mt-2 ml-16 text-base text-slate-500 dark:text-slate-400">
							Enterprise-grade authentication with OAuth providers, email verification, and
							role-based access control.
						</dd>
					</div>

					<div class="relative">
						<div
							class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white"
						>
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
								/>
							</svg>
						</div>
						<p class="ml-16 text-lg leading-6 font-medium text-slate-900 dark:text-white">
							Modern Architecture
						</p>
						<dd class="mt-2 ml-16 text-base text-slate-500 dark:text-slate-400">
							Built with SvelteKit, TypeScript, and Tailwind CSS for a modern, responsive, and
							maintainable codebase.
						</dd>
					</div>

					<div class="relative">
						<div
							class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white"
						>
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 3v1m0 16v1m9-9h-1M3 12h1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
						</div>
						<p class="ml-16 text-lg leading-6 font-medium text-slate-900 dark:text-white">
							Dark Mode
						</p>
						<dd class="mt-2 ml-16 text-base text-slate-500 dark:text-slate-400">
							Beautiful dark and light themes with automatic system preference detection and manual
							toggle.
						</dd>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- CTA Section -->
	<div class="bg-blue-700 dark:bg-blue-800">
		<div class="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
			<h2 class="text-3xl font-extrabold text-white sm:text-4xl">
				<span class="block">Ready to start chatting?</span>
			</h2>
			<p class="mt-4 text-lg leading-6 text-blue-200">
				Join thousands of users who are already experiencing the future of AI conversation.
			</p>
			{#if session?.user}
				<a
					href="/chat"
					class="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 sm:w-auto"
				>
					Start Chatting Now
				</a>
			{:else}
				<a
					href="/signup"
					class="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 sm:w-auto"
				>
					Get Started Free
				</a>
			{/if}
		</div>
	</div>
</div>

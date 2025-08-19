<script lang="ts">
	import '../app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import { goto } from '$app/navigation';

	$: session = $page.data.session;
	$: isAdmin = (session?.user as { role?: string })?.role === 'admin';

	async function handleSignOut() {
		await signOut();
		goto('/chat');
	}
</script>

<div
	class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
>
	<header class="relative z-10 p-4">
		<nav class="flex items-center justify-between">
			<div class="flex items-center space-x-4">
				<a href="/" class="text-xl font-bold text-gray-900 dark:text-white"> Auth App </a>

				{#if session?.user}
					<a
						href="/profile"
						class="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
					>
						Profile
					</a>

					<a
						href="/chat"
						class="font-medium text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
					>
						AI Chat
					</a>

					{#if isAdmin}
						<a
							href="/admin"
							class="font-medium text-red-700 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100"
						>
							Admin Dashboard
						</a>
					{/if}
				{/if}
			</div>

			<div class="flex items-center space-x-4">
				{#if session?.user}
					<span class="text-sm text-gray-700 dark:text-gray-300">
						Welcome, {session.user.name || session.user.email}
						{#if isAdmin}
							<span
								class="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800"
							>
								Admin
							</span>
						{/if}
					</span>
					<button
						onclick={handleSignOut}
						class="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
					>
						Sign Out
					</button>
				{:else}
					<a
						href="/login"
						class="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
					>
						Login
					</a>
					<a
						href="/signup"
						class="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
					>
						Sign Up
					</a>
				{/if}

				<ThemeToggle />
			</div>
		</nav>
	</header>

	<main class="flex-1">
		<slot />
	</main>
</div>

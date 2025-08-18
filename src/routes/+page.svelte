<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	onMount(() => {
		// Wait a bit for session to load, then redirect
		setTimeout(() => {
			if ($page.data.session?.user) {
				goto('/profile');
			} else {
				goto('/login');
			}
		}, 100);
	});
</script>

<svelte:head>
	<title>Redirecting... - Auth App</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-lg rounded-2xl p-8">
			<div class="text-center">
				<div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
					</svg>
				</div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Redirecting...</h1>
				<p class="text-gray-600 dark:text-gray-300">
					Please wait while we redirect you to the appropriate page...
				</p>
			</div>
		</div>
	</div>
</div>

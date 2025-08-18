<script lang="ts">
	import '../app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<div
	class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
>
	<header class="relative z-10 p-4">
		<div class="flex justify-end">
			<ThemeToggle />
		</div>
	</header>

	<main class="flex-1">
		<slot />
	</main>
</div>

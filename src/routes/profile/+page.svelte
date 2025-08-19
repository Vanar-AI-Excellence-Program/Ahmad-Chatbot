<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	async function handleLogout() {
		await signOut({ redirectTo: '/login' });
	}

	function handleEditProfile() {
		// TODO: Implement edit profile functionality
		alert('Edit profile functionality coming soon!');
	}
</script>

<svelte:head>
	<title>Profile - Auth App</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div
			class="rounded-2xl border border-white/20 bg-white/30 p-8 shadow-lg backdrop-blur-md dark:border-gray-700/20 dark:bg-gray-800/30"
		>
			<div class="mb-8 text-center">
				<h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
				<p class="text-gray-600 dark:text-gray-300">Your account information</p>
			</div>

			{#if $page.data.session?.user}
				<div class="space-y-6">
					<!-- Profile Picture -->
					<div class="flex justify-center">
						<div
							class="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600"
						>
							<svg
								class="h-12 w-12 text-gray-500 dark:text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								></path>
							</svg>
						</div>
					</div>

					<!-- User Information -->
					<div class="space-y-4 rounded-lg bg-white/50 p-6 dark:bg-gray-700/50">
						<div class="flex items-center justify-between">
							<span class="font-medium text-gray-600 dark:text-gray-300">Name:</span>
							<span class="text-gray-900 dark:text-white"
								>{$page.data.session.user.name || 'Not provided'}</span
							>
						</div>

						<div class="flex items-center justify-between">
							<span class="font-medium text-gray-600 dark:text-gray-300">Email:</span>
							<span class="text-gray-900 dark:text-white">{$page.data.session.user.email}</span>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="space-y-3">
						<button
							onclick={handleEditProfile}
							class="w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Edit Profile
						</button>

						<button
							onclick={handleLogout}
							class="w-full rounded-md bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
						>
							Sign out
						</button>
					</div>

					<!-- Navigation -->
					<div class="text-center">
						<p class="text-sm text-gray-600 dark:text-gray-300">
							<a
								href="/"
								class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
							>
								← Back to home
							</a>
						</p>
					</div>
				</div>
			{:else}
				<div class="text-center">
					<p class="text-gray-600 dark:text-gray-300">Loading...</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	
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

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-lg rounded-2xl p-8">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
				<p class="text-gray-600 dark:text-gray-300">Your account information</p>
			</div>
			
			{#if $page.data.session?.user}
				<div class="space-y-6">
					<!-- Profile Picture -->
					<div class="flex justify-center">
						<div class="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
							<svg class="w-12 h-12 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
							</svg>
						</div>
					</div>
					
					<!-- User Information -->
					<div class="bg-white/50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
						<div class="flex justify-between items-center">
							<span class="text-gray-600 dark:text-gray-300 font-medium">Name:</span>
							<span class="text-gray-900 dark:text-white">{$page.data.session.user.name || 'Not provided'}</span>
						</div>
						
						<div class="flex justify-between items-center">
							<span class="text-gray-600 dark:text-gray-300 font-medium">Email:</span>
							<span class="text-gray-900 dark:text-white">{$page.data.session.user.email}</span>
						</div>
					</div>
					
					<!-- Action Buttons -->
					<div class="space-y-3">
						<button
							on:click={handleEditProfile}
							class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Edit Profile
						</button>
						
						<button
							on:click={handleLogout}
							class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
						>
							Sign out
						</button>
					</div>
					
					<!-- Navigation -->
					<div class="text-center">
						<p class="text-sm text-gray-600 dark:text-gray-300">
							<a href="/" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
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

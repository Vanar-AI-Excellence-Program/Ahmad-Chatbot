<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	
	let verificationCode = '';
	let loading = false;
	let error = '';
	let success = '';
	
	// Get email from URL params
	$: email = $page.url.searchParams.get('email') || '';
	
	async function handleSubmit() {
		if (!verificationCode.trim()) {
			error = 'Please enter the verification code';
			return;
		}
		
		loading = true;
		error = '';
		success = '';
		
		try {
			const response = await fetch('/api/verify-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					code: verificationCode.trim()
				}),
			});

			const data = await response.json();

			if (response.ok) {
				success = data.message;
				setTimeout(() => {
					goto('/login');
				}, 3000);
			} else {
				error = data.error || 'Failed to verify email';
			}
		} catch (err) {
			console.error('Verification error:', err);
			error = 'An error occurred during verification';
		} finally {
			loading = false;
		}
	}
	
	async function resendCode() {
		if (!email) {
			error = 'Email not found in URL';
			return;
		}
		
		loading = true;
		error = '';
		
		try {
			const response = await fetch('/api/resend-verification', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (response.ok) {
				success = 'Verification code resent successfully! Check your email.';
			} else {
				error = data.error || 'Failed to resend verification code';
			}
		} catch (err) {
			console.error('Resend error:', err);
			error = 'An error occurred while resending the code';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Verify Email - Auth App</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-lg rounded-2xl p-8">
			<div class="text-center mb-8">
				<div class="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
					<svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
					</svg>
				</div>
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Email</h1>
				<p class="text-gray-600 dark:text-gray-300">
					We sent a verification code to<br>
					<span class="font-medium text-blue-600 dark:text-blue-400">{email}</span>
				</p>
			</div>
			
			{#if error}
				<div class="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
					<p class="text-red-700 dark:text-red-300 text-sm">{error}</p>
				</div>
			{/if}
			
			{#if success}
				<div class="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md">
					<p class="text-green-700 dark:text-green-300 text-sm">{success}</p>
				</div>
			{/if}
			
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<div>
					<label for="code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Verification Code
					</label>
					<div class="relative">
						<svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
						</svg>
						<input
							id="code"
							type="text"
							bind:value={verificationCode}
							required
							maxlength="6"
							class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-lg font-mono tracking-widest"
							placeholder="Enter 6-digit code"
						/>
					</div>
					<p class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
						Enter the 6-digit code sent to your email
					</p>
				</div>
				
				<button
					type="submit"
					disabled={loading}
					class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					{loading ? 'Verifying...' : 'Verify Email'}
				</button>
			</form>
			
			<div class="mt-6 text-center">
				<p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
					Didn't receive the code?
				</p>
				<button
					on:click={resendCode}
					disabled={loading}
					class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium text-sm disabled:opacity-50"
				>
					Resend verification code
				</button>
			</div>
			
			<div class="mt-6 text-center">
				<p class="text-sm text-gray-600 dark:text-gray-300">
					Already verified?
					<a href="/login" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
						Sign in
					</a>
				</p>
			</div>
		</div>
	</div>
</div>

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
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					code: verificationCode.trim()
				})
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
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
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

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div
			class="rounded-2xl border border-white/20 bg-white/30 p-8 shadow-lg backdrop-blur-md dark:border-gray-700/20 dark:bg-gray-800/30"
		>
			<div class="mb-8 text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30"
				>
					<svg
						class="h-8 w-8 text-blue-600 dark:text-blue-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						></path>
					</svg>
				</div>
				<h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Verify Your Email</h1>
				<p class="text-gray-600 dark:text-gray-300">
					We sent a verification code to<br />
					<span class="font-medium text-blue-600 dark:text-blue-400">{email}</span>
				</p>
			</div>

			{#if error}
				<div
					class="mb-4 rounded-md border border-red-200 bg-red-100 p-3 dark:border-red-800 dark:bg-red-900/30"
				>
					<p class="text-sm text-red-700 dark:text-red-300">{error}</p>
				</div>
			{/if}

			{#if success}
				<div
					class="mb-4 rounded-md border border-green-200 bg-green-100 p-3 dark:border-green-800 dark:bg-green-900/30"
				>
					<p class="text-sm text-green-700 dark:text-green-300">{success}</p>
				</div>
			{/if}

			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<div>
					<label for="code" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
						Verification Code
					</label>
					<div class="relative">
						<svg
							class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
							></path>
						</svg>
						<input
							id="code"
							type="text"
							bind:value={verificationCode}
							required
							maxlength="6"
							class="w-full rounded-md border border-gray-300 bg-white/50 py-3 pr-4 pl-10 text-center font-mono text-lg tracking-widest text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
							placeholder="Enter 6-digit code"
						/>
					</div>
					<p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
						Enter the 6-digit code sent to your email
					</p>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
				>
					{loading ? 'Verifying...' : 'Verify Email'}
				</button>
			</form>

			<div class="mt-6 text-center">
				<p class="mb-3 text-sm text-gray-600 dark:text-gray-300">Didn't receive the code?</p>
				<button
					on:click={resendCode}
					disabled={loading}
					class="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-300"
				>
					Resend verification code
				</button>
			</div>

			<div class="mt-6 text-center">
				<p class="text-sm text-gray-600 dark:text-gray-300">
					Already verified?
					<a
						href="/login"
						class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
					>
						Sign in
					</a>
				</p>
			</div>
		</div>
	</div>
</div>

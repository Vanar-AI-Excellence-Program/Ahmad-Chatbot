<script lang="ts">
	export let onSend: (message: string) => void;
	export let isLoading: boolean = false;

	let inputMessage = '';

	function handleSubmit() {
		if (!inputMessage.trim() || isLoading) return;
		onSend(inputMessage.trim());
		inputMessage = '';
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
</script>

<div class="border-t border-slate-200 p-4 dark:border-slate-700">
	<div class="flex space-x-3">
		<div class="relative flex-1">
			<textarea
				bind:value={inputMessage}
				onkeypress={handleKeyPress}
				placeholder="Type your message here..."
				class="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-900"
				rows="1"
				disabled={isLoading}
			></textarea>
			<div class="absolute top-3 right-3 text-xs text-slate-400">
				Enter to send, Shift+Enter for new line
			</div>
		</div>
		<button
			onclick={handleSubmit}
			disabled={!inputMessage.trim() || isLoading}
			class="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if isLoading}
				<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			{:else}
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
					/>
				</svg>
			{/if}
			<span>Send</span>
		</button>
	</div>
</div>

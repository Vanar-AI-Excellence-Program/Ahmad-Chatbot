<script lang="ts">
	export let message: {
		id: string;
		content: string;
		role: 'user' | 'assistant';
		timestamp: Date;
	};

	function formatTime(date: Date) {
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
	<div class="max-w-[80%] {message.role === 'user' ? 'order-2' : 'order-1'}">
		<div class="flex items-end space-x-2">
			{#if message.role === 'assistant'}
				<div
					class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
				>
					<svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
						/>
					</svg>
				</div>
			{/if}

			<div
				class="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-700 {message.role === 'user'
					? 'bg-blue-500 text-white'
					: 'text-slate-900 dark:text-slate-100'}"
			>
				<p class="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
			</div>

			{#if message.role === 'user'}
				<div
					class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600"
				>
					<svg
						class="h-4 w-4 text-slate-600 dark:text-slate-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
				</div>
			{/if}
		</div>
		<div
			class="mt-2 text-xs text-slate-500 dark:text-slate-400 {message.role === 'user'
				? 'text-right'
				: 'text-left'}"
		>
			{formatTime(message.timestamp)}
		</div>
	</div>
</div>

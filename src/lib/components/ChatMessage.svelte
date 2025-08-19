<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	export let message: {
		id: string;
		content: string;
		role: 'user' | 'assistant';
		timestamp: Date;
	};

	let parsedContent = '';

	onMount(() => {
		// Configure marked for security and proper rendering
		marked.setOptions({
			breaks: true, // Convert line breaks to <br>
			gfm: true, // GitHub Flavored Markdown
			headerIds: false, // Disable header IDs for security
			mangle: false, // Disable mangling for security
			// Custom renderer to add security attributes
			renderer: new marked.Renderer()
		});

		// Parse markdown content
		if (message.role === 'assistant') {
			try {
				const rawHtml = marked(message.content);
				// Basic sanitization - remove potentially dangerous attributes
				parsedContent = rawHtml
					.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
					.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
					.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
					.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
					.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
					.replace(/javascript:/gi, '')
					.replace(/data:/gi, '');
			} catch (error) {
				console.error('Error parsing markdown:', error);
				parsedContent = message.content; // Fallback to plain text
			}
		} else {
			parsedContent = message.content; // User messages remain as plain text
		}
	});

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
				{#if message.role === 'assistant'}
					<!-- Render markdown content for assistant messages -->
					<div class="prose prose-sm max-w-none dark:prose-invert">
						{@html parsedContent}
					</div>
				{:else}
					<!-- Plain text for user messages -->
					<p class="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
				{/if}
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

<style>
	/* Custom styles for markdown content */
	:global(.prose) {
		--tw-prose-body: #475569;
		--tw-prose-headings: #1e293b;
		--tw-prose-links: #2563eb;
		--tw-prose-bold: #1e293b;
		--tw-prose-counters: #1e293b;
		--tw-prose-bullets: #1e293b;
		--tw-prose-hr: #e2e8f0;
		--tw-prose-quotes: #1e293b;
		--tw-prose-quote-borders: #e2e8f0;
		--tw-prose-captions: #94a3b8;
		--tw-prose-code: #334155;
		--tw-prose-pre-code: #e2e8f0;
		--tw-prose-pre-bg: #1e293b;
		--tw-prose-th-borders: #cbd5e1;
		--tw-prose-td-borders: #e2e8f0;
	}

	:global(.dark .prose) {
		--tw-prose-body: #cbd5e1;
		--tw-prose-headings: #f1f5f9;
		--tw-prose-links: #60a5fa;
		--tw-prose-bold: #f1f5f9;
		--tw-prose-counters: #f1f5f9;
		--tw-prose-bullets: #f1f5f9;
		--tw-prose-hr: #475569;
		--tw-prose-quotes: #f1f5f9;
		--tw-prose-quote-borders: #475569;
		--tw-prose-captions: #64748b;
		--tw-prose-code: #cbd5e1;
		--tw-prose-pre-code: #cbd5e1;
		--tw-prose-pre-bg: #0f172a;
		--tw-prose-th-borders: #475569;
		--tw-prose-td-borders: #475569;
	}

	:global(.prose h1) { font-size: 1.5em; font-weight: 600; margin: 1em 0 0.5em 0; }
	:global(.prose h2) { font-size: 1.25em; font-weight: 600; margin: 0.75em 0 0.5em 0; }
	:global(.prose h3) { font-size: 1.125em; font-weight: 600; margin: 0.75em 0 0.5em 0; }
	:global(.prose h4) { font-size: 1em; font-weight: 600; margin: 0.75em 0 0.5em 0; }
	:global(.prose h5) { font-size: 0.875em; font-weight: 600; margin: 0.75em 0 0.5em 0; }
	:global(.prose h6) { font-size: 0.75em; font-weight: 600; margin: 0.75em 0 0.5em 0; }

	:global(.prose p) { margin: 0.75em 0; line-height: 1.6; }
	:global(.prose ul) { margin: 0.75em 0; padding-left: 1.5em; }
	:global(.prose ol) { margin: 0.75em 0; padding-left: 1.5em; }
	:global(.prose li) { margin: 0.25em 0; }

	:global(.prose code) {
		background-color: #f1f5f9;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
	}

	:global(.dark .prose code) {
		background-color: #1e293b;
	}

	:global(.prose pre) {
		background-color: #1e293b;
		color: #e2e8f0;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 1em 0;
	}

	:global(.dark .prose pre) {
		background-color: #0f172a;
		color: #cbd5e1;
	}

	:global(.prose pre code) {
		background-color: transparent;
		padding: 0;
		border-radius: 0;
	}

	:global(.prose blockquote) {
		border-left: 4px solid #e2e8f0;
		padding-left: 1rem;
		margin: 1em 0;
		font-style: italic;
	}

	:global(.dark .prose blockquote) {
		border-left-color: #475569;
	}

	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1em 0;
	}

	:global(.prose th, .prose td) {
		border: 1px solid #e2e8f0;
		padding: 0.5rem;
		text-align: left;
	}

	:global(.dark .prose th, .dark .prose td) {
		border-color: #475569;
	}

	:global(.prose th) {
		background-color: #f8fafc;
		font-weight: 600;
	}

	:global(.dark .prose th) {
		background-color: #1e293b;
	}

	:global(.prose a) {
		color: #2563eb;
		text-decoration: underline;
		text-decoration-color: #93c5fd;
	}

	:global(.dark .prose a) {
		color: #60a5fa;
		text-decoration-color: #1e40af;
	}

	:global(.prose a:hover) {
		text-decoration-color: currentColor;
	}

	:global(.prose strong) {
		font-weight: 600;
	}

	:global(.prose em) {
		font-style: italic;
	}

	:global(.prose hr) {
		border: none;
		border-top: 1px solid #e2e8f0;
		margin: 2em 0;
	}

	:global(.dark .prose hr) {
		border-top-color: #475569;
	}

	/* Additional markdown-specific styles */
	:global(.prose img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		margin: 1em 0;
	}

	:global(.prose .highlight) {
		background-color: #fef3c7;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
	}

	:global(.dark .prose .highlight) {
		background-color: #451a03;
	}

	:global(.prose .task-list) {
		list-style: none;
		padding-left: 0;
	}

	:global(.prose .task-list-item) {
		display: flex;
		align-items: flex-start;
		margin: 0.5em 0;
	}

	:global(.prose .task-list-item input[type="checkbox"]) {
		margin-right: 0.5em;
		margin-top: 0.125em;
	}
</style>

<script lang="ts">
	import { browser } from '$app/environment';
	import hljs from 'highlight.js';
	import { cn } from '$utils/classnames';

	let {
		code,
		lang,
		selectedLine = $bindable(null),
		disabled = false,
		incorrectLines = new Set<number>(),
		correctLine = -1,
		showCorrect = false
	}: {
		code: string;
		lang: string;
		selectedLine: number | null;
		disabled?: boolean;
		incorrectLines?: Set<number>;
		correctLine?: number;
		showCorrect?: boolean;
	} = $props();

	const lines = $derived(
		code
			.split('\n')
			.filter((v) => v !== '')
			.map((lineContent, index) => {
				let html: string;
				if (lineContent.trim() === '') {
					html = ' ';
				} else if (lang && hljs.getLanguage(lang)) {
					html = hljs.highlight(lineContent, { language: lang, ignoreIllegals: true }).value;
				} else {
					html = lineContent.replace(/</g, '<').replace(/>/g, '>');
				}
				return { id: index, html };
			})
	);

	function handleLineSelect(index: number) {
		if (disabled || incorrectLines.has(index)) return;
		selectedLine = selectedLine === index ? null : index;
	}
</script>

{#if browser}
	<div
		class="code-container overflow-x-auto rounded-lg bg-gray-50 font-mono text-sm md:text-base dark:bg-gray-900"
		role="listbox"
		aria-label="Code lines"
		dir="ltr"
	>
		<pre class="m-0"><code class="hljs language-{lang} block min-w-full"
				><!--
			-->{#each lines as line, i (line.id)}{@const isSelected =
						i === selectedLine}{@const isCorrect =
						showCorrect && i === correctLine}{@const isIncorrect = incorrectLines.has(i)}<!--
				--><div
						class={cn(
							'line-row group flex cursor-default border-l-4 leading-relaxed',
							{ 'cursor-pointer': !disabled && !isIncorrect },
							{ 'border-green-500 bg-green-500/10': isCorrect },
							{
								'border-red-500 bg-red-500/10 text-gray-500 line-through opacity-70': isIncorrect
							},
							{ 'border-blue-500 bg-blue-500/10': isSelected && !isCorrect && !isIncorrect },
							{ 'border-transparent': !isSelected && !isCorrect && !isIncorrect },
							{ 'cursor-not-allowed': disabled }
						)}
						role="option"
						aria-selected={isSelected}
						aria-disabled={isIncorrect || disabled}
						tabindex={disabled || isIncorrect ? -1 : 0}
						onclick={() => handleLineSelect(i)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleLineSelect(i);
							}
						}}><!--
					--><span
							class={cn(
								'align line-number me-4 w-[18px] flex-shrink-0 py-1 text-right text-gray-400 select-none dark:text-gray-600',
								{
									'text-blue-600 dark:text-blue-400': isSelected && !isCorrect && !isIncorrect
								},
								{ 'text-green-600 dark:text-green-400': isCorrect }
							)}>{i + 1}</span
						><!--
					--><div
							class={cn('line-content flex-grow py-1 pr-4 whitespace-pre', {
								'group-hover:bg-gray-500/5': !disabled && !isSelected && !isCorrect && !isIncorrect
							})}><!-- eslint-disable-next-line svelte/no-at-html-tags --><!--
						-->{@html line.html}</div></div><!--
				-->{/each}</code
			></pre>
	</div>
{:else}
	{@const widths = ['w-10/12', 'w-11/12', 'w-8/12', 'w-9/12', 'w-10/12']}
	<div dir="ltr" class="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
		{#each Array(code.split('\n').length > 0 ? code.split('\n').length : 5) as _, i}
			<div class="flex animate-pulse items-center space-x-4">
				<div class="h-5 w-8 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700"></div>
				<div
					class="h-5 w-full rounded bg-gray-200 dark:bg-gray-700 {widths[i % widths.length]}"
				></div>
			</div>
		{/each}
	</div>
{/if}

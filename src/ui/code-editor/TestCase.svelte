<script lang="ts">
	import { slide } from 'svelte/transition';
	import Ansi from './Ansi.svelte';
	import { cn } from '$utils/classnames';
	import type { TestResult } from '$types/code';

	interface Props {
		testCase: TestResult;
		expanded?: boolean;
	}

	let { testCase, expanded = false }: Props = $props();

	// Separate state for showing test code
	let showTestCode = $state(false);

	const statusConfig = {
		pass: {
			icon: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
			bgClass: 'bg-green-100/80 dark:bg-green-900/20',
			iconClass: 'text-green-600 dark:text-green-400'
		},
		fail: {
			icon: 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z',
			bgClass: 'bg-red-100/80 dark:bg-red-900/20',
			iconClass: 'text-red-600 dark:text-red-400'
		},
		error: {
			icon: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
			bgClass: 'bg-yellow-100/80 dark:bg-yellow-900/20',
			iconClass: 'text-yellow-600 dark:text-yellow-400'
		}
	} as const;

	const config = statusConfig[testCase.status] || statusConfig.error;

	function toggleExpanded(): void {
		expanded = !expanded;
	}

	function toggleTestCode(event: Event): void {
		event.stopPropagation();
		showTestCode = !showTestCode;
	}

	// Reset test code visibility when collapsing main section
	$effect(() => {
		if (!expanded) {
			showTestCode = false;
		}
	});
</script>

<article
	class="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
>
	<h3>
		<button
			type="button"
			onclick={toggleExpanded}
			aria-expanded={expanded}
			class="flex w-full cursor-pointer items-center justify-between p-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
			dir="rtl"
		>
			<div class="flex flex-1 items-center gap-3">
				<div class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
					<div class={cn('absolute h-full w-full rounded-sm opacity-80', config.bgClass)}></div>
					<svg
						aria-hidden="true"
						class={cn('h-5 w-5', config.iconClass)}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path fill-rule="evenodd" d={config.icon} clip-rule="evenodd" />
					</svg>
				</div>
				<span class="text-base font-semibold text-gray-800 dark:text-gray-200">
					{testCase.name}
				</span>
			</div>
			<svg
				aria-hidden="true"
				class="ml-2 h-5 w-5 shrink-0 transform text-gray-400 transition-transform duration-300 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
				class:rotate-180={expanded}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
	</h3>

	{#if expanded}
		<div transition:slide class="mt-1 space-y-4 px-3 pt-1 pb-3">
			{#if testCase.message}
				<Ansi text={testCase.message} />
			{/if}

			{#if testCase.test_code}
				<section aria-labelledby="test-code-heading" class="mt-3">
					<div class="mb-2 flex items-center justify-between" dir="rtl">
						<div class="flex items-center gap-2">
							<svg
								aria-hidden="true"
								class="h-4 w-4 text-gray-500 dark:text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
								/>
							</svg>
							<h4
								id="test-code-heading"
								class="text-sm font-semibold text-gray-700 dark:text-gray-300"
							>
								كود الاختبار
							</h4>
						</div>

						<button
							type="button"
							onclick={toggleTestCode}
							aria-expanded={showTestCode}
							class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
							dir="ltr"
						>
							<span>{showTestCode ? 'إخفاء' : 'عرض'}</span>
							<svg
								aria-hidden="true"
								class="h-3 w-3 transform transition-transform duration-200"
								class:rotate-180={showTestCode}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
					</div>

					{#if showTestCode}
						<div transition:slide={{ duration: 250 }}>
							<pre
								class="whitespace-pre-wrap break-words rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900"><code
									class="font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200"
									>{testCase.test_code}</code
								></pre>
						</div>
					{/if}
				</section>
			{/if}
		</div>
	{/if}
</article>

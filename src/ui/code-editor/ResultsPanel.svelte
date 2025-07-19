<script lang="ts">
	import { fade } from 'svelte/transition';
	import TestCase from './TestCase.svelte';
	import Ansi from './Ansi.svelte';
	import { i18n } from '$i18n/i18n';
	import type { Submission } from '$lib/server/db/schema/submission';
	import type { JobResult, TestResult } from '$types/code';

	let { submission, error = null }: { submission?: Submission; error?: string | null } = $props();

	// --- Derived ---
	const job: JobResult | null = $derived((submission?.metadata as any)?.job || null);
	const testCases: TestResult[] = $derived((submission?.results as any)?.tests || []);
	const totalTests = $derived(testCases.length);
	const passedTests = $derived(testCases.filter((t) => t.status === 'pass').length);
	const failedTests = $derived(totalTests - passedTests);

	// --- Interaction State ---
	let expandedTestCases = $state<boolean[]>([]);

	$effect(() => {
		if (testCases.length > 0) {
			const firstFailedIndex = testCases.findIndex((t) => t.status !== 'pass');
			// Expand the first failed test, or the first test if all pass.
			expandedTestCases = testCases.map(
				(_, i) => i === (firstFailedIndex > -1 ? firstFailedIndex : 0)
			);
		}
	});

	function toggleTestCase(index: number) {
		expandedTestCases[index] = !expandedTestCases[index];
	}
</script>

<div in:fade={{ duration: 200 }} class="max-h-full overflow-y-auto pb-20">
	<!-- Priority 1: Top-level fetch/network error from parent -->
	{#if error}
		<div class="m-4 rounded-md bg-red-100 p-4 dark:bg-red-900/20">
			<div class="flex items-start gap-3">
				<svg
					class="h-6 w-6 shrink-0 text-red-600 dark:text-red-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<div>
					<h2 class="text-sm font-semibold text-red-800 dark:text-red-200">
						{i18n.t('editor.error')}
					</h2>
					<p class="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
				</div>
			</div>
		</div>
		<!-- Priority 2: Compilation or runtime error from the job -->
	{:else if job?.stderr || job?.error}
		<div class="mb-4 bg-red-100 px-4 py-2 dark:bg-red-900/20">
			<h2 class="text-sm font-semibold text-red-800 dark:text-red-200">خطأ في التشغيل</h2>
		</div>
		<div class="px-4">
			<Ansi text={job?.stderr || job?.error} />
		</div>
		<!-- Priority 3: Test results are available -->
	{:else if totalTests > 0}
		<div
			class={`mb-4 px-4 py-2 ${failedTests === 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}
		>
			<div class="flex items-center gap-3">
				{#if failedTests === 0}
					<svg
						class="h-6 w-6 text-green-600 dark:text-green-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h2 class="text-sm font-semibold text-green-800 dark:text-green-200">
						جميع الاختبارات ناجحة! ({passedTests}/{totalTests})
					</h2>
				{:else}
					<svg
						class="h-6 w-6 text-red-600 dark:text-red-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					<h2 class="text-sm font-semibold text-red-800 dark:text-red-200">
						{failedTests}
						{#if failedTests === 1}اختبار فشل{:else}اختبارات فشلت{/if}
					</h2>
				{/if}
			</div>
		</div>
		<div class="space-y-2 px-4" dir="ltr">
			{#each testCases as testCase, index}
				<TestCase {testCase} expanded={expandedTestCases[index]} />
			{/each}
		</div>
		<!-- Priority 4: Initial state, no results yet -->
	{:else}
		<div class="px-4 py-4">
			<div class="flex items-center gap-3">
				<svg
					class="h-5 w-5 text-gray-600 dark:text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h2 class="text-sm font-semibold text-gray-800 dark:text-gray-200">
					ستظهر النتائج هنا بعد تشغيل الاختبارات
				</h2>
			</div>
		</div>
	{/if}
</div>

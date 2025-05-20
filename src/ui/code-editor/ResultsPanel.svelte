<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import ConsoleOutput from './ConsoleOutput.svelte';
	import { i18n } from '$i18n/i18n';

	let { results } = $props<{ results?: any }>();

	const testCases = $derived(results?.results?.tests || []);
	const status = $derived(results?.results?.status || 'idle'); // error, pass, fail
	const message = $derived(results?.results?.message || undefined);

	let currentCodeTab = $state('test-cases');
	let expandedTestCases = $state<boolean[]>([]);

	// Derived state for test results
	let totalTests = $derived(testCases.length);
	let passedTests = $derived(testCases.filter((t) => t.status === 'pass').length);
	let failedTests = $derived(testCases.filter((t) => t.status === 'fail').length);

	$effect(() => {
		const firstFailedIndex = testCases.findIndex((t) => t.status === 'fail');
		expandedTestCases = testCases.map((_: never, i: number) => i === firstFailedIndex);
	});

	function toggleTestCase(index: number) {
		expandedTestCases[index] = !expandedTestCases[index];
	}
</script>

<!-- Console Tabs -->
<nav in:slide={{ duration: 200 }} aria-label="أقسام نتائج الاختبار">
	<div role="tablist" class="flex border-b border-gray-200 dark:border-gray-700">
		<button
			role="tab"
			id="test-cases-tab"
			aria-controls="test-cases-panel"
			aria-selected={currentCodeTab === 'test-cases'}
			onclick={() => (currentCodeTab = 'test-cases')}
			class="flex-1 px-4 py-3 text-sm font-medium text-blue-600 text-gray-500 transition-all duration-200 dark:text-blue-400 dark:text-gray-400"
		>
			نتائج الاختبار
		</button>
	</div>
</nav>

<!-- Test Cases -->
{#if currentCodeTab === 'test-cases'}
	<div
		id="test-cases-panel"
		role="tabpanel"
		aria-labelledby="test-cases-tab"
		tabindex="0"
		class="max-h-full overflow-y-auto pb-20"
		in:fade={{ duration: 200 }}
	>
		<!-- Error Message Display -->
		{#if status === 'error' && message}
			<div class="mb-4 bg-red-100 px-4 py-2 dark:bg-red-900/20">
				<div class="flex items-center space-x-3">
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
						{i18n.t('editor.error')}
					</h2>
				</div>
			</div>
			<ConsoleOutput output={message} />
		{/if}

		<!-- Results Header -->
		{#if totalTests > 0}
			<div
				class={`mb-4 px-4 py-2 ${failedTests === 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}
			>
				<div class="flex items-center space-x-3">
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
							جميع الاختبارات ناجحة! ({totalTests}/{totalTests})
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
		{:else if status !== 'error'}
			<div class="mb-4 px-4 py-4">
				<div class="flex items-center space-x-3">
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

		{#if totalTests > 0}
			<div class="space-y-3 px-4" dir="ltr">
				{#each testCases as testCase, index}
					<article
						class="group mb-4 overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
					>
						<h3>
							<button
								id={`test-case-${index}-trigger`}
								aria-expanded={expandedTestCases[index]}
								aria-controls={`test-case-${index}-content`}
								onclick={() => toggleTestCase(index)}
								class="flex w-full cursor-pointer items-center justify-between space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
								dir="rtl"
							>
								<div class="flex items-center space-x-3">
									<div class="relative flex h-8 w-8 items-center justify-center rounded-full">
										{#if testCase.status === 'pass'}
											<div
												class="absolute h-full w-full rounded-sm bg-green-100/80 opacity-80 dark:bg-green-900/20"
											></div>
											<svg
												aria-hidden="true"
												class="h-5 w-5 text-green-600 dark:text-green-400"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fill-rule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
										{:else if testCase.status === 'fail'}
											<div
												class="absolute h-full w-full rounded-sm bg-red-100/80 opacity-80 dark:bg-red-900/20"
											></div>
											<svg
												aria-hidden="true"
												class="h-5 w-5 text-red-600 dark:text-red-400"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fill-rule="evenodd"
													d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
													clip-rule="evenodd"
												/>
											</svg>
										{:else}
											<div
												class="absolute h-full w-full rounded-sm bg-yellow-100/80 opacity-80 dark:bg-yellow-900/20"
											></div>
											<svg
												aria-hidden="true"
												class="h-5 w-5 text-yellow-600 dark:text-yellow-400"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fill-rule="evenodd"
													d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
													clip-rule="evenodd"
												/>
											</svg>
										{/if}
									</div>
									<span class="text-base font-semibold text-gray-800 dark:text-gray-200">
										{testCase.name}
									</span>
								</div>
								<svg
									aria-hidden="true"
									class="ml-2 h-5 w-5 transform text-gray-400 transition-transform duration-300 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
									class:rotate-180={expandedTestCases[index]}
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
						</h3>

						{#if expandedTestCases[index]}
							<div
								transition:slide
								id={`test-case-${index}-content`}
								role="region"
								aria-labelledby={`test-case-${index}-trigger`}
								class="mt-1 space-y-4 px-3 pt-1 pb-3"
							>
								{#if testCase.message}
									<ConsoleOutput output={testCase.message} />
								{/if}

								{#if testCase.test_code}
									<section aria-labelledby={`test-code-heading-${index}`} class="mt-3">
										<div class="mb-2 flex items-center space-x-2" dir="rtl">
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
												id={`test-code-heading-${index}`}
												class="text-sm font-semibold text-gray-700 dark:text-gray-300"
											>
												كود الاختبار
											</h4>
										</div>
										<pre
											class="overflow-x-auto rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900"><code
												class="font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200"
												>{testCase.test_code}</code
											></pre>
									</section>
								{/if}
							</div>
						{/if}
					</article>
				{/each}
			</div>
		{/if}
	</div>
{/if}

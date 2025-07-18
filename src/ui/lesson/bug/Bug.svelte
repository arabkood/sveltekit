<script lang="ts">
	import SelectableCode from './SelectableCode.svelte';
	import type { BugAnswer, BugQuestion } from '$types/lesson';
	import type { Sound } from '$utils/sound';
	import { i18n } from '$i18n/i18n';
	import Markdown from '$ui/common/Markdown.svelte';
	import Button from '$ui/common/Button.svelte';
	import { fly } from 'svelte/transition';

	let {
		step,
		onNext,
		successPlayer,
		failPlayer,
		answer = $bindable(undefined)
	}: {
		step: BugQuestion;
		onNext: () => void;
		successPlayer?: Sound;
		failPlayer?: Sound;
		answer: BugAnswer | undefined;
	} = $props();

	let userSelection = $state<number | null>(null);
	let status = $state<'idle' | 'incorrect' | 'correct'>('idle');
	let isChecking = $state(false);
	let isShaking = $state(false);
	let incorrectSelections = $state(new Set<number>());
	let showHint = $state(false);

	async function handleCheck() {
		if (isChecking || userSelection === null) return;

		isChecking = true;
		showHint = false;
		await new Promise((res) => setTimeout(res, 300));

		const isCorrect = userSelection === step.solution;

		if (isCorrect) {
			answer = userSelection;
			status = 'correct';
			successPlayer?.play();
		} else {
			status = 'incorrect';
			incorrectSelections = incorrectSelections.add(userSelection);
			failPlayer?.play();
			isShaking = true;
			userSelection = null;
		}
		isChecking = false;
	}

	$effect(() => {
		if (userSelection !== null) {
			status = 'idle';
		}
	});
</script>

<div
	class="shadow-card-lg flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-700/20 bg-white dark:border-gray-100/20 dark:bg-gray-800"
>
	<main class="space-y-6 p-6">
		<div class="prose prose-sm dark:prose-invert max-w-none">
			<Markdown inline={true} markdown={step.question} />
		</div>

		<div class:animate-shake={isShaking} onanimationend={() => (isShaking = false)}>
			<SelectableCode
				lang={step.lang}
				code={step.code}
				bind:selectedLine={userSelection}
				disabled={status === 'correct' || isChecking}
				showCorrect={status === 'correct'}
				correctLine={step.solution}
				{incorrectSelections}
			/>
		</div>
	</main>

	<footer class="mt-auto border-t border-gray-200 dark:border-gray-700">
		{#if status === 'correct'}
			<div
				class="bg-green-50 p-6 text-green-800 dark:bg-green-500/10 dark:text-green-200"
				transition:fly={{ y: 20, duration: 250 }}
			>
				<div class="mb-4">
					<h3 class="mb-2 text-lg font-bold">{i18n.t('lessons.correctAnswer')}</h3>
					<Markdown markdown={step.explanation} />
				</div>
				<Button type="button" onclick={onNext} fullWidth={true}>
					{i18n.t('lessons.continue')}
				</Button>
			</div>
		{:else}
			<div class="space-y-4 bg-gray-50/50 p-4 dark:bg-gray-800/50">
				{#if step.expectedOutput || step.actualOutput}
					<div
						class="grid grid-cols-1 gap-4"
						class:sm:grid-cols-2={step.expectedOutput && step.actualOutput}
					>
						{#if step.expectedOutput}
							<div>
								<h4
									class="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
								>
									{i18n.t('lessons.expectedOutput')}
								</h4>
								<pre
									dir="auto"
									class="whitespace-pre-wrap break-words rounded-md bg-gray-100 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200"><code
										>{step.expectedOutput}</code
									></pre>
							</div>
						{/if}
						{#if step.actualOutput}
							<div>
								<h4
									class="mb-1 text-xs font-semibold tracking-wider text-red-600 uppercase dark:text-red-400"
								>
									{i18n.t('lessons.actualOutput')}
								</h4>
								<pre
									dir="auto"
									class="whitespace-pre-wrap break-words rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-500/10 dark:text-red-200"><code
										>{step.actualOutput}</code
									></pre>
							</div>
						{/if}
					</div>
				{/if}

				<div class="border-t border-gray-200 pt-4 dark:border-gray-700">
					<div class="flex min-h-[44px] items-center gap-4">
						<div class="flex-1">
							{#if status === 'incorrect'}
								<div transition:fly={{ y: -10, duration: 200, delay: 100 }}>
									<div class="flex items-center gap-4">
										<p
											class="text-sm font-semibold text-red-700 dark:text-red-300"
											aria-live="polite"
										>
											{i18n.t('lessons.tryAgain')}
										</p>
										{#if step.hint}
											<button
												onclick={() => (showHint = !showHint)}
												class="cursor-pointer text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
											>
												{showHint ? i18n.t('lessons.hideHint') : i18n.t('lessons.showHint')}
											</button>
										{/if}
									</div>

									{#if showHint}
										<div
											class="mt-3 rounded-md bg-yellow-50 p-3 text-sm text-yellow-900 dark:bg-yellow-500/10 dark:text-yellow-200"
											transition:fly={{ y: -5, duration: 150 }}
										>
											<p>{step.hint}</p>
										</div>
									{/if}
								</div>
							{:else if userSelection === null}
								<p
									class="text-sm font-semibold text-gray-500 dark:text-gray-400"
									aria-live="polite"
								>
									{i18n.t('lessons.selectLine')}
								</p>
							{/if}
						</div>

						<Button
							type="button"
							class="ms-auto"
							disabled={userSelection === null || isChecking}
							onclick={handleCheck}
							loading={isChecking}
						>
							{#if isChecking}
								{i18n.t('lessons.checking')}
							{:else}
								{i18n.t('lessons.checkAnswer')}
							{/if}
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</footer>
</div>

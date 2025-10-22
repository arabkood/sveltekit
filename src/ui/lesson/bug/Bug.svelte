<script lang="ts">
	import SelectableCode from './SelectableCode.svelte';
	import type { BugAnswer, BugQuestion } from '$types/lesson';
	import type { Sound } from '$utils/sound';
	import { i18n } from '$i18n/i18n';
	import Markdown from '$ui/common/Markdown.svelte';
	import Footer from '../shared/Footer.svelte';

	let {
		step,
		onNext,
		onSuccess,
		successPlayer,
		failPlayer,
		answer = $bindable(undefined)
	}: {
		step: BugQuestion;
		onNext: () => void;
		onSuccess?: () => void;
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
			onSuccess?.();
		} else {
			status = 'incorrect';
			incorrectSelections = incorrectSelections.add(userSelection);
			failPlayer?.play();
			isShaking = true;
			userSelection = null;
		}
		isChecking = false;
	}

	function toggleHint() {
		showHint = !showHint;
	}

	const canCheck = $derived(userSelection !== null);

	$effect(() => {
		if (userSelection !== null) {
			status = 'idle';
		}
	});
</script>

<div
	class="shadow-card-lg flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-700/20 bg-white dark:border-gray-100/20 dark:bg-gray-800"
>
	<main class="space-y-6 p-6 pb-8">
		<div class="prose prose-sm dark:prose-invert max-w-none">
			<Markdown inline={true} markdown={step.question} />
		</div>

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
							class="rounded-md bg-gray-100 p-4 text-sm break-words whitespace-pre-wrap text-gray-800 dark:bg-gray-900 dark:text-gray-200"><code
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
							class="rounded-md bg-red-50 p-4 text-sm break-words whitespace-pre-wrap text-red-800 dark:bg-red-500/10 dark:text-red-200"><code
								>{step.actualOutput}</code
							></pre>
					</div>
				{/if}
			</div>
		{/if}

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
</div>

<Footer
	{status}
	{isChecking}
	{canCheck}
	explanation={step.explanation}
	hint={step.hint}
	bind:showHint
	onCheck={handleCheck}
	{onNext}
	onToggleHint={toggleHint}
/>

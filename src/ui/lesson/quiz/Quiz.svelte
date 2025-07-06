<script lang="ts">
	import type { QuizQuestion } from '$types/lesson';
	import CodeBlock from '../shared/CodeBlock.svelte';
	import type { Sound } from '$utils/sound';
	import { i18n } from '$i18n/i18n';
	import Markdown from '$ui/common/Markdown.svelte';
	import { fly } from 'svelte/transition';
	import Button from '$ui/common/Button.svelte';

	let {
		step,
		onNext,
		successPlayer,
		failPlayer,
		answer = $bindable()
	}: {
		step: QuizQuestion;
		onNext: () => void;
		successPlayer?: Sound;
		failPlayer?: Sound;
		answer: number | null;
	} = $props();

	let selectedAnswer = $state<number | null>(null);

	let status = $state<'idle' | 'incorrect' | 'correct'>('idle');
	let wrongAnswers = $state(new Set<number>());
	let isChecking = $state(false);
	let shakingOption = $state<number | null>(null);

	const answersToRender = $derived.by(() => {
		if (status === 'correct') {
			return [step.options[step.solution]];
		}
		if (selectedAnswer !== null) {
			return [step.options[selectedAnswer]];
		}
		return [];
	});

	function handleOptionSelect(i: number) {
		status = 'idle';
		selectedAnswer = i;
	}

	async function handleCheck() {
		if (selectedAnswer === null || isChecking) return;

		isChecking = true;
		await new Promise((res) => setTimeout(res, 300));

		if (selectedAnswer === step.solution) {
			status = 'correct';
			answer = selectedAnswer;
			successPlayer?.play();
		} else {
			status = 'incorrect';
			shakingOption = selectedAnswer;
			wrongAnswers = wrongAnswers.add(selectedAnswer);
			selectedAnswer = null;
			failPlayer?.play();
		}
		isChecking = false;
	}

	function getOptionDynamicClasses(optionIndex: number): string {
		const isSelected = selectedAnswer === optionIndex;
		const isCorrectSolution = optionIndex === step.solution;
		const isWrong = wrongAnswers.has(optionIndex);

		const styles = {
			base: 'cursor-pointer focus-visible:ring-blue-500 flex w-full items-center justify-between rounded-lg border p-4 text-left text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800',
			idle: 'border-gray-300 bg-white text-gray-800 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:bg-gray-600/50',
			selected:
				'border-blue-500 bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-500/10 dark:border-blue-500',
			correct:
				'cursor-default bg-green-100 border-green-500 text-green-800 dark:bg-green-500/20 dark:border-green-500 dark:text-green-200',
			incorrect:
				'cursor-not-allowed bg-gray-100 border-gray-400 text-gray-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-500',
			faded: 'opacity-50 cursor-default'
		};

		if (status === 'correct') {
			return `${styles.base} ${isCorrectSolution ? styles.correct : `${styles.idle} ${styles.faded}`}`;
		}
		if (isWrong) {
			return `${styles.base} ${styles.incorrect}`;
		}
		if (isSelected) {
			return `${styles.base} ${styles.selected}`;
		}
		return `${styles.base} ${styles.idle}`;
	}
</script>

<div
	class="shadow-card-lg flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-gray-700/20 bg-white dark:border-gray-100/20 dark:bg-gray-800"
>
	<main class="space-y-6 p-6">
		<div>
			<Markdown inline={true} markdown={step.question} />
		</div>

		{#if step.code}
			<CodeBlock userInput={answersToRender} code={step.code} lang={step.lang} />
		{/if}

		{#if step.options && step.options.length > 0}
			<fieldset class="space-y-3">
				<legend class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
					>{i18n.t('lessons.chooseAnswer')}</legend
				>
				{#each step.options as option, i}
					{@const isCorrectSolution = step.solution === i}
					{@const isWrong = wrongAnswers.has(i)}
					<button
						type="button"
						class={getOptionDynamicClasses(i)}
						class:animate-shake={shakingOption === i}
						onclick={() => handleOptionSelect(i)}
						onanimationend={() => (shakingOption = null)}
						disabled={status === 'correct' || isWrong || isChecking}
					>
						<Markdown inline={true} markdown={String(option)} />
						{#if status === 'correct' && isCorrectSolution}
							<span class="ms-3 text-xl text-green-500 dark:text-green-400">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-label="Correct"
									><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline
										points="22 4 12 14.01 9 11.01"
									/></svg
								>
							</span>
						{/if}
					</button>
				{/each}
			</fieldset>
		{/if}
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
			<div class="flex min-h-[88px] items-center gap-4 bg-gray-50/50 p-4 dark:bg-gray-800/50">
				{#if status === 'incorrect'}
					<p
						class="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-300"
						aria-live="polite"
						transition:fly={{ y: 10, duration: 200 }}
					>
						{i18n.t('lessons.tryAgain')}
					</p>
				{/if}
				<Button
					type="button"
					class="ms-auto"
					disabled={selectedAnswer === null || isChecking}
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
		{/if}
	</footer>
</div>

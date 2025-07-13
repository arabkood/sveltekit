<script lang="ts">
	import type { FillAnswer, FillQuestion } from '$types/lesson';
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
		answer = $bindable([])
	}: {
		step: FillQuestion;
		onNext: () => void;
		successPlayer?: Sound;
		failPlayer?: Sound;
		answer: FillAnswer;
	} = $props();

	let status = $state<'idle' | 'incorrect' | 'correct'>('idle');
	let isChecking = $state(false);
	let isShaking = $state(false);
	let incorrectIndexes = $state<number[]>([]);

	// Helper function to check a single answer
	function isAnswerCorrect(userAnswer: string, solution: string): boolean {
		const trimmedSolution = solution.trim();

		// Check if the solution is a regex (e.g., /pattern/flags)
		const regexMatch = trimmedSolution.match(/^\/(.*)\/([gimuy]*)$/);

		if (regexMatch) {
			try {
				// It's a regex. regexMatch[1] is the pattern, regexMatch[2] is the flags.
				const pattern = regexMatch[1];
				const flags = regexMatch[2];
				const regex = new RegExp(pattern, flags);
				return regex.test(userAnswer);
			} catch (e) {
				console.error(`Invalid regex in solution: ${trimmedSolution}`, e);
				// If the regex in the lesson data is invalid, fail the check safely.
				return false;
			}
		} else {
			// It's a plain string. Perform a simple comparison.
			return userAnswer.trim() === trimmedSolution;
		}
	}

	async function handleCheck() {
		if (isChecking || !canCheck) return;

		isChecking = true;
		await new Promise((res) => setTimeout(res, 300));

		const currentIncorrectIndexes: number[] = [];

		step.solution.forEach((sol, i) => {
			if (!isAnswerCorrect(answer[i], sol)) {
				currentIncorrectIndexes.push(i);
			}
		});

		if (currentIncorrectIndexes.length === 0) {
			status = 'correct';
			successPlayer?.play();
		} else {
			status = 'incorrect';
			incorrectIndexes = currentIncorrectIndexes;
			failPlayer?.play();
			isShaking = true;
		}
		isChecking = false;
	}

	const canCheck = $derived(answer.every((a) => a.trim() !== ''));

	$effect(() => {
		console.log('roro', canCheck, answer, isChecking);
	});
</script>

<div
	class="shadow-card-lg flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-gray-700/20 bg-white dark:border-gray-100/20 dark:bg-gray-800"
>
	<main class="space-y-6 p-6">
		<div>
			<Markdown inline={true} markdown={step.question} />
		</div>

		<div class:animate-shake={isShaking} onanimationend={() => (isShaking = false)}>
			<CodeBlock
				code={step.code}
				lang={step.lang}
				interactive={true}
				onsubmit={handleCheck}
				disabled={status === 'correct' || isChecking}
				{incorrectIndexes}
				focusInput={incorrectIndexes?.[0] || 0}
				bind:userAnswers={answer}
			/>
		</div>
	</main>

	<footer class="mt-auto border-t border-gray-200 dark:border-gray-700">
		{#if status === 'correct'}
			<div
				class="bg-green-50 p-6 text-green-800 dark:bg-green-500/10 dark:text-green-200"
				transition:fly={{ y: 20, duration: 250 }}
			>
				<h3 class="mb-4 text-lg font-bold">{i18n.t('lessons.correctAnswer')}!</h3>
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
					loading={isChecking}
					type="button"
					disabled={!canCheck || isChecking}
					onclick={handleCheck}
					class="ms-auto"
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

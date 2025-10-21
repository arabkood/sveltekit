<script lang="ts">
	import type { FillAnswer, FillQuestion } from '$types/lesson';
	import CodeBlock from '../shared/CodeBlock.svelte';
	import type { Sound } from '$utils/sound';
	import { i18n } from '$i18n/i18n';
	import Markdown from '$ui/common/Markdown.svelte';
	import { fly } from 'svelte/transition';
	import Button from '$ui/common/Button.svelte';
	import RandExp from 'randexp';

	let {
		step,
		onNext,
		onSuccess,
		successPlayer,
		failPlayer,
		answer = $bindable([])
	}: {
		step: FillQuestion;
		onNext: () => void;
		onSuccess?: () => void;
		successPlayer?: Sound;
		failPlayer?: Sound;
		answer: FillAnswer;
	} = $props();

	let status = $state<'idle' | 'incorrect' | 'correct'>('idle');
	let isChecking = $state(false);
	let isShaking = $state(false);
	let incorrectIndexes = $state<number[]>([]);
	let failCount = $state(0);

	function isAnswerCorrect(userAnswer: string, solution: string): boolean {
		const trimmedSolution = solution.trim();
		const regexMatch = trimmedSolution.match(/^\/(.*)\/([gimuy]*)$/);

		if (regexMatch) {
			try {
				const pattern = regexMatch[1];
				const flags = regexMatch[2];
				const regex = new RegExp(pattern, flags);
				return regex.test(userAnswer);
			} catch (e) {
				console.error(`Invalid regex in solution: ${trimmedSolution}`, e);
				return false;
			}
		} else {
			return userAnswer.trim() === trimmedSolution;
		}
	}

	async function handleCheck() {
		if (isChecking || !canCheck) return;

		isChecking = true;
		await new Promise((res) => setTimeout(res, 300));

		const currentIncorrectIndexes: number[] = [];

		step.solution.forEach((sol, i) => {
			if (!isAnswerCorrect(String(answer[i]), sol)) {
				currentIncorrectIndexes.push(i);
			}
		});

		if (currentIncorrectIndexes.length === 0) {
			status = 'correct';
			successPlayer?.play();
			onSuccess?.();
		} else {
			status = 'incorrect';
			incorrectIndexes = currentIncorrectIndexes;
			failCount += 1;
			failPlayer?.play();
			isShaking = true;
		}
		isChecking = false;
	}

	function getAnswer() {
		const newAnswers = step.solution.map((sol) => {
			const trimmedSolution = String(sol).trim();
			const regexMatch = trimmedSolution.match(/^\/(.*)\/([gimuy]*)$/);

			if (regexMatch) {
				try {
					const pattern = regexMatch[1];
					const flags = regexMatch[2];
					const randexp = new RandExp(new RegExp(pattern, flags));
					randexp.min = 1;
					randexp.max = 1;
					return randexp.gen();
				} catch (e) {
					console.error(`Invalid regex for randexp: ${trimmedSolution}`, e);
					return regexMatch[1];
				}
			} else {
				return trimmedSolution;
			}
		});
		answer = newAnswers;
	}

	const canCheck = $derived(answer.every((a) => String(a).trim() !== ''));

	$effect(() => {
		if (status === 'correct') {
			failCount = 0;
		}
	});
</script>

<div
	class="shadow-card-lg flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-700/20 bg-white dark:border-gray-100/20 dark:bg-gray-800"
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
			<div
				class="flex min-h-[88px] items-center justify-between gap-4 bg-gray-50/50 p-4 dark:bg-gray-800/50"
			>
				<div>
					{#if status === 'incorrect'}
						<p
							class="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-300"
							aria-live="polite"
							transition:fly={{ y: 10, duration: 200 }}
						>
							{i18n.t('lessons.tryAgain')}
						</p>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					{#if failCount >= 3}
						<Button variant="outline" type="button" onclick={getAnswer}>
							{i18n.t('lessons.getAnswer', { defaultValue: 'Get Answer' })}
						</Button>
					{/if}
					<Button
						loading={isChecking}
						type="button"
						disabled={!canCheck || isChecking}
						onclick={handleCheck}
					>
						{#if isChecking}
							{i18n.t('lessons.checking')}
						{:else}
							{i18n.t('lessons.checkAnswer')}
						{/if}
					</Button>
				</div>
			</div>
		{/if}
	</footer>
</div>

<script lang="ts">
	import type { LessonInteractive } from '$types/lesson';
	import CodeBlock from './CodeBlock.svelte';
	import QuizFooter from './QuizFooter.svelte';
	import type { Sound } from '$utils/sound';
	import { i18n } from '$i18n/i18n';
	import Markdown from '$ui/common/Markdown.svelte';

	const {
		answer,
		setAnswer,
		step,
		onNext,
		successPlayer,
		failPlayer
	}: {
		answer: number | null;
		setAnswer: (a: number) => void;
		step: LessonInteractive;
		onNext: () => void;
		successPlayer?: Sound;
		failPlayer?: Sound;
	} = $props();

	let status = $state<'idle' | 'success' | 'fail'>('idle');

	const answersToRender = $derived(
		(() => {
			if (status === 'idle') {
				if (answer !== null) {
					return [step.options[answer]];
				}
				return [];
			}
			return [step.options[step.solution]];
		})()
	);

	$effect(() => {
		if (answer != null) {
			if (step.solution === answer) {
				status = 'success';
			} else {
				status = 'fail';
			}
		}
	});

	const handleOptionSelect = (i: number) => {
		if (status === 'success' || status === 'fail') return;

		setAnswer(i);

		if (step.solution === answer) {
			successPlayer?.play();
		} else {
			failPlayer?.play();
		}
	};

	const getOptionDynamicClasses = (optionIndex: number): string => {
		const isSelected = answer === optionIndex;
		const isOptionCorrect = optionIndex === step.solution;

		if (status === 'idle') {
			return 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-600';
		}

		const baseNonActive =
			'border-gray-300 bg-white text-gray-800 cursor-default dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 opacity-70 dark:opacity-60';

		if (status === 'success') {
			if (isSelected && isOptionCorrect) {
				return 'bg-primary-50 border-primary-500 text-primary-700 shadow-md dark:bg-primary-500/20 dark:border-primary-500 dark:text-primary-300';
			}
			return baseNonActive;
		}
		if (status === 'fail') {
			if (isSelected && !isOptionCorrect) {
				return 'bg-red-50 border-red-500 text-red-700 shadow-md dark:bg-red-500/20 dark:border-red-500 dark:text-red-300';
			}
			if (isOptionCorrect) {
				return 'bg-green-50 border-green-500 text-green-700 shadow-md dark:bg-green-500/20 dark:border-green-500 dark:text-green-300';
			}
			return baseNonActive;
		}
		return 'border-gray-300 bg-white text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200';
	};
</script>

<main
	class="shadow-card-lg w-full max-w-lg space-y-6 overflow-hidden rounded-xl border border-gray-700/20 bg-white p-6 dark:border-gray-100/20 dark:bg-gray-800"
>
	<div>
		<Markdown inline={true} markdown={step.question} />
	</div>

	{#if step.code}
		<CodeBlock
			userInput={answersToRender}
			code={step.code}
			lang={step.lang}
			codeOutput={step.output}
		/>
	{/if}
	{#if step.options && step.options.length > 0}
		<fieldset class="space-y-3">
			<legend class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
				>{i18n.t('lessons.chooseAnswer')}</legend
			>
			{#each step.options as option, i}
				{@const isSelected = answer === i}
				{@const isOptionCorrect = step.solution === i}
				<button
					type="button"
					class="focus-visible:ring-primary-500 flex w-full cursor-pointer items-center justify-between rounded-lg border p-4 text-left text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 {getOptionDynamicClasses(
						i
					)}"
					onclick={() => handleOptionSelect(i)}
					disabled={status === 'success' || status === 'fail'}
				>
					<Markdown inline={true} markdown={String(option)} />
					{#if status === 'success' && isSelected && isOptionCorrect}
						<span class="text-primary-500 dark:text-primary-400 ms-3 text-xl">
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
								><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline
									points="22 4 12 14.01 9 11.01"
								></polyline></svg
							>
						</span>
					{:else if status === 'fail'}
						{#if isSelected && !isOptionCorrect}
							<span class="ms-3 text-xl text-red-500 dark:text-red-400">
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
									aria-label="Incorrect"
								>
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</span>
						{:else if isOptionCorrect}
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
									aria-label="Correct answer"
									><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline
										points="22 4 12 14.01 9 11.01"
									></polyline></svg
								>
							</span>
						{/if}
					{/if}
				</button>
			{/each}
		</fieldset>
	{/if}

	{#if status === 'success' || status === 'fail'}
		<QuizFooter explanation={step.explanation} {status} {onNext} />
	{/if}
</main>

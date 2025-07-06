<script lang="ts">
	import SortableCode from './SortableCode.svelte';
	import type { OrderAnswer, OrderQuestion } from '$types/lesson';
	import type { Sound } from '$utils/sound';
	import { i18n } from '$i18n/i18n';
	import Markdown from '$ui/common/Markdown.svelte';
	import { fly } from 'svelte/transition';

	let {
		step,
		onNext,
		successPlayer,
		failPlayer,
		answer = $bindable([])
	}: {
		step: OrderQuestion;
		onNext: () => void;
		successPlayer?: Sound;
		failPlayer?: Sound;
		answer: OrderAnswer;
	} = $props();

	function check(answer: number[]) {
		const equalObj = (a: object, b: object) => JSON.stringify(a) === JSON.stringify(b);
		return (
			equalObj(
				answer,
				step.code.map((_, i) => i)
			) || step.alternate?.some((c) => equalObj(c, answer))
		);
	}

	function shuffle(array: number[]): number[] {
		const copiedArray = [...array];
		let currentIndex = copiedArray.length;
		while (currentIndex !== 0) {
			const randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[copiedArray[currentIndex], copiedArray[randomIndex]] = [
				copiedArray[randomIndex],
				copiedArray[currentIndex]
			];
		}
		if (check(copiedArray)) {
			return shuffle(array);
		}
		return copiedArray;
	}

	let userOrder = $state(shuffle(step.code.map((_, i) => i)));
	let status = $state<'idle' | 'incorrect' | 'correct'>('idle');
	let isChecking = $state(false);
	let isShaking = $state(false);

	async function handleCheck() {
		if (isChecking) return;

		isChecking = true;
		await new Promise((res) => setTimeout(res, 300));

		const isCorrect = check(userOrder);

		if (isCorrect) {
			answer = userOrder;
			status = 'correct';
			successPlayer?.play();
		} else {
			status = 'incorrect';
			failPlayer?.play();
			isShaking = true;
		}
		isChecking = false;
	}
</script>

<div
	class="shadow-card-lg flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-gray-700/20 bg-white dark:border-gray-100/20 dark:bg-gray-800"
>
	<main class="space-y-6 p-6">
		<div>
			<Markdown inline={true} markdown={step.question} />
		</div>

		<div class:animate-shake={isShaking} onanimationend={() => (isShaking = false)}>
			<SortableCode
				lang={step.lang}
				bind:order={userOrder}
				code={step.code}
				disabled={status === 'correct' || isChecking}
			/>
		</div>
	</main>

	<footer class="mt-auto border-t border-gray-200 dark:border-gray-700">
		{#if status === 'correct'}
			<!-- This section is identical to the other quiz component -->
			<div
				class="bg-green-50 p-6 text-green-800 dark:bg-green-500/10 dark:text-green-200"
				transition:fly={{ y: 20, duration: 250 }}
			>
				<h3 class="mb-4 text-lg font-bold">{i18n.t('lessons.correctAnswer')}!</h3>
				<button
					type="button"
					onclick={onNext}
					class="w-full rounded-lg bg-green-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:hover:bg-green-500"
				>
					{i18n.t('lessons.continue')}
				</button>
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
				<button
					type="button"
					class="bg-primary-600 hover:bg-primary-700 focus-visible:outline-primary-600 disabled:bg-primary-600/50 dark:hover:bg-primary-500 ms-auto flex w-full max-w-48 items-center justify-center rounded-lg px-5 py-3 text-base font-semibold text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
					disabled={isChecking}
					onclick={handleCheck}
				>
					{#if isChecking}
						<!-- ... Checking spinner SVG ... -->
						<span>{i18n.t('lessons.checking')}</span>
					{:else}
						<span>{i18n.t('lessons.checkAnswer')}</span>
					{/if}
				</button>
			</div>
		{/if}
	</footer>
</div>

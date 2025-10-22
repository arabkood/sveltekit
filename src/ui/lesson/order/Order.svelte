<script lang="ts">
	import SortableCode from './SortableCode.svelte';
	import type { OrderAnswer, OrderQuestion } from '$types/lesson';
	import type { Sound } from '$utils/sound';
	import Markdown from '$ui/common/Markdown.svelte';
	import Footer from '../shared/Footer.svelte';

	let {
		step,
		onNext,
		onSuccess,
		successPlayer,
		failPlayer,
		answer = $bindable([])
	}: {
		step: OrderQuestion;
		onNext: () => void;
		onSuccess?: () => void;
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

	function getIncorrectPositions(userOrder: number[]): boolean[] {
		const correctOrder = step.code.map((_, i) => i);
		const alternateOrders = step.alternate || [];

		return userOrder.map((item, index) => {
			if (correctOrder[index] === item) return false;

			for (const altOrder of alternateOrders) {
				if (altOrder[index] === item) return false;
			}

			return true;
		});
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
	let incorrectPositions = $state<boolean[]>([]);

	async function handleCheck() {
		if (isChecking) return;

		isChecking = true;
		await new Promise((res) => setTimeout(res, 300));

		const isCorrect = check(userOrder);

		if (isCorrect) {
			answer = userOrder;
			incorrectPositions = [];
			status = 'correct';
			successPlayer?.play();
			onSuccess?.();
		} else {
			status = 'incorrect';
			incorrectPositions = getIncorrectPositions(userOrder);
			failPlayer?.play();
			isShaking = true;
		}
		isChecking = false;
	}
</script>

<div
	class="shadow-card-lg flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-700/20 bg-white dark:border-gray-100/20 dark:bg-gray-800"
>
	<main class="space-y-6 p-6 pb-8">
		<div>
			<Markdown inline={true} markdown={step.question} />
		</div>

		<div class:animate-shake={isShaking} onanimationend={() => (isShaking = false)}>
			<SortableCode
				lang={step.lang}
				bind:order={userOrder}
				code={step.code}
				disabled={status === 'correct' || isChecking}
				{incorrectPositions}
			/>
		</div>
	</main>
</div>

<Footer {status} {isChecking} onCheck={handleCheck} {onNext} />

<script lang="ts">
	import TopNav from '$ui/exercise/TopNav.svelte';
	import type { PageData } from './$types';
	import Header from './Header.svelte';
	import QuizBody from './QuizBody.svelte';
	import LessonBody from './LessonBody.svelte';
	import type { Sound } from '$utils/sound';
	import SuccessPopup from '$ui/success-popup/SuccessPopup.svelte';
	import { API_ENDPOINTS } from '$api/config';
	import type { ApiError } from '$types/api';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let {
		data,
		successPlayer,
		failPlayer,
		finishPlayer
	}: { data: PageData; successPlayer?: Sound; failPlayer?: Sound; finishPlayer?: Sound } = $props();
	const { lesson, track, item, submission } = data;

	let next = $derived(data.nextItemIdx !== null ? data.module.items[data.nextItemIdx] : null);
	let prev = $derived(data.prevItemIdx !== null ? data.module.items[data.prevItemIdx] : null);

	let currentStepIndex = $state(0);
	const goToStep = (i: number) => (currentStepIndex = i);
	const currentStep = $derived(lesson.steps[currentStepIndex]);

	let answers = $state<any[]>(((submission?.data as any)?.answers as any[]) || []);
	const answer = $derived(answers[currentStepIndex]);

	let result = $state({
		showPopup: false,
		xp: item.base_xp
	});

	const setAnswer = (a: any) => (answers[currentStepIndex] = a);

	let percentCorrect = $derived(
		(() => {
			const correct = lesson.steps.reduce((prev, currV, currI) => {
				if (typeof currV === 'string') {
					return prev + 1;
				}
				if (Object.hasOwn(currV, 'solution')) {
					if (currV.solution == answers[currI]) {
						return prev + 1;
					}
				}
				return prev;
			}, 0);
			return correct > 0 ? Math.min(Math.round((correct / lesson.steps.length) * 100), 100) : 0;
		})()
	);
	let gainedXp = $derived((percentCorrect / 100) * item.base_xp);

	async function submit() {
		if (!item.id || currentStepIndex < lesson.steps.length - 1) {
			return;
		}

		const dataToSend = {
			score: percentCorrect,
			_$: btoa(Math.round(percentCorrect * 69).toString()),
			answers
		};
		const response = await fetch(API_ENDPOINTS.item.submit(data.item.id), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ data: dataToSend }),
			credentials: 'include'
		});

		if (!response.ok) {
			const error: ApiError = await response.json();
			console.error('KOOD', error);
			return;
		}

		const res = await response.json();

		result.showPopup = true;
		result.xp = res.submission.xp_reward;
	}

	const handleFinish = () => {
		if (!submission) {
			submit();
		} else {
			goto(`/courses/${track.slug}`);
		}
	};

	const handleNext = () => {
		if (currentStepIndex == lesson.steps.length - 1) {
			handleFinish();
			return;
		}
		goToStep(currentStepIndex + 1);
		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 50);
	};

	onMount(() => {
		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 100);
	});
</script>

{#if result.showPopup}
	<SuccessPopup
		onClose={() => (result.showPopup = false)}
		nextHref={`/courses/${track.slug}`}
		sound={finishPlayer}
		score={gainedXp}
	/>
{/if}

<div
	class="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
>
	<TopNav nextSlug={next?.slug} prevSlug={prev?.slug} {track} {item} />

	<Header currentStep={currentStepIndex} totalSteps={lesson.steps.length} {goToStep} />
	<div class="flex flex-1 flex-col items-center justify-center p-4">
		{#if typeof currentStep !== 'string'}
			{#key currentStep}
				<QuizBody
					{successPlayer}
					{failPlayer}
					{answer}
					{setAnswer}
					step={currentStep}
					onNext={handleNext}
				/>
			{/key}
		{/if}
		{#if typeof currentStep === 'string'}
			<LessonBody step={currentStep} onNext={handleNext} />
		{/if}
	</div>
</div>

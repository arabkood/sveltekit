<script lang="ts">
	import type { PageData } from './$types';
	import Header from './Header.svelte';
	import type { Sound } from '$utils/sound';
	import SuccessPopup from '$ui/success-popup/SuccessPopup.svelte';
	import FailPopup from '$ui/success-popup/FailPopup.svelte';
	import SignupPopup from '$ui/popup/SignupPopup.svelte';
	import { API_ENDPOINTS } from '$api/config';
	import type { ApiError } from '$types/api';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Quiz from '$ui/lesson/quiz/Quiz.svelte';
	import Fill from '$ui/lesson/fill/Fill.svelte';
	import Lesson from '$ui/lesson/lesson/Lesson.svelte';
	import Order from '$ui/lesson/order/Order.svelte';
	import type {
		BugAnswer,
		FillAnswer,
		LessonInteractiveAnswers,
		OrderAnswer,
		QuizAnswer
	} from '$types/lesson';
	import Bug from '$ui/lesson/bug/Bug.svelte';

	let {
		data,
		successPlayer,
		failPlayer,
		finishPlayer
	}: { data: PageData; successPlayer?: Sound; failPlayer?: Sound; finishPlayer?: Sound } = $props();

	const { lesson, track, item, submission, user, module } = data;

	let currentStepIndex = $state(0);
	const goToStep = (i: number) => (currentStepIndex = i);
	const currentStep = $derived(lesson.steps[currentStepIndex]);

	const getInitialAnswers = (): LessonInteractiveAnswers => {
		if (submission?.status === 'pass') {
			const savedAnswers = (submission?.data as any).answers as LessonInteractiveAnswers;
			// Validate that saved answers match current step types
			return lesson.steps.map((step, index) => {
				if (typeof step === 'object') {
					const savedAnswer = savedAnswers[index];

					if (step.type === 'fill') {
						if (
							Array.isArray(savedAnswer) &&
							savedAnswer.length === step.solution.length &&
							savedAnswer.every((a) => typeof a === 'string')
						) {
							return savedAnswer;
						}
						return new Array(step.solution.length).fill('');
					} else if (step.type === 'order') {
						if (
							Array.isArray(savedAnswer) &&
							savedAnswer.length === step.code.length &&
							savedAnswer.every((a) => typeof a === 'number')
						) {
							return savedAnswer;
						}
						return new Array(step.code.length);
					} else if (step.type === 'quiz' || step.type === 'bug') {
						if (typeof savedAnswer === 'number') {
							return savedAnswer;
						}
						return -1;
					}
				}
				return null;
			});
		}

		return lesson.steps.map((s) => {
			if (typeof s === 'object') {
				if (s.type === 'fill') {
					return new Array(s.solution.length).fill('');
				} else if (s.type === 'order') {
					return new Array(s.code.length);
				} else if (s.type === 'quiz') {
					return -1;
				} else if (s.type === 'bug') {
					return -1;
				}
			}
			return null;
		});
	};

	let answers = $state<LessonInteractiveAnswers>(getInitialAnswers());

	let result = $state({
		showPopup: false,
		xp: item.base_xp,
		status: 'wait'
	});

	let showSignupPopup = $state(false);

	let percentCorrect = 100;
	let gainedXp = $derived((percentCorrect / 100) * item.base_xp);

	async function submit() {
		if (!item.id || currentStepIndex < lesson.steps.length - 1) {
			return;
		}

		// Check for a logged-in user before submitting
		if (!user) {
			showSignupPopup = true;
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
		result.status = res.submission.status;
	}

	const handleFinish = () => {
		if (!submission || submission.status !== 'pass') {
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

{#if showSignupPopup}
	<SignupPopup onClose={() => (showSignupPopup = false)} redirectUrl={`/courses/${track.slug}`} />
{/if}

{#if result.showPopup}
	{#if result.status === 'pass'}
		<SuccessPopup
			onClose={() => (result.showPopup = false)}
			nextHref={`/courses/${track.slug}`}
			sound={finishPlayer}
			score={gainedXp}
			courseTitle={track.title}
		/>
	{:else}
		<FailPopup
			continueHref={`/courses/${track.slug}`}
			retryHref={`/courses/${track.slug}/${item.slug}/lesson`}
		/>
	{/if}
{/if}

<div
	class="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
>
	<Header
		{track}
		{module}
		{item}
		currentStep={currentStepIndex}
		totalSteps={lesson.steps.length}
		{goToStep}
	/>
	<div class="flex flex-1 flex-col items-center justify-center p-4">
		{#if typeof currentStep !== 'string'}
			{#key currentStep}
				{#if currentStep.type === 'fill'}
					<Fill
						bind:answer={answers[currentStepIndex] as FillAnswer}
						{successPlayer}
						{failPlayer}
						step={currentStep}
						onNext={handleNext}
					/>
				{:else if currentStep.type === 'quiz'}
					<Quiz
						bind:answer={answers[currentStepIndex] as QuizAnswer}
						{successPlayer}
						{failPlayer}
						step={currentStep}
						onNext={handleNext}
					/>
				{:else if currentStep.type === 'order'}
					<Order
						bind:answer={answers[currentStepIndex] as OrderAnswer}
						{successPlayer}
						{failPlayer}
						step={currentStep}
						onNext={handleNext}
					/>
				{:else if currentStep.type === 'bug'}
					<Bug
						bind:answer={answers[currentStepIndex] as BugAnswer}
						{successPlayer}
						{failPlayer}
						step={currentStep}
						onNext={handleNext}
					/>
				{/if}
			{/key}
		{/if}
		{#if typeof currentStep === 'string'}
			<Lesson step={currentStep} onNext={handleNext} />
		{/if}
	</div>
</div>

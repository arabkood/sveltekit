<script lang="ts">
	import type { PageData } from './$types';
	import Header from './Header.svelte';
	import type { Sound } from '$utils/sound';
	import SuccessPopup from '$ui/popup/SuccessPopup.svelte';
	import FailPopup from '$ui/popup/FailPopup.svelte';
	import SignupPopup from '$ui/popup/SignupPopup.svelte';
	import { API_ENDPOINTS } from '$api/config';
	import type { ApiError } from '$types/api';
	import { beforeNavigate, goto } from '$app/navigation';
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
	import { page } from '$app/state';
	import Seo from '$ui/others/SEO.svelte';
	import { getDraftItem, removeDraftItem, setDraftItem, type DraftItem } from '../draftStorage';
	import { debounce } from '$utils/debounce';
	import { distributeXP } from './xpPerStep';

	let {
		data,
		successPlayer,
		failPlayer,
		finishPlayer
	}: { data: PageData; successPlayer?: Sound; failPlayer?: Sound; finishPlayer?: Sound } = $props();

	const { lesson, track, item, submission, user, module } = data;

	// SEO data
	const cleanTitle = $derived(
		item.title.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim()
	);
	const seoTitle = $derived(`${cleanTitle} - ${track.title} | أكود`);
	const seoDescription = $derived(
		`تعلم ${cleanTitle} ضمن مسار ${track.title} على منصة أكود - درس تفاعلي بـ ${lesson.steps.length} خطوة للمبتدئين`
	);
	const seoKeywords = $derived(
		`${cleanTitle}, ${track.title}, تعلم البرمجة, بايثون بالعربي, برمجة للمبتدئين, أكود`
	);

	let currentStepIndex = $state(
		(() => {
			const draft = getDraftItem(item.id);
			if (typeof draft?.csi === 'number') {
				if (draft.csi < lesson.steps.length && draft.csi > 0) {
					const url = new URL(page.url);

					if (url.searchParams.get('s') != draft.csi.toString()) {
						url.searchParams.set('s', draft.csi.toString());
						window.history.replaceState({}, '', url);
					}

					return draft.csi;
				}
			}
			return 0;
		})()
	);
	let lessonStartTime = Date.now();
	let stepStartTime = Date.now();

	const goToStep = (i: number) => {
		const timeSpentOnStep = Math.floor((Date.now() - stepStartTime) / 1000);

		window.posthog?.capture('step_navigated', {
			lesson_id: item.id,
			lesson_title: item.title,
			from_step: currentStepIndex,
			to_step: i,
			time_spent_seconds: timeSpentOnStep,
			track_slug: track.slug,
			module_slug: module.position
		});

		currentStepIndex = i;

		stepStartTime = Date.now(); // Reset timer

		// change param to indicate current step for tracking
		const url = new URL(page.url);
		url.searchParams.set('s', i.toString());
		window.history.replaceState({}, '', url);
	};
	const currentStep = $derived(lesson.steps[currentStepIndex]);

	const validateStepAnswer = (step: any, savedAnswer: any) => {
		if (typeof step !== 'object') return null;

		if (step.type === 'fill') {
			if (
				Array.isArray(savedAnswer) &&
				savedAnswer.length === step.solution.length &&
				savedAnswer.every((a) => typeof a === 'string')
			) {
				return savedAnswer;
			}
			return new Array(step.solution.length).fill('');
		}

		if (step.type === 'order') {
			if (
				Array.isArray(savedAnswer) &&
				savedAnswer.length === step.code.length &&
				savedAnswer.every((a) => typeof a === 'number')
			) {
				return savedAnswer;
			}
			return new Array(step.code.length);
		}

		if (step.type === 'quiz' || step.type === 'bug') {
			if (typeof savedAnswer === 'number') {
				return savedAnswer;
			}
			return -1;
		}

		return null;
	};

	const getInitialAnswers = (): LessonInteractiveAnswers => {
		if (submission?.status === 'pass') {
			const savedAnswers = (submission?.data as any).answers as LessonInteractiveAnswers;
			// Validate that saved answers match current step types
			return lesson.steps.map((step, index) => validateStepAnswer(step, savedAnswers[index]));
		}

		const draft = getDraftItem(item.id);
		if (draft) {
			// Validate that draft answers match current step types
			return lesson.steps.map((step, index) => validateStepAnswer(step, draft.a?.[index]));
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

	// Store lesson state for X time
	$effect(() => {
		if (typeof window === 'undefined') return;

		answers;
		currentStepIndex;
		debounce(() => {
			setDraftItem<DraftItem>(item.id, {
				a: answers,
				csi: Math.max(currentStepIndex, maxStepIndex),
				tt: lesson.steps.length
			});
		}, 200)();
	});

	let result = $state({
		showPopup: false,
		xp: item.baseXp,
		status: 'wait'
	});

	let showSignupPopup = $state(false);
	let maxStepIndex = $state(submission && submission.status === 'pass' ? answers.length - 1 : 0);
	const xpPerStep = $derived(distributeXP(lesson.steps, item.baseXp || 0));

	let userXP = $state(
		xpPerStep.slice(0, Math.max(currentStepIndex, maxStepIndex)).reduce((sum, xp) => sum + xp, 0)
	);
	let xpGain = $state(0);

	let percentCorrect = 100;
	let gainedXp = $derived((percentCorrect / 100) * (item.baseXp || 0));

	$effect(() => {
		if (submission && submission.status === 'pass') {
			maxStepIndex = answers.length - 1;
		} else {
			maxStepIndex = Math.max(currentStepIndex, maxStepIndex);
		}
	});

	async function submit() {
		if (!item.id || currentStepIndex < lesson.steps.length - 1) {
			return;
		}

		// Check for a logged-in user before submitting
		if (!user) {
			// Track that user tried to submit without login
			window.posthog?.capture('submission_blocked_no_login', {
				lesson_id: item.id,
				lesson_title: item.title,
				steps_completed: currentStepIndex + 1
			});

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

			// Track submission failure
			window.posthog?.capture('lesson_submission_failed', {
				lesson_id: item.id,
				lesson_title: item.title,
				error_code: response.status,
				track_slug: track.slug
			});
			return;
		}

		const res = await response.json();

		// Track successful submission
		const totalTimeSpent = Math.floor((Date.now() - lessonStartTime) / 1000);
		window.posthog?.capture('lesson_completed', {
			lesson_id: item.id,
			lesson_title: item.title,
			track_slug: track.slug,
			module_pos: module?.position,
			score: percentCorrect,
			xp_earned: res.submission.xp_reward,
			total_steps: lesson.steps.length,
			time_spent_seconds: totalTimeSpent,
			submission_status: res.submission.status
		});

		removeDraftItem(item.id);

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

	const increaseUIXp = (amount: number) => {
		console.log('+' + amount + 'XP');
		userXP += amount;
		xpGain = amount;
	};

	const handleSuccess = () => {
		if (currentStepIndex >= maxStepIndex && maxStepIndex < lesson.steps.length - 1) {
			increaseUIXp(xpPerStep[currentStepIndex]);
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
		// Track lesson start
		window.posthog?.capture('lesson_started', {
			lesson_id: item.id,
			lesson_title: item.title,
			track_slug: track.slug,
			module_pos: module.position,
			total_steps: lesson.steps.length,
			previously_status: submission?.status
		});

		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 100);

		// Track abandonment on component cleanup
		return () => {
			if (submission?.status !== 'pass' && result.status !== 'pass' && currentStepIndex > 0) {
				const timeSpent = Math.floor((Date.now() - lessonStartTime) / 1000);
				window.posthog?.capture('lesson_abandoned', {
					lesson_id: item.id,
					lesson_title: item.title,
					track_slug: track.slug,
					last_step_reached: currentStepIndex,
					total_steps: lesson.steps.length,
					completion_percentage: Math.floor(((currentStepIndex + 1) / lesson.steps.length) * 100),
					time_spent_seconds: timeSpent
				});
			}
		};
	});

	beforeNavigate(({ cancel }) => {
		if (submission?.status !== 'pass' && result.status !== 'pass' && currentStepIndex > 0) {
			const shouldLeave = confirm('لديك تقدم غير محفوظ. هل أنت متأكد أنك تريد مغادرة هذه الصفحة؟');

			if (!shouldLeave) {
				cancel();
			}
		}
	});

	onMount(() => {
		const handleBeforeUnload = (e: any) => {
			if (submission?.status !== 'pass' && result.status !== 'pass' && currentStepIndex > 0) {
				e.preventDefault();
				e.returnValue = '';
				return '';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	});
</script>

<Seo title={seoTitle} description={seoDescription} keywords={seoKeywords} />

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
		{maxStepIndex}
		xp={userXP}
		xpIncrement={xpGain}
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
						onSuccess={handleSuccess}
					/>
				{:else if currentStep.type === 'quiz'}
					<Quiz
						bind:answer={answers[currentStepIndex] as QuizAnswer}
						{successPlayer}
						{failPlayer}
						step={currentStep}
						onNext={handleNext}
						onSuccess={handleSuccess}
					/>
				{:else if currentStep.type === 'order'}
					<Order
						bind:answer={answers[currentStepIndex] as OrderAnswer}
						{successPlayer}
						{failPlayer}
						step={currentStep}
						onNext={handleNext}
						onSuccess={handleSuccess}
					/>
				{:else if currentStep.type === 'bug'}
					<Bug
						bind:answer={answers[currentStepIndex] as BugAnswer}
						{successPlayer}
						{failPlayer}
						step={currentStep}
						onNext={handleNext}
						onSuccess={handleSuccess}
					/>
				{/if}
			{/key}
		{/if}
		{#if typeof currentStep === 'string'}
			<Lesson
				step={currentStep}
				onNext={() => {
					handleSuccess();
					handleNext();
				}}
			/>
		{/if}
	</div>
</div>

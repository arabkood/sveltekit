<script lang="ts">
	import TopNav from '$ui/exercise/TopNav.svelte';
	import type { PageData } from './$types';
	import Header from './Header.svelte';
	import QuizBody from './QuizBody.svelte';
	import LessonBody from './LessonBody.svelte';
	import { goto } from '$app/navigation';
	import type { Sound } from '$utils/sound';

	let {
		data,
		successPlayer,
		failPlayer
	}: { data: PageData; successPlayer?: Sound; failPlayer?: Sound } = $props();
	const { lesson, track, item } = data;

	let next = $derived(data.nextItemIdx !== null ? data.module.items[data.nextItemIdx] : null);
	let prev = $derived(data.prevItemIdx !== null ? data.module.items[data.prevItemIdx] : null);

	let currentStepIndex = $state(0);
	const goToStep = (i: number) => (currentStepIndex = i);
	const currentStep = $derived(lesson.steps[currentStepIndex]);
	let answers = $state<any[]>([]);
	const answer = $derived(answers[currentStepIndex]);

	const setAnswer = (a: any) => (answers[currentStepIndex] = a);
	const handleNext = () => {
		if (currentStepIndex == lesson.steps.length - 1) {
			if (next) {
				// goto(`/courses/${track.slug}/${next.slug}/${next.type}`);
				goto(`/courses/${track.slug}`);
			} else {
				goto(`/courses/${track.slug}`);
			}
		}
		goToStep(currentStepIndex + 1);
		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 50);
	};
</script>

<div class="bg-page flex min-h-screen flex-col">
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

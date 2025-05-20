<script lang="ts">
	import type { LessonMarkdown } from '$types/lesson';
	import Markdown from '$ui/common/Markdown.svelte';
	import QuizFooter from './QuizFooter.svelte';

	const {
		step,
		onNext
	}: {
		step: LessonMarkdown;
		onNext: () => void;
	} = $props();

	let status = $state<'idle' | 'success' | 'fail' | 'explanation'>('idle');
</script>

<main
	class="shadow-card-lg w-full max-w-lg space-y-6 overflow-hidden rounded-xl bg-white p-6 dark:bg-gray-800"
>
	<Markdown evalPublicAssets={true} markdown={step} />

	<QuizFooter {status} {onNext} />
</main>

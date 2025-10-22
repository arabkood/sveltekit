<script lang="ts">
	import type { LessonMarkdown } from '$types/lesson';
	import Markdown from '$ui/common/Markdown.svelte';
	import Footer from '../shared/Footer.svelte';

	const {
		step,
		onNext
	}: {
		step: LessonMarkdown;
		onNext: () => void;
	} = $props();
</script>

<div
	class="shadow-card-lg flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-700/20 bg-white dark:border-gray-100/20 dark:bg-gray-800"
>
	<main class="space-y-6 p-6 pb-8">
		<Markdown evalPublicAssets={true} markdown={step} />
	</main>
</div>

<Footer {onNext} />

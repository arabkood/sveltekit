<script lang="ts">
	import type { Item, Track } from '$lib/server/db/schema/class';
	import Icon from '$ui/common/Icon.svelte';

	const {
		currentStep,
		totalSteps,
		track,
		item,
		goToStep
	}: {
		currentStep: number;
		track: Track;
		item: Item;
		totalSteps: number;
		goToStep: (i: number) => void;
	} = $props();
</script>

<header
	class="flex items-center justify-end border-b border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
>
	<nav class="me-auto flex min-w-0 items-center gap-1 text-sm">
		<a
			class="truncate rounded px-2 py-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
			href={`/courses/${track?.slug}`}
			title={track.title}>{track.title}</a
		>
		<Icon class="shrink-0 text-gray-400 dark:text-gray-500" name="chevron-left" size={18} />
		<span class="truncate px-2 py-1 font-medium text-gray-800 dark:text-gray-100" title={item.title}
			>{item.title}</span
		>
	</nav>

	<div class="flex items-center space-x-2">
		{#each { length: totalSteps } as _, i}
			{@const stepNumber = i + 1}
			<button
				type="button"
				class="focus-visible:ring-primary-500 h-2.5 w-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-800"
				class:bg-primary-500={i < currentStep}
				class:bg-primary-400={i === currentStep}
				class:scale-125={i === currentStep}
				class:bg-slate-300={i > currentStep}
				class:dark:bg-slate-600={i > currentStep}
				class:cursor-pointer={i < currentStep}
				class:hover:bg-primary-600={i < currentStep}
				aria-label={i < currentStep
					? `Go to step ${stepNumber}`
					: `Step ${stepNumber}${i === currentStep ? ' (Current)' : ''}`}
				disabled={i >= currentStep}
				onclick={() => goToStep(i)}
			>
				<span class="sr-only">
					{i < currentStep ? `Go to step ${stepNumber}` : `Step ${stepNumber}`}
					{i === currentStep ? ' (Current)' : ''}
					{i < currentStep ? ' (Completed)' : ''}
					{i > currentStep ? ' (Upcoming)' : ''}
				</span>
			</button>
		{/each}
	</div>
</header>

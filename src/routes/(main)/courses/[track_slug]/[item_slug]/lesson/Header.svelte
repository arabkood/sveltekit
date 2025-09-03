<script lang="ts">
	import type { Item, Module, Track } from '$lib/server/db/schema/class';
	import Icon from '$ui/common/Icon.svelte';

	const {
		currentStep,
		totalSteps,
		track,
		module,
		item,
		goToStep
	}: {
		currentStep: number;
		track: Track;
		module: Module;
		item: Item;
		totalSteps: number;
		goToStep: (i: number) => void;
	} = $props();
</script>

<header
	class="flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
>
	<nav class="hidden min-w-0 items-center gap-1 text-sm md:flex">
		<a
			class="truncate rounded px-2 py-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
			href={`/courses/${track?.slug}`}
			title={module.title}>{String(module.position).padStart(3, '0')} - {module.title}</a
		>
		<Icon class="shrink-0 text-gray-400 dark:text-gray-500" name="chevron-left" size={18} />
		<span class="truncate px-2 py-1 font-medium text-gray-800 dark:text-gray-100" title={item.title}
			>{String(item.position).padStart(2, '0')} - {item.title}</span
		>
	</nav>

	<div class="flex min-w-0 items-center md:hidden">
		<a
			href={`/courses/${track?.slug}`}
			class="me-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
			aria-label="Back to track"
			title={track.title}
		>
			<Icon name="arrow-right" size={20} />
		</a>
		<span
			class="truncate text-sm font-medium text-slate-800 dark:text-slate-100"
			title={item.title}
		>
			{item.title}
		</span>
	</div>

	<div class="hidden items-center space-x-2 md:flex">
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
				</span>
			</button>
		{/each}
	</div>

	<div class="text-sm font-medium text-slate-500 md:hidden dark:text-slate-400">
		{currentStep + 1} / {totalSteps}
	</div>
</header>

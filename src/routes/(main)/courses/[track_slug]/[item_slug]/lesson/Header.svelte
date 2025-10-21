<script lang="ts">
	import type { Item, Module, Track } from '$lib/server/db/repos/class';
	import Icon from '$ui/common/Icon.svelte';
	import IconPng from '$ui/common/IconPng.svelte';
	import { quintOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	let {
		currentStep,
		totalSteps,
		track,
		module,
		item,
		maxStepIndex,
		goToStep,
		xp,
		xpIncrement = $bindable(0)
	}: {
		currentStep: number;
		track: Track;
		module: Module;
		item: Item;
		totalSteps: number;
		maxStepIndex: number;
		goToStep: (i: number) => void;
		xp: number;
		xpIncrement: number;
	} = $props();

	let displayXP = $state(xp);
	let showIncrement = $state(false);

	// Animated XP counter
	const xpTween = new Tween(xp, {
		duration: 800,
		easing: quintOut
	});

	// Watch for xpIncrement changes from parent
	$effect(() => {
		if (xpIncrement > 0) {
			showIncrement = true;
			xpTween.set(xp);
		}
	});

	// Sync displayXP with tween
	$effect(() => {
		displayXP = xpTween.current;
	});

	function floatUp(node: HTMLElement, params?: { duration?: number }) {
		return {
			duration: params?.duration || 2000,
			css: (t: any) => {
				const eased = quintOut(t);
				return `
					opacity: ${1 - eased};
					transform: translateY(-${eased * 40}px) scale(${1 + eased * 0.5});
				`;
			}
		};
	}

	function pulse(node: HTMLElement) {
		return {
			duration: 600,
			css: (t: any) => {
				const eased = quintOut(t);
				const scale = 1 + Math.sin(eased * Math.PI) * 0.15;
				return `
					transform: scale(${scale});
					box-shadow: 0 0 ${Math.sin(eased * Math.PI) * 20}px rgba(234, 179, 8, 0.6);
				`;
			}
		};
	}

	function handleAnimationEnd() {
		showIncrement = false;
		xpIncrement = 0; // Reset via binding
	}
</script>

<header
	class="flex items-center gap-4 border-b border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
>
	<nav class="me-auto hidden min-w-0 items-center gap-1 text-sm md:flex">
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

	<div
		dir="ltr"
		class="font-hacker relative flex rounded-3xl border-1 border-yellow-700 bg-yellow-950 px-2 py-0.5 transition-all"
	>
		{#if showIncrement && xpIncrement > 0}
			<div class="absolute inset-0 rounded-3xl" in:pulse></div>
		{/if}
		<IconPng name="bolt" size={24} />
		<span class="pe-2 text-yellow-300">{Math.round(displayXP)}</span>
		{#if showIncrement && xpIncrement > 0}
			<div
				in:floatUp
				onintroend={handleAnimationEnd}
				class="absolute top-[130%] right-0 left-0 text-center text-lg font-bold text-green-400"
			>
				+{xpIncrement}
			</div>
		{/if}
	</div>

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
				class:bg-primary-500={i <= maxStepIndex}
				class:bg-primary-400={i === maxStepIndex}
				class:scale-125={i === currentStep}
				class:ring-2={i === currentStep}
				class:ring-slate-500={i === currentStep}
				class:bg-slate-300={i > maxStepIndex}
				class:dark:bg-slate-600={i > maxStepIndex}
				class:cursor-pointer={i <= maxStepIndex}
				class:hover:bg-primary-600={i <= maxStepIndex}
				aria-label={i <= maxStepIndex
					? `Go to step ${stepNumber}`
					: `Step ${stepNumber}${i === currentStep ? ' (Current)' : ''}`}
				onclick={() => goToStep(i)}
				disabled={i > maxStepIndex}
			>
				<span class="sr-only">
					{i <= maxStepIndex ? `Go to step ${stepNumber}` : `Step ${stepNumber}`}
					{i === currentStep ? ' (Current)' : ''}
				</span>
			</button>
		{/each}
	</div>

	<div class="text-sm font-medium text-slate-500 md:hidden dark:text-slate-400">
		{currentStep + 1} / {totalSteps}
	</div>
</header>

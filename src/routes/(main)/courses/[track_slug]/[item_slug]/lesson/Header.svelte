<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import type { Item, Module, Track } from '$lib/server/db/repos/class';
	import Icon from '$ui/common/Icon.svelte';
	import IconPng from '$ui/common/IconPng.svelte';
	import { cn } from '$utils/classnames';
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
			css: (t: number) => {
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
			css: (t: number) => {
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
		xpIncrement = 0;
	}

	const progressPercentage = $derived(Math.round(((currentStep + 1) / totalSteps) * 100));
	const isNearCompletion = $derived(progressPercentage >= 80);
	const stepsRemaining = $derived(totalSteps - currentStep - 1);

	function prevStep() {
		if (currentStep > 0) {
			goToStep(currentStep - 1);
		}
	}

	function nextStep() {
		if (currentStep < maxStepIndex) {
			goToStep(currentStep + 1);
		}
	}
</script>

<header
	class="flex items-center gap-4 border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
>
	<nav class="me-auto hidden min-w-0 items-center gap-1 text-sm md:flex">
		<a
			class={cn(
				'truncate rounded px-2 py-1 transition-colors',
				'text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
			)}
			href={`/courses/${track?.slug}`}
			title={module.title}>{String(module.position).padStart(3, '0')} - {module.title}</a
		>
		<Icon class="shrink-0 text-gray-400 dark:text-gray-500" name="chevron-left" size={18} />
		<span class="truncate px-2 py-1 font-medium text-gray-800 dark:text-gray-100" title={item.title}
			>{String(item.position).padStart(2, '0')} - {item.title}</span
		>
	</nav>

	<!-- Mobile Navigation -->
	<a class="me-auto flex min-w-0 items-center md:hidden" href={`/courses/${track?.slug}`}>
		<span
			class={cn(
				'me-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
				'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
			)}
		>
			<Icon name="arrow-right" size={20} />
		</span>
		<span class="truncate text-sm font-medium text-gray-800 dark:text-gray-100" title={item.title}>
			العودة للمسار
		</span>
	</a>

	<!-- XP Display -->
	<div
		dir="ltr"
		class="font-hacker relative flex items-center rounded-3xl border border-yellow-700 bg-yellow-950 px-2 py-0.5 transition-all"
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

	<!-- Progress Bar Navigation (Desktop) -->
	<div class="hidden max-w-lg flex-1 items-center gap-3 md:flex">
		<!-- Previous Button -->
		<button
			type="button"
			onclick={prevStep}
			disabled={currentStep === 0}
			class={cn(
				'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40',
				'bg-gray-100 text-gray-600 hover:scale-105 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
			)}
			aria-label="الخطوة السابقة"
		>
			<Icon name="chevron-right" size={20} />
		</button>

		<!-- Progress Container -->
		<div class="group relative flex-1 py-6">
			<!-- Progress Info -->
			<div
				class={cn({
					'absolute start-0 top-0 z-10 flex items-center gap-3 transition-all duration-200 group-hover:opacity-100': true,
					'opacity-0': stepsRemaining > 0
				})}
			>
				{#if stepsRemaining > 0}
					<span class="text-sm font-bold text-gray-700 dark:text-gray-300">
						متبقي {stepsRemaining}
						{stepsRemaining === 1 ? 'خطوة' : stepsRemaining === 2 ? 'خطوتان' : 'خطوات'}
					</span>
				{:else}
					<span class="text-sm font-bold text-green-600 dark:text-green-400"> ✓ مكتمل! </span>
				{/if}

				{#if isNearCompletion && stepsRemaining > 0}
					<span
						class="font-hacker animate-pulse text-sm font-bold text-orange-600 dark:text-orange-400"
					>
						🔥 أوشكت على الإنتهاء
					</span>
				{/if}
			</div>

			<!-- Progress Bar -->
			<div class="relative h-2.5 rounded-full bg-gray-200 shadow-inner dark:bg-gray-700">
				<!-- Fill -->
				<div
					class={cn(
						'absolute inset-y-0 rounded-full shadow-sm transition-all duration-500 ease-out',
						!isNearCompletion && 'bg-emerald-500',
						isNearCompletion && 'bg-gradient-to-l from-emerald-500 to-orange-500'
					)}
					style="inset-inline-start: 0; width: {progressPercentage}%"
				></div>

				<!-- Current Position Indicator -->
				<div
					class="pointer-events-none absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
					style="inset-inline-start: calc({progressPercentage}% - 0.375rem)"
				>
					<div
						class={cn(
							'flex h-5 w-5 items-center justify-center rounded-full border-[3px] bg-white shadow-lg ring-2 ring-white transition-all dark:bg-gray-800 dark:ring-gray-800',
							!isNearCompletion && 'border-emerald-500',
							isNearCompletion && 'scale-110 border-orange-500'
						)}
					>
						<div
							class={cn(
								'h-2 w-2 rounded-full transition-all',
								!isNearCompletion && 'bg-emerald-500',
								isNearCompletion && 'bg-orange-500'
							)}
						></div>
					</div>
				</div>
			</div>

			<!-- Step counter below bar -->
			<div
				class={cn({
					'font-hacker absolute start-0 bottom-0 flex items-center gap-2 text-xs transition-all duration-200 group-hover:opacity-100': true,
					'opacity-0': stepsRemaining > 0
				})}
			>
				<span class="font-bold text-gray-500 dark:text-gray-400">{totalSteps}</span>
				<span class="text-gray-400">/</span>
				<span class="font-bold text-emerald-600 dark:text-emerald-400">{currentStep + 1}</span>
			</div>
		</div>

		<!-- Next Button -->
		<button
			type="button"
			onclick={nextStep}
			disabled={currentStep >= maxStepIndex}
			class={cn(
				'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40',
				currentStep < maxStepIndex &&
					'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 hover:scale-105 hover:bg-emerald-600',
				currentStep >= maxStepIndex &&
					'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
			)}
			aria-label="الخطوة التالية"
		>
			<Icon name="chevron-left" size={20} />
		</button>
	</div>

	<!-- Mobile Progress -->
	<div class="flex items-center gap-2 md:hidden">
		<button
			type="button"
			onclick={prevStep}
			disabled={currentStep === 0}
			class={cn(
				'flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-30',
				'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
			)}
			aria-label="الخطوة السابقة"
		>
			<Icon name="chevron-right" size={18} />
		</button>

		<div class="flex flex-col items-center">
			<span class="font-hacker text-sm font-bold text-emerald-600 dark:text-emerald-400">
				{currentStep + 1}/{totalSteps}
			</span>
			{#if stepsRemaining > 0}
				<span class="text-[10px] font-medium text-gray-500 dark:text-gray-400">
					متبقي {stepsRemaining}
				</span>
			{:else}
				<span class="text-[10px] font-bold text-green-600 dark:text-green-400"> مكتمل ✓ </span>
			{/if}
		</div>

		<button
			type="button"
			onclick={nextStep}
			disabled={currentStep >= maxStepIndex}
			class={cn(
				'flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-30',
				currentStep < maxStepIndex && 'bg-emerald-500 text-white hover:bg-emerald-600',
				currentStep >= maxStepIndex &&
					'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
			)}
			aria-label="الخطوة التالية"
		>
			<Icon name="chevron-left" size={18} />
		</button>
	</div>
</header>

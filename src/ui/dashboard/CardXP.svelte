<script lang="ts">
	import IconPng from '$ui/common/IconPng.svelte';
	import { cn } from '$utils/classnames';
	import { useXp } from '$utils/xp';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { getRankForLevel, type Rank } from '$utils/xp-level';

	let { totalXp }: { totalXp: number } = $props();

	const ANIMATION_DELAY = 400;

	const xp = $derived(useXp(totalXp));
	const currentRank: Rank = $derived(getRankForLevel(xp.currentLevel));

	let displayXp = new Spring(0, { stiffness: 0.1, damping: 0.8 });
	let progressWidth = new Spring(0, { stiffness: 0.1, damping: 0.6 });

	onMount(() => {
		const timer = setTimeout(() => {
			displayXp.set(xp.xpIntoCurrentLevel);
			progressWidth.set(xp.progressPercent);
		}, ANIMATION_DELAY);

		return () => clearTimeout(timer);
	});
</script>

<div class="relative pt-12">
	<div
		class="absolute top-0 left-1/2 z-10 -translate-x-1/2 transition-all duration-500 group-hover:top-[-8px] group-hover:scale-110"
	>
		<div class="relative">
			<IconPng name={currentRank.icon} size={100} class="relative z-10 drop-shadow-lg" />
			<div
				class={cn(
					'absolute inset-1 z-0 rounded-full blur-lg transition-all duration-500 group-hover:opacity-60',
					currentRank.theme.accent,
					'opacity-40'
				)}
			></div>
		</div>
	</div>

	<div
		class={cn(
			'group relative overflow-hidden rounded-2xl border p-6 shadow-lg backdrop-blur-sm transition-all duration-500',
			currentRank.theme.bg,
			currentRank.theme.border,
			currentRank.theme.glow,
			currentRank.theme.hoverGlow,
			currentRank.theme.hoverBorder
		)}
	>
		<div class="absolute inset-0 opacity-5">
			<svg class="h-full w-full" viewBox="0 0 100 100">
				<defs>
					<pattern id="grid-xp" width="10" height="10" patternUnits="userSpaceOnUse">
						<path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#grid-xp)" class={currentRank.theme.text} />
			</svg>
		</div>

		<div
			class={cn(
				'absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 blur-xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-20',
				currentRank.theme.accent,
				'animate-pulse'
			)}
			style="animation-duration: 4s;"
		></div>
		<div
			class={cn(
				'absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-gradient-to-tr opacity-5 blur-2xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-15',
				currentRank.theme.accent
			)}
		></div>

		<div class="relative pt-8 text-center">
			<h2
				class={cn('text-lg font-bold tracking-widest uppercase opacity-60', currentRank.theme.text)}
			>
				{currentRank.name}
			</h2>

			<p class={cn('text-6xl font-black transition-all duration-500', currentRank.theme.text)}>
				Level {xp.currentLevel}
			</p>

			<div class="mt-6 space-y-2" in:fly={{ y: 20, duration: 600, delay: 600 }}>
				<div class="relative h-2.5 overflow-hidden rounded-full bg-slate-700/10 dark:bg-white/10">
					<div
						class={cn('h-full rounded-full', currentRank.theme.progress)}
						style="width: {progressWidth.current}%"
					></div>
				</div>

				<div class="flex items-center justify-between text-xs">
					<span class={cn('font-medium', currentRank.theme.text, 'opacity-70')}>
						{Math.floor(displayXp.current).toLocaleString()} / {xp.xpNeededForNextLevel.toLocaleString()}
						XP
					</span>
					<span class={cn('font-bold', currentRank.theme.text)}>
						To Level {xp.nextLevel}
					</span>
				</div>
			</div>
		</div>
	</div>
</div>

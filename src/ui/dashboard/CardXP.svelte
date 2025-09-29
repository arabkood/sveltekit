<script lang="ts">
	import IconPng from '$ui/common/IconPng.svelte';
	import { cn } from '$utils/classnames';
	import { useXp } from '$utils/xp';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { getRankForLevel, type Rank } from '$utils/xp-level';
	import { i18n } from '$i18n/i18n';

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
		class={'group relative h-[230px] overflow-hidden rounded-2xl border-1 border-gray-200 p-6 shadow-lg transition-all duration-500 dark:border-gray-700'}
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
			<h2 class={cn('text-lg font-bold tracking-wide opacity-60', currentRank.theme.text)}>
				{currentRank.name}
			</h2>

			<p class={cn('mt-4 text-5xl font-bold transition-all duration-500', currentRank.theme.text)}>
				{i18n.t('dashboard.level')}
				<span class="font-hacker">
					{xp.currentLevel}
				</span>
			</p>

			<div class="mt-6 space-y-2" in:fly={{ y: 20, duration: 600, delay: 300 }}>
				<div class="relative h-2.5 overflow-hidden rounded-full bg-slate-700/10 dark:bg-white/10">
					<div
						class={cn('h-full rounded-full', currentRank.theme.progress)}
						style="width: {progressWidth.current}%"
					></div>
				</div>

				<div class="flex items-center justify-between text-xs" dir="ltr">
					<span class={cn('font-hacker font-medium', currentRank.theme.text, 'opacity-70')}>
						{Math.floor(displayXp.current).toLocaleString()} / {Math.floor(
							xp.xpNeededForNextLevel
						).toLocaleString()}
						XP
					</span>
					<span class={cn('font-bold', currentRank.theme.text)}>
						{i18n.t('dashboard.toLevel')}
						<span class="font-hacker">
							{xp.nextLevel}
						</span>
					</span>
				</div>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { Spring } from 'svelte/motion';
	import { getRankForLevel, type Rank } from '$utils/xp-level';
	import { useXp } from '$utils/xp';
	import { cn } from '$utils/classnames';
	import IconPng from '$ui/common/IconPng.svelte';
	import type { UserStats } from '$lib/server/db/repos/user';

	let { userStats }: { userStats: UserStats } = $props();

	const xp = $derived(useXp(userStats.totalXp));
	const currentRank: Rank = $derived(getRankForLevel(xp.currentLevel));

	const progress = new Spring(0, {
		stiffness: 0.05,
		damping: 0.8
	});

	$effect(() => {
		progress.set(xp.progressPercent);
	});
</script>

<div
	class={cn(
		'relative flex h-10 min-w-48 items-center gap-1 rounded-xl px-2 ring-1 backdrop-blur-sm transition-all duration-300',
		'bg-slate-200/50 dark:bg-slate-800/50',
		'ring-slate-300/80 dark:ring-slate-700/60',
		currentRank.theme.glow
	)}
>
	<div class={cn('flex h-8 items-center gap-1.5 ps-2 font-bold', currentRank.theme.accent)}>
		<span class="text-xs opacity-80">مستوى</span>
		<span class="text-sm">{xp.currentLevel}</span>
	</div>

	<IconPng name={currentRank.icon} size={40} class="shrink-0 drop-shadow-lg" />

	<div class="flex-1 text-right">
		<div class={cn('text-sm leading-none font-bold', currentRank.theme.text)}>
			{userStats.totalXp.toLocaleString()}
		</div>
		<div class="text-xs leading-none text-slate-500 dark:text-slate-400">XP</div>
	</div>

	<div class="relative h-8 w-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/30">
		<div
			class={cn(
				'absolute bottom-0 w-full rounded-full !bg-gradient-to-t',
				currentRank.theme.progress
			)}
			style="height: {progress.current}%"
		></div>
	</div>
</div>

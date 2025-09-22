<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Tween } from 'svelte/motion';
	import type { SelectUsersStats } from '$lib/server/db/schema/users';
	import { useXp } from '$utils/xp';
	import CardXp from '$ui/dashboard/CardXP.svelte';
	import { quintOut } from 'svelte/easing';

	let {
		userStats,
		variant = 'desktop'
	}: {
		userStats: SelectUsersStats;
		variant?: 'desktop' | 'mobile';
	} = $props();

	let isPopupVisible = $state(false);

	const xp = $derived(useXp(userStats.totalXp));
	const animatedProgress = new Tween(0, {
		duration: 100
	});

	$effect(() => {
		if (animatedProgress.current !== xp.progressPercent) {
			animatedProgress.set(xp.progressPercent);
		}
	});

	const RANKS = [
		{
			minLevel: 100,
			title: 'أسطورة عظمى',
			color:
				'from-violet-600 via-purple-600 to-fuchsia-700 dark:from-violet-500 dark:via-purple-500 dark:to-fuchsia-600',
			icon: '👑'
		},
		{
			minLevel: 50,
			title: 'محارب أسطوري',
			color:
				'from-rose-600 via-red-600 to-pink-700 dark:from-rose-500 dark:via-red-500 dark:to-pink-600',
			icon: '⚔️'
		},
		{
			minLevel: 25,
			title: 'خبير ماهر',
			color:
				'from-cyan-600 via-blue-600 to-indigo-700 dark:from-cyan-500 dark:via-blue-500 dark:to-indigo-600',
			icon: '🎯'
		},
		{
			minLevel: 10,
			title: 'محترف متقدم',
			color:
				'from-green-600 via-emerald-600 to-teal-700 dark:from-green-500 dark:via-emerald-500 dark:to-teal-600',
			icon: '🚀'
		},
		{
			minLevel: 5,
			title: 'نجم صاعد',
			color:
				'from-yellow-600 via-amber-600 to-orange-700 dark:from-yellow-500 dark:via-amber-500 dark:to-orange-600',
			icon: '⭐'
		},
		{
			minLevel: 0,
			title: 'مبتدئ واعد',
			color:
				'from-slate-600 via-gray-600 to-zinc-700 dark:from-slate-500 dark:via-gray-500 dark:to-zinc-600',
			icon: '🌱'
		}
	];

	const rankInfo = $derived(RANKS.find((r) => xp.currentLevel >= r.minLevel)!);

	function closePopup() {
		isPopupVisible = false;
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && closePopup()} />

{#if variant === 'desktop'}
	<div class="relative">
		<button
			class="flex h-10 cursor-pointer items-center gap-3 rounded-xl bg-gradient-to-r from-gray-200/60 to-gray-300/60 ps-2 pe-3 text-black ring-1 ring-gray-300 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:ring-gray-400 dark:from-gray-800/60 dark:to-gray-900/60 dark:text-white dark:ring-gray-700/50 dark:hover:ring-gray-600"
			onmouseenter={() => (isPopupVisible = true)}
			onmouseleave={() => (isPopupVisible = false)}
			aria-label="View level progress details"
		>
			<div class="flex items-center gap-2">
				<div class="flex items-center gap-1 px-2 py-1">
					<span class="text-xs font-bold text-white">مستوى</span>
					<span class="text-sm font-bold text-white">{xp.currentLevel}</span>
				</div>
				<span class="text-lg">{rankInfo.icon}</span>
			</div>

			<div class="flex flex-col items-end">
				<div class="text-sm leading-none font-bold tabular-nums">
					{userStats.totalXp.toLocaleString()}
				</div>
				<div class="text-xs leading-none text-gray-400">XP</div>
			</div>

			<div class="h-6 w-1 overflow-hidden rounded-full bg-gray-700">
				<div
					class="w-full rounded-full bg-gradient-to-t {rankInfo.color} transition-[height] duration-1000"
					style="height: {animatedProgress.current}%"
				></div>
			</div>
		</button>

		{#if isPopupVisible}
			<div
				class="absolute top-full left-0 z-50 mt-3 w-96 rounded-2xl bg-slate-300 shadow-2xl dark:bg-slate-900"
				transition:fly={{ y: -10, duration: 300, easing: quintOut }}
				dir="rtl"
				role="tooltip"
			>
				<CardXp totalXp={userStats.totalXp} />
			</div>
		{/if}
	</div>
{/if}

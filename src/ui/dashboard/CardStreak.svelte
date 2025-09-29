<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import type { UserDailyStats, UserStats } from '$lib/server/db/repos/user';
	import Icon from '$ui/common/Icon.svelte';
	import IconPng from '$ui/common/IconPng.svelte';
	import { cn } from '$utils/classnames';
	import { fly } from 'svelte/transition';

	// --- TYPE DEFINITIONS ---

	interface DayData {
		date: Date;
		dayName: string;
		isActive: boolean;
		isToday: boolean;
		isFuture: boolean;
		xp: number;
		items: number;
		intensity: number;
	}

	let {
		dailyStats,
		userStats
	}: {
		dailyStats: UserDailyStats[];
		userStats: UserStats;
	} = $props();

	const { currentStreak, longestStreak, lastActiveAt } = userStats;

	// --- CONSTANTS ---

	const DAY_NAMES = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
	const XP_PER_INTENSITY_LEVEL = 150;
	const MAX_INTENSITY = 3;

	// --- DATE UTILITIES ---

	const isSameDay = (date1: Date, date2: Date) => date1.toDateString() === date2.toDateString();
	const isToday = (date: Date) => isSameDay(date, new Date());
	const isYesterday = (date: Date) => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		return isSameDay(date, yesterday);
	};

	// --- DERIVED STATE ---

	/**
	 * A derived map for quick lookups of daily activity.
	 * Transforms the dailyStats array into a more performant structure.
	 */
	const recentActivity = $derived.by(() => {
		const activityMap = new Map<string, { xp: number; items: number; active: boolean }>();
		if (dailyStats) {
			for (const stat of dailyStats) {
				const date = new Date(stat.date);
				activityMap.set(date.toDateString(), {
					xp: stat.xpEarned,
					items: stat.itemsCompleted,
					active: stat.xpEarned > 0 || stat.itemsCompleted > 0
				});
			}
		}
		return activityMap;
	});

	/** Determines if the user's streak is currently active. */
	const isStreakAlive = $derived.by(() => {
		if (!lastActiveAt) return false;
		const lastActive = new Date(lastActiveAt);
		return isToday(lastActive) || isYesterday(lastActive);
	});

	/** Generates an array of day objects for the current week (Sunday to Saturday). */
	const currentWeek = $derived.by(() => {
		const today = new Date();
		const dayOfWeek = today.getDay(); // 0 = Sunday

		const startOfWeek = new Date(today);
		startOfWeek.setDate(today.getDate() - dayOfWeek);
		startOfWeek.setHours(0, 0, 0, 0); // Normalize to the start of the day

		return Array.from({ length: 7 }, (_, i): DayData => {
			const date = new Date(startOfWeek);
			date.setDate(startOfWeek.getDate() + i);

			const activity = recentActivity.get(date.toDateString());
			const xp = activity?.xp ?? 0;

			return {
				date,
				dayName: DAY_NAMES[date.getDay()],
				isActive: activity?.active ?? false,
				isToday: isToday(date),
				isFuture: date > today,
				xp,
				items: activity?.items ?? 0,
				intensity: xp > 0 ? Math.min(Math.ceil(xp / XP_PER_INTENSITY_LEVEL), MAX_INTENSITY) : 0
			};
		});
	});

	/** Determines the display status of the streak (e.g., broken, record, active). */
	const streakStatus = $derived.by(() => {
		if (!isStreakAlive && currentStreak > 0) return 'broken';
		if (currentStreak === 0) return 'start';
		if (currentStreak > 0 && currentStreak >= longestStreak) return 'record';
		return 'active';
	});

	// --- LOCAL STATE ---

	let hoveredDay: DayData | null = $state(null);
</script>

<div
	class="mt-auto flex h-[230px] flex-col justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
>
	<!-- Main Content: Streak Counter & Personal Best -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<!-- Fire Icon -->
			<div class={'relative p-1'}>
				<IconPng
					class={cn('relative z-10', { 'grayscale filter': streakStatus === 'broken' })}
					name="fire"
					size={60}
				/>
				{#if streakStatus !== 'broken'}
					<div
						class="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-red-400/30 blur-lg"
					></div>
					<div
						class="absolute top-1/2 left-1/2 h-15 w-15 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-yellow-300/10 blur-lg delay-100"
					></div>
				{/if}
			</div>

			<!-- Number & Status Text -->
			<div>
				<div class="text-4xl font-bold text-gray-900 tabular-nums dark:text-white">
					<span class="font-hacker">
						{currentStreak}
					</span>
					<span class="text-lg text-gray-600 dark:text-gray-400"
						>{i18n.t('common.consecutive_days')}</span
					>
				</div>
				<div class="pt-1 text-sm text-gray-500 dark:text-gray-400">
					{#if streakStatus === 'broken'}
						{i18n.t('common.streak.broken')}
					{:else if streakStatus === 'start'}
						{i18n.t('common.streak.start')}
					{:else if streakStatus === 'record'}
						{i18n.t('common.streak.highscore')}
					{:else}
						{i18n.t('common.streak.continue')}
					{/if}
				</div>
			</div>
		</div>

		{#if longestStreak > 0}
			<div class="text-left">
				<div class="mb-1 text-xs text-gray-400 dark:text-gray-500">
					{i18n.t('common.your_longest_streak')}
				</div>
				<div class="font-hacker text-2xl font-semibold text-gray-700 dark:text-gray-300">
					{longestStreak}
				</div>
			</div>
		{/if}
	</div>

	<!-- Current Week Indicator -->
	<div
		class="mt-8 border-t border-gray-100 pt-4 dark:border-gray-800"
		in:fly={{ y: 20, duration: 600, delay: 300 }}
	>
		<div class="grid grid-cols-7 gap-2">
			{#each currentWeek as day (day.date.toDateString())}
				<div
					class="group relative"
					onmouseenter={() => (hoveredDay = day)}
					onmouseleave={() => (hoveredDay = null)}
					role="tooltip"
				>
					<div
						class={cn(
							'flex aspect-square cursor-pointer items-center justify-center rounded-xl border-1 text-xs font-medium transition-all hover:scale-110',
							{
								// Inactive state
								'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500':
									!day.isActive,
								// Active states by intensity
								'border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300':
									day.isActive && day.intensity === 1,
								'border-emerald-400 bg-emerald-200 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-200':
									day.isActive && day.intensity === 2,
								'border-emerald-500 bg-emerald-300 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-900/70 dark:text-emerald-100':
									day.isActive && day.intensity >= 3,
								'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400':
									day.isActive && day.intensity === 0,
								'ring-2 ring-blue-400 ring-offset-2 dark:ring-blue-500 dark:ring-offset-gray-900':
									day.isToday
							}
						)}
					>
						{#if day.isToday || day.isFuture}
							{day.dayName}
						{:else if day.isActive}
							<Icon name="check" />
						{:else}
							<Icon name="x" />
						{/if}
					</div>

					<!-- Tooltip -->
					{#if hoveredDay?.date.toDateString() === day.date.toDateString()}
						<div
							class="absolute bottom-full left-1/2 z-20 mb-2 w-max -translate-x-1/2 transform rounded-lg bg-gray-300 px-3 py-2 text-xs text-black shadow-lg dark:bg-gray-700 dark:text-white"
						>
							<div class="mb-1 font-medium">
								{day.dayName}
								{#if day.isToday}(اليوم){/if}
							</div>
							{#if day.isActive}
								<div class="text-emerald-300 dark:text-emerald-600">
									✓ {day.xp} نقطة خبرة
								</div>
								<!-- <div class="text-gray-300 dark:text-gray-600">{day.items} درس مكتمل</div> -->
							{:else if !day.isFuture}
								<div class="text-gray-400 dark:text-gray-500">لا يوجد نشاط</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

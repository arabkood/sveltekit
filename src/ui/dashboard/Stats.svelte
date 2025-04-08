<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import Icon from '$ui/common/Icon.svelte';
	import { cn } from '$utils/classnames';
	import { useXp } from '$utils/xp';

	let {
		totalXp,
		currentStreak,
		todayStreakCompleted,
		globalRank
	}: {
		totalXp: number;
		currentStreak: number;
		todayStreakCompleted: boolean;
		globalRank: number;
	} = $props();

	const xp = $derived(useXp(totalXp));

	const streakDays = $derived.by(() => {
		let streak = currentStreak;
		// if today streak is completed, that means the streak stats includes today
		if (todayStreakCompleted) {
			streak--;
		}

		let baseDay = streak > 0 ? Math.floor(streak / 5) * 5 + 1 : 1;
		let today = streak > 0 ? streak % 5 : 0;

		return Array.from({ length: 5 }, (_, i) => ({
			day: baseDay + i,
			status: today === i ? 'current' : today > i ? 'completed' : 'upcoming'
		}));
	});

	const stats = $derived([
		{
			type: 'xp',
			icon: 'zap',
			label: i18n.t('dashboard.xp'),
			value: totalXp.toLocaleString() + ' XP',
			theme: {
				bg: 'bg-primary-50',
				text: 'text-primary-600',
				icon: 'text-primary-500',
				progress: 'bg-primary-500'
			}
		}
		// TODO: enable streak, enable rank
		// {
		// 	type: 'streak',
		// 	icon: 'flame',
		// 	label: i18n.t('dashboard.streak'),
		// 	value: i18n.t('common.days', { days: String(currentStreak) }),
		// 	theme: {
		// 		bg: 'bg-orange-50',
		// 		text: 'text-orange-600',
		// 		icon: 'text-orange-500'
		// 	}
		// },
		// {
		// 	type: 'rank',
		// 	icon: 'medal',
		// 	label: i18n.t('dashboard.rank'),
		// 	value: `#${globalRank.toLocaleString()}`,
		// 	theme: {
		// 		bg: 'bg-sky-50',
		// 		text: 'text-sky-600',
		// 		icon: 'text-sky-500'
		// 	}
		// }
	]);
</script>

<div class="mb-8 grid gap-4 lg:grid-cols-3">
	{#each stats as stat}
		<div class="bg-section relative rounded-xl p-4 shadow-sm">
			<!-- Header -->
			<div class="relative flex items-start gap-4">
				<div class={cn('rounded-lg p-2', stat.theme.bg, stat.theme.text)}>
					<Icon name={stat.icon} class={cn('h-5 w-5', stat.theme.icon)} />
				</div>
				<div class="flex-1">
					<p class="text-sm font-medium opacity-60">{stat.label}</p>
					<p class="mt-1 text-2xl font-bold">{stat.value}</p>

					<!-- XP Progress -->
					{#if stat.type === 'xp'}
						<div class="mt-2">
							<div class="mb-1 flex items-center justify-between text-xs opacity-60">
								<span>{xp.prevXp.toLocaleString()}</span>
								<span>{xp.nextXp.toLocaleString()}</span>
							</div>
							<div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
								<div
									class={cn('h-full rounded-full transition-all duration-500', stat.theme.progress)}
									style="width: {xp.progressUntilNext}%"
								></div>
							</div>
							<p class="mt-1 text-xs opacity-60">
								{i18n.t('common.xp.xpLeftToLevel', {
									level: xp.nextLevel.toLocaleString(),
									xp: xp.nextXpMod.toLocaleString()
								})}
							</p>
						</div>
					{/if}

					<!-- Streak Display -->
					{#if stat.type === 'streak'}
						<div class="mt-3">
							<div class="flex items-center justify-between">
								{#each streakDays as { day, status }}
									<div class="flex flex-col items-center gap-1.5">
										<div
											class={cn('relative flex h-8 w-8 items-center justify-center rounded-full', {
												'bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-200 dark:shadow-orange-900':
													status === 'completed' ||
													(status === 'current' && !!todayStreakCompleted),
												'bg-gray-200 dark:bg-gray-700':
													status === 'upcoming' || (status === 'current' && !todayStreakCompleted)
											})}
										>
											{#if status === 'completed' || (status === 'current' && todayStreakCompleted)}
												<Icon name="check" class="h-4 w-4 text-white" />
											{:else}
												<span
													class={cn('text-sm font-bold', {
														'text-gray-700 dark:text-gray-200':
															status === 'upcoming' ||
															(status === 'current' && !todayStreakCompleted)
													})}
												>
													{day}
												</span>
											{/if}
										</div>
										{#if status === 'current'}
											<span class="text-[10px] font-medium opacity-60"
												>{i18n.t('common.today')}</span
											>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>

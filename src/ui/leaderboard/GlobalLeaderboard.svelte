<script lang="ts">
	import { cn } from '$utils/classnames';
	import { fly, fade } from 'svelte/transition';
	import { i18n } from '$i18n/i18n';
	import { getRankForLevel } from '$utils/xp-level';
	import { useXp } from '$utils/xp';
	import Avatar from '$ui/common/Avatar.svelte';
	import IconPng from '$ui/common/IconPng.svelte';

	interface LeaderboardEntry {
		rank: number;
		userId: string;
		username: string;
		displayName: string;
		avatarUrl?: string;
		totalXp: number;
	}

	interface LeaderboardProps {
		entries: LeaderboardEntry[];
		currentUserId?: string;
		loading?: boolean;
	}

	let { entries = [], currentUserId, loading = false }: LeaderboardProps = $props();

	// Check if entry is current user
	const isCurrentUser = $derived((entry: LeaderboardEntry) => entry.userId === currentUserId);

	// Format XP with locale (use Western numerals)
	const formatXp = (xp: number) => xp.toLocaleString('en-US');

	// Get rank icon for user based on their level
	const getRankIcon = (totalXp: number) => {
		const xp = useXp(totalXp);
		return getRankForLevel(xp.currentLevel);
	};
</script>

<div class="w-full">
	<!-- Loading State -->
	{#if loading}
		<div class="space-y-2">
			{#each Array(10) as _, i}
				<div
					class="h-[72px] animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
					in:fade={{ duration: 200, delay: i * 20 }}
				></div>
			{/each}
		</div>
	{:else if entries.length === 0}
		<!-- Empty State -->
		<div
			class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 py-20 dark:border-gray-800 dark:bg-gray-900"
			in:fade={{ duration: 400 }}
		>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				{i18n.t('leaderboard.empty.description')}
			</p>
		</div>
	{:else}
		<!-- Leaderboard List -->
		<div class="space-y-2" dir="ltr">
			{#each entries as entry, index (entry.userId)}
				{@const isUser = isCurrentUser(entry)}
				{@const rank = getRankIcon(entry.totalXp)}
				{@const userHref = `/user/${entry.username}`}

				<div
					class={cn(
						'group relative flex items-center gap-4 rounded-xl border px-5 py-4 transition-all duration-200',
						isUser
							? 'border-primary-200 bg-primary-50/50 dark:border-primary-800/50 dark:bg-primary-950/20 shadow-sm'
							: 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
					)}
					in:fly={{ y: 5, duration: 350, delay: index * 25 }}
				>
					<!-- Rank Number -->
					<div class="flex w-10 shrink-0 items-center justify-center">
						<span
							class={cn(
								'font-hacker text-lg font-bold tracking-tight tabular-nums',
								entry.rank <= 3
									? 'bg-gradient-to-br from-yellow-500 to-amber-600 bg-clip-text text-transparent'
									: 'text-gray-400 dark:text-gray-500'
							)}
						>
							{entry.rank}
						</span>
					</div>

					<!-- Avatar -->
					<a class="flex shrink-0 justify-center hover:opacity-90" href={userHref}>
						<Avatar src={entry.avatarUrl} fallback={entry.displayName} size="md" />
					</a>

					<!-- Name/Username/Rank Badge Box -->
					<a href={userHref} class="me-auto flex min-w-0 items-center gap-3">
						<div class="flex min-w-0 flex-1 flex-col gap-0.5">
							<!-- Name with inline rank icon -->
							<div class="flex items-start gap-2">
								<span
									class={cn(
										'truncate text-[15px] leading-tight font-semibold hover:underline',
										isUser
											? 'text-primary-700 dark:text-primary-400'
											: 'text-gray-900 dark:text-gray-100'
									)}
								>
									{entry.displayName}
								</span>
								<div class="-mt-2 shrink-0" title={rank.name}>
									<IconPng name={rank.icon} size={40} class="drop-shadow-sm" />
								</div>
							</div>
							<!-- Username below -->
							<span class="-mt-3 truncate text-sm text-gray-500 hover:underline dark:text-gray-400">
								@{entry.username}
							</span>
						</div>
					</a>

					<!-- XP Amount -->
					<div class="flex shrink-0 flex-col items-end gap-0.5">
						<span
							class={cn(
								'font-hacker text-lg font-bold tracking-tight tabular-nums',
								isUser
									? 'text-primary-700 dark:text-primary-400'
									: 'text-gray-900 dark:text-gray-100'
							)}
						>
							{formatXp(entry.totalXp)}
						</span>
						<span class="text-[10px] font-medium tracking-wide text-gray-400 uppercase">XP</span>
					</div>

					<!-- Subtle indicator for current user -->
					{#if isUser}
						<div
							class="from-primary-500/[0.02] pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r to-emerald-500/[0.02]"
						></div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<script lang="ts">
	import type { User, UserStats } from '$lib/server/db/repos/user';
	import { getRankForLevel } from '$utils/xp-level';
	import { useXp } from '$utils/xp';
	import { i18n } from '$i18n/i18n';
	import Avatar from '$ui/common/Avatar.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import IconPng from '$ui/common/IconPng.svelte';
	import Button from '$ui/common/Button.svelte';

	const {
		user,
		userStats
	}: {
		user: Partial<User> & { avatar?: string; isPro?: boolean };
		userStats: UserStats;
	} = $props();

	// Calculate user's rank and level from XP
	const xp = $derived(useXp(userStats.totalXp));
	const currentRank = $derived(getRankForLevel(xp.currentLevel));

	// Calculate relative join time in Arabic
	const joinTime = $derived.by(() => {
		if (!user.createdAt) return '';

		const now = new Date();
		const created = new Date(user.createdAt);
		const diffMs = now.getTime() - created.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		const diffMonths = Math.floor(diffDays / 30);
		const diffYears = Math.floor(diffDays / 365);

		if (diffYears > 0) {
			return diffYears === 1 ? 'عضو منذ سنة' : `عضو منذ ${diffYears} سنوات`;
		} else if (diffMonths > 0) {
			return diffMonths === 1 ? 'عضو منذ شهر' : `عضو منذ ${diffMonths} أشهر`;
		} else if (diffDays > 0) {
			return diffDays === 1 ? 'عضو منذ يوم' : `عضو منذ ${diffDays} يوم`;
		} else {
			return 'عضو جديد';
		}
	});

	// Share profile function
	let showShareMenu = $state(false);

	const copyProfileUrl = () => {
		const url = window.location.href;
		navigator.clipboard.writeText(url);
		// TODO: Show toast notification
		showShareMenu = false;
	};

	const shareToSocial = (platform: 'twitter' | 'linkedin' | 'facebook') => {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(
			`شاهد ملف ${user.username}@ على أكود! 🎯\nالمستوى: ${xp.currentLevel}\nنقاط الخبرة: ${userStats.totalXp.toLocaleString('en-US')}`
		);

		const shareUrls = {
			twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`
		};

		window.open(shareUrls[platform], '_blank', 'width=600,height=400');
		showShareMenu = false;
	};
</script>

<div class="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
	<div
		class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
	>
		<!-- Header Section -->
		<div
			class="border-b border-gray-200 bg-gray-50 px-4 py-6 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800/50"
		>
			<div class="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
				<!-- Avatar -->
				<div class="shrink-0">
					<Avatar src={user.avatar} alt={user.username} fallback={user.username} size="5xl" />
				</div>

				<!-- User Info -->
				<div class="flex flex-1 flex-col items-center gap-3 sm:items-start">
					<!-- Username -->
					<div class="flex flex-col items-center gap-2 sm:items-start">
						<div class="flex items-center gap-2">
							<h1
								class="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100"
								dir="auto"
							>
								{user.username}
							</h1>
							{#if user.isPro}
								<IconPng name="premium" size={24} class="shrink-0" />
							{/if}
						</div>
						<span dir="ltr" class="-mt-2 text-base text-gray-500 dark:text-gray-400">
							@{user.username}
						</span>

						<!-- Level only -->
						<div class="flex items-center gap-5 text-sm text-gray-600 dark:text-gray-400">
							<span class="font-hacker">
								{i18n.t('leaderboard.labels.level')}
								{xp.currentLevel}
							</span>
							<!-- Join Date -->
							<div
								class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
								dir="rtl"
							>
								<Icon name="clock" size={14} />
								<span>{joinTime}</span>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="flex flex-wrap items-center gap-3">
						<!-- Share Button -->
						<div class="relative">
							<Button
								onclick={() => (showShareMenu = !showShareMenu)}
								variant="gray"
								startIcon="share"
							>
								{i18n.t('common.share')}
							</Button>

							<!-- Share Menu Dropdown -->
							{#if showShareMenu}
								<div
									class="absolute start-0 top-full z-20 mt-2 min-w-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
								>
									<button
										onclick={copyProfileUrl}
										class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
									>
										<Icon name="copy" size={16} />
										<span>{i18n.t('common.copyLink')}</span>
									</button>
									<button
										onclick={() => shareToSocial('twitter')}
										class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
									>
										<Icon name="twitter" size={16} />
										<span>{i18n.t('common.twitter')}</span>
									</button>
									<button
										onclick={() => shareToSocial('linkedin')}
										class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
									>
										<Icon name="linkedin" size={16} />
										<span>{i18n.t('common.linkedin')}</span>
									</button>
									<button
										onclick={() => shareToSocial('facebook')}
										class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
									>
										<Icon name="facebook" size={16} />
										<span>{i18n.t('common.facebook')}</span>
									</button>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Stats Grid -->
		<div class="p-4 sm:p-6 lg:p-8">
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
				<!-- Rank Stat -->
				<div
					class="rounded-lg border border-gray-200 bg-gray-50 p-3 pb-3 sm:p-4 dark:border-gray-700 dark:bg-gray-800"
				>
					<div class="flex items-center gap-2 sm:gap-3">
						<div class="shrink-0">
							<IconPng name={currentRank.icon} size={48} class="sm:h-[60px] sm:w-[60px]" />
						</div>
						<div class="min-w-0 flex-1">
							<div class="text-xs font-medium text-gray-500 sm:text-sm dark:text-gray-400">
								{i18n.t('dashboard.rank.rank')}
							</div>
							<div class={`truncate text-base font-bold sm:text-lg ${currentRank.theme.text}`}>
								{currentRank.name}
							</div>
						</div>
					</div>
				</div>
				<!-- XP Stat -->
				<div
					class="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-gray-700 dark:bg-gray-800"
				>
					<div class="flex items-center gap-2 sm:gap-3">
						<div class="shrink-0">
							<IconPng name="bolt" size={48} class="sm:h-[56px] sm:w-[56px]" />
						</div>
						<div class="flex min-w-0 flex-1 items-center justify-between gap-2">
							<div class="text-xs font-medium text-gray-500 sm:text-sm dark:text-gray-400">
								{i18n.t('leaderboard.labels.xp')}
							</div>
							<div
								class="font-hacker text-lg font-bold text-gray-900 sm:text-xl dark:text-gray-100"
								dir="ltr"
							>
								{userStats.totalXp.toLocaleString('en-US')}
							</div>
						</div>
					</div>
				</div>
				<!-- Streak Stat -->
				<div
					class="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-gray-700 dark:bg-gray-800"
				>
					<div class="flex items-center gap-2 sm:gap-3">
						<div class="shrink-0">
							<IconPng name="fire" size={48} class="sm:h-[56px] sm:w-[56px]" />
						</div>
						<div class="flex min-w-0 flex-1 items-center justify-between gap-2">
							<div class="text-xs font-medium text-gray-500 sm:text-sm dark:text-gray-400">
								{i18n.t('common.streak.label')}
							</div>
							<div
								class="font-hacker text-lg font-bold text-gray-900 sm:text-xl dark:text-gray-100"
								dir="ltr"
							>
								{userStats.currentStreak}
							</div>
						</div>
					</div>
				</div>
				<!-- Completed Items Stat -->
				<div
					class="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-gray-700 dark:bg-gray-800"
				>
					<div class="flex items-center gap-2 sm:gap-3">
						<div class="shrink-0">
							<IconPng name="terminal" size={48} class="sm:h-[56px] sm:w-[56px]" />
						</div>
						<div class="flex min-w-0 flex-1 items-center justify-between gap-2">
							<div class="text-xs font-medium text-gray-500 sm:text-sm dark:text-gray-400">
								{i18n.t('common.completedItems')}
							</div>
							<div
								class="font-hacker text-lg font-bold text-gray-900 sm:text-xl dark:text-gray-100"
								dir="ltr"
							>
								{userStats.completedItems}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Click outside to close share menu -->
{#if showShareMenu}
	<button class="fixed inset-0 z-0" onclick={() => (showShareMenu = false)} aria-label="Close menu"
	></button>
{/if}

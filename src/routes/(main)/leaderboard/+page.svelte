<script lang="ts">
	import GlobalLeaderboard from '$ui/leaderboard/GlobalLeaderboard.svelte';
	import { i18n } from '$i18n/i18n';
	import { cn } from '$utils/classnames';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// State
	let isLoading = $state(false);

	// Change timeframe by navigating with query param
	const changeTimeframe = async (timeframe: 'all-time' | 'weekly') => {
		if (data.timeframe === timeframe) return;
		isLoading = true;

		try {
			await goto(`/leaderboard?timeframe=${timeframe}`, {
				keepFocus: true,
				noScroll: true
			});
		} finally {
			isLoading = false;
		}
	};
</script>

<svelte:head>
	<title>{i18n.t('leaderboard.title')} | {i18n.t('site.name')}</title>
	<meta name="description" content={i18n.t('leaderboard.description')} />
</svelte:head>

<div class="bg-page min-h-screen">
	<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1
				class="mb-3 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-400"
			>
				{i18n.t('leaderboard.title')}
			</h1>
			<p class="text-base text-gray-600 dark:text-gray-400">
				{i18n.t('leaderboard.description')}
			</p>
		</div>

		<!-- Tabs -->
		<div class="mb-8 flex justify-center">
			<div
				class="inline-flex gap-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<button
					onclick={() => changeTimeframe('all-time')}
					class={cn(
						'rounded-lg px-8 py-2.5 text-sm font-semibold transition-all duration-200',
						data.timeframe === 'all-time'
							? 'bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900'
							: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-100'
					)}
				>
					{i18n.t('leaderboard.timeframe.allTime')}
				</button>
				<button
					onclick={() => changeTimeframe('weekly')}
					class={cn(
						'rounded-lg px-8 py-2.5 text-sm font-semibold transition-all duration-200',
						data.timeframe === 'weekly'
							? 'bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900'
							: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-100'
					)}
				>
					{i18n.t('leaderboard.timeframe.weekly')}
				</button>
			</div>
		</div>

		<!-- Leaderboard Component -->
		<GlobalLeaderboard
			entries={data.entries}
			currentUserId={data.currentUserId}
			loading={isLoading}
		/>
	</div>
</div>

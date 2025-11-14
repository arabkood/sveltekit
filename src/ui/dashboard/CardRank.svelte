<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import Icon from '$ui/common/Icon.svelte';
	import IconPng from '$ui/common/IconPng.svelte';

	let {
		userRank
	}: {
		userRank: { rank: number; xp: number; totalUsers?: number } | null;
	} = $props();

	// Calculate percentile (top X%)
	const percentile = $derived(
		userRank && userRank.totalUsers ? Math.round((userRank.rank / userRank.totalUsers) * 100) : null
	);
</script>

{#if userRank}
	<!-- Rank Card - Unique minimal design -->
	<a
		href="/leaderboard"
		class="group relative mt-auto flex h-[230px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-sm transition-all dark:border-gray-700 dark:from-gray-900 dark:to-gray-900/50"
	>
		<!-- Subtle accent -->
		<div
			class="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2
         rounded-full bg-emerald-500/30 blur-2xl transition-all group-hover:opacity-90"
		></div>

		<!-- Header with trophy -->
		<div class="relative mb-auto flex items-center justify-between">
			<div class="flex items-center gap-2">
				<IconPng name="bolt" size={38} />
				<span class="text-sm font-medium text-gray-600 dark:text-gray-400">
					{i18n.t('dashboard.rank.title')}
				</span>
			</div>
		</div>

		<!-- Main rank display -->
		<div class="relative my-auto text-center">
			<div class="mb-3">
				<span class="font-hacker text-5xl font-bold text-gray-900 dark:text-white">
					#{userRank.rank}
				</span>
			</div>

			<!-- Percentile badge -->
			{#if percentile !== null}
				<div
					class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 dark:bg-emerald-500/20"
				>
					<span class="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
						{i18n.t('dashboard.rank.top')}
						{percentile}%
					</span>
				</div>
			{/if}
		</div>

		<!-- Bottom CTA -->
		<div
			class="relative mt-auto flex items-center justify-center gap-2 text-sm font-medium text-gray-600 transition-colors group-hover:text-emerald-600 dark:text-gray-400 dark:group-hover:text-emerald-400"
		>
			<span>{i18n.t('dashboard.rank.viewLeaderboard')}</span>
			<Icon name="arrow-left" size={20} />
		</div>
	</a>
{:else}
	<!-- No rank state -->
	<div
		class="mt-auto flex h-[230px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-6 text-center dark:border-gray-700 dark:bg-gray-900/50"
	>
		<p class="mb-1 text-base font-medium text-gray-600 dark:text-gray-400">
			{i18n.t('dashboard.rank.noRank')}
		</p>
		<p class="text-sm text-gray-500">
			{i18n.t('dashboard.rank.earnXpToRank')}
		</p>
	</div>
{/if}

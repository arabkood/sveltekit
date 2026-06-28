<script lang="ts">
	import BannerPremium from '$ui/dashboard/BannerPremium.svelte';
	import UserTracks from '$ui/dashboard/UserTracks.svelte';
	import Welcome from '$ui/dashboard/Welcome.svelte';
	import type { PageData } from './$types';
	import Footer from '$ui/shared/Footer.svelte';
	import CardXp from '$ui/dashboard/CardXP.svelte';
	import CardStreak from '$ui/dashboard/CardStreak.svelte';
	import CardRank from '$ui/dashboard/CardRank.svelte';

	const {
		data
	}: {
		data: PageData;
	} = $props();
</script>

<div class="bg-page min-h-screen">
	<div class="mx-auto max-w-7xl p-6 lg:p-8">
		<Welcome
			userTracks={data.userTracks}
			name={data.user!.username}
			is_user_premium={data.user?.isPro ?? false}
		/>

		<div class="mb-8 grid gap-6 lg:grid-cols-3">
			<CardXp totalXp={data.userStats!.totalXp} />
			<CardStreak dailyStats={data.dailyStats ?? []} userStats={data.userStats!} />
			<CardRank userRank={data.userRank} />
		</div>

		<div class="mb-12">
			<UserTracks
				userTracks={data.userTracks}
				courses={data.courses!}
				is_user_premium={data.user?.isPro || false}
			/>
		</div>
		{#if !data.user?.isPro}
			<BannerPremium />
		{/if}
	</div>
</div>
<Footer />

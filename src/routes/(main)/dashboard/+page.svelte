<script lang="ts">
	// import Achievements from '$ui/dashboard/Achievements.svelte';
	import ActiveTrack from '$ui/dashboard/ActiveTrack.svelte';
	import BannerPremium from '$ui/dashboard/BannerPremium.svelte';
	// import DailyChallenge from '$ui/dashboard/DailyChallenge.svelte';
	import UserTracks from '$ui/dashboard/UserTracks.svelte';
	import Welcome from '$ui/dashboard/Welcome.svelte';
	import type { PageData } from '../settings/$types';
	import Footer from '$ui/shared/Footer.svelte';
	import CardXp from '$ui/dashboard/CardXP.svelte';

	const {
		data
	}: {
		data: PageData;
	} = $props();
	// console.debug(data.user);
</script>

<div class="bg-page min-h-screen">
	<div class="mx-auto max-w-7xl p-6 lg:p-8">
		<Welcome
			handleContinueLearning={() => {}}
			userTracks={data.userTracks!}
			name={data.user!.username}
			is_user_premium={data.user?.premiumActive ?? false}
			completedLessons={data.userStats?.completedItems}
		/>
		<div class="mb-8 grid gap-6 lg:grid-cols-3">
			<CardXp totalXp={data.userStats!.totalXp} />
		</div>

		<!-- Main Content Grid -->
		<!-- <div class="grid gap-8 lg:grid-cols-12"> -->
		<!-- 	<div class="space-y-8 lg:col-span-8"> -->
		<div class="mb-12">
			<div>
				{#if data.userTracks!.length > 0}
					<UserTracks userTracks={data.userTracks!} courses={data.courses!} />
				{:else}
					<ActiveTrack userTracks={[]} />
				{/if}
			</div>
			<div class="space-y-8 lg:col-span-4">
				<!-- TODO: enable -->
				<!-- <Achievements -->
				<!-- 	completedItems={data.userStats!.completedItems} -->
				<!-- 	longestStreak={data.userStats!.longestStreak} -->
				<!-- /> -->
				<!-- <DailyChallenge /> -->
				<!-- <JoinCommunity /> -->
			</div>
		</div>
		{#if !data.user?.premiumActive}
			<BannerPremium />
		{/if}
	</div>
</div>
<Footer />

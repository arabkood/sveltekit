<script lang="ts">
	// import Achievements from '$ui/dashboard/Achievements.svelte';
	import ActiveTrack from '$ui/dashboard/ActiveTrack.svelte';
	// import DailyChallenge from '$ui/dashboard/DailyChallenge.svelte';
	import Stats from '$ui/dashboard/Stats.svelte';
	import UserTracks from '$ui/dashboard/UserTracks.svelte';
	import Welcome from '$ui/dashboard/Welcome.svelte';
	import type { PageData } from '../settings/$types';

	const {
		data
	}: {
		data: PageData;
	} = $props();
	console.debug(data);
</script>

<div class="bg-page min-h-screen">
	<div class="mx-auto max-w-7xl p-6 lg:p-8">
		<!-- <BannerPremium /> -->
		<Welcome userTracks={data.userTracks!} name={data.user!.username} is_user_premium={true} />
		<Stats
			totalXp={data.userStats!.totalXp}
			currentStreak={0}
			globalRank={0}
			todayStreakCompleted={false}
		/>

		<!-- Main Content Grid -->
		<!-- <div class="grid gap-8 lg:grid-cols-12"> -->
		<!-- 	<div class="space-y-8 lg:col-span-8"> -->
		<div>
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
	</div>
</div>

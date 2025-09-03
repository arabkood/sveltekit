<script lang="ts">
	import ProfileHeader from './ProfileHeader.svelte';
	import ContributionGraph from './ContributionGraph.svelte';
	import SkillsList from './SkillsList.svelte';
	import ActivityFeed from './ActivityFeed.svelte';
	import AchievementsGrid from './AchievementsGrid.svelte';
	import CommunityStats from './CommunityStats.svelte';
	import LearningTracks from './LearningTracks.svelte';

	let { data } = $props();

	const userProfile = $derived(data.userProfile);
</script>

<main class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
	<ProfileHeader profile={userProfile.profile} stats={userProfile.stats} />

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Main Content -->
		<div class="space-y-8 lg:col-span-2">
			<ContributionGraph contributions={userProfile.contributions} />
			<SkillsList skills={userProfile.skills} />
			<ActivityFeed activities={userProfile.activities} />
		</div>

		<!-- Sidebar -->
		<aside class="space-y-8">
			<AchievementsGrid achievements={userProfile.achievements} />
			<CommunityStats community={userProfile.community} />
			<LearningTracks tracks={userProfile.learningTracks} />
		</aside>
	</div>
</main>

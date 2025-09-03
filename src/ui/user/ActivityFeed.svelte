<script lang="ts">
	import type { Activity } from '$types/user';

	const { activities } = $props<{ activities: Activity[] }>();

	const bgColors = {
		solved: 'bg-green-100 dark:bg-green-900/50',
		streak: 'bg-orange-100 dark:bg-orange-900/50',
		achievement: 'bg-purple-100 dark:bg-purple-900/50'
	};
</script>

<section class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
	<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
	<div class="space-y-3">
		{#each activities as activity}
			<div
				class="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
			>
				<div class="{bgColors[activity.type]} rounded-full p-2">
					<span class="text-lg">{activity.icon}</span>
				</div>
				<div class="flex-1">
					<p class="font-medium text-gray-900 dark:text-white">
						{activity.title}
					</p>
					{#if activity.subtitle}
						<p class="text-sm text-gray-500 dark:text-gray-400">{activity.subtitle}</p>
					{/if}
				</div>
				<span class="text-sm text-gray-400 dark:text-gray-500">{activity.timeAgo}</span>
			</div>
		{/each}
	</div>
</section>

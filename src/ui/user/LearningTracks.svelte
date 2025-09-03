<script lang="ts">
	import type { LearningTrack } from '$types/user';

	const { tracks } = $props<{ tracks: LearningTrack[] }>();
</script>

<section class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
	<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Learning Tracks</h2>
	<div class="space-y-2">
		{#each tracks as track}
			<div
				class="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
			>
				<div
					class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold"
					style="background-color: {track.color}20; color: {track.color};"
				>
					{track.name[0]}
				</div>
				<div class="flex-1">
					<p class="font-semibold text-gray-900 dark:text-white">{track.name}</p>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						{track.progress}/{track.total} Modules
					</p>
				</div>
			</div>
		{/each}
	</div>
</section>

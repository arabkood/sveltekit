<script lang="ts">
	import type { Achievement } from '$types/user';

	const { achievements } = $props<{ achievements: Achievement[] }>();
</script>

<section class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
	<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Achievements</h2>
	<div class="grid grid-cols-3 gap-4">
		{#each achievements as achievement}
			<div
				class="flex cursor-pointer flex-col items-center rounded-lg p-3 transition-transform hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700/50"
				title={achievement.description}
			>
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-xl shadow-sm"
				>
					{achievement.icon}
				</div>
				<p class="mt-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-200">
					{achievement.name}
				</p>
			</div>
		{/each}
	</div>
</section>

<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import type { ModuleWithItems } from '$lib/server/db/repos/class';
	import IconPng from '$ui/common/IconPng.svelte';

	const { modules }: { modules: ModuleWithItems[] } = $props();

	let allItems = $derived(modules.flatMap((module) => module.items));

	let completedLessons = $derived(
		allItems.filter((item) => item.type === 'lesson' && item.submission?.status === 'pass').length
	);
	let totalLessons = $derived(allItems.filter((item) => item.type === 'lesson').length);
	let lessonsProgress = $derived(totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0);

	let completedProjects = $derived(
		allItems.filter((item) => item.type === 'code' && item.submission?.status === 'pass').length
	);
	let totalProjects = $derived(allItems.filter((item) => item.type === 'code').length);
	let challengesProgress = $derived(
		totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0
	);

	let earnedXP = $derived(
		allItems.reduce((sum, item) => sum + (item.submission?.xp_reward || 0), 0)
	);
	let totalXP = $derived(allItems.reduce((sum, item) => sum + (item?.baseXp || 0), 0));
	let xpProgress = $derived(totalXP > 0 ? (earnedXP / totalXP) * 100 : 0);
</script>

<div class="space-y-4">
	{#if totalLessons > 0}
		<div
			class="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-gray-100 p-2 py-4 dark:bg-gray-800/50"
		>
			<IconPng name="book-close" size={48} />
			<div>
				<div class="mb-3 flex items-center justify-between text-base">
					<span class="font-semibold text-gray-700 dark:text-gray-300">
						{i18n.t('common.lessons_completed')}
					</span>
					<span class="font-hacker text-sm font-medium text-gray-500 dark:text-gray-400">
						{completedLessons}/{totalLessons}
					</span>
				</div>
				<div class="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
					<div
						class="h-3 rounded-full bg-blue-400 transition-all duration-500"
						style="width: {lessonsProgress}%"
					></div>
				</div>
			</div>
		</div>
	{/if}
	{#if totalProjects > 0}
		<div
			class="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-gray-100 p-2 py-4 dark:bg-gray-800/50"
		>
			<IconPng name="terminal" size={48} />
			<div>
				<div class="mb-2 flex items-center justify-between text-base">
					<span class="font-semibold text-gray-700 dark:text-gray-300">
						{i18n.t('common.challenges_completed')}
					</span>
					<span class="font-hacker text-sm font-medium text-gray-500 dark:text-gray-400">
						{completedProjects}/{totalProjects}
					</span>
				</div>
				<div class="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
					<div
						class="h-3 rounded-full bg-lime-400 transition-all duration-500"
						style="width: {challengesProgress}%"
					></div>
				</div>
			</div>
		</div>
	{/if}
	{#if totalXP > 0}
		<div
			class="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-gray-100 p-2 py-4 dark:bg-gray-800/50"
		>
			<IconPng name="bolt" size={48} />
			<div>
				<div class="mb-2 flex items-center justify-between text-base">
					<span class="font-semibold text-gray-700 dark:text-gray-300">
						{i18n.t('common.xp_earned')}
					</span>
					<span class="font-hacker text-sm font-medium text-gray-500 dark:text-gray-400">
						{earnedXP}/{totalXP}
					</span>
				</div>
				<div class="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
					<div
						class="h-3 rounded-full bg-yellow-400 transition-all duration-500"
						style="width: {xpProgress}%"
					></div>
				</div>
			</div>
		</div>
	{/if}
</div>

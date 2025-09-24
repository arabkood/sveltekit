<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import type { ModuleWithItems } from '$lib/server/db/helpers/class';
	import Icon from '$ui/common/Icon.svelte';

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
	let totalXP = $derived(allItems.reduce((sum, item) => sum + item.base_xp, 0));
	let xpProgress = $derived(totalXP > 0 ? (earnedXP / totalXP) * 100 : 0);
</script>

<div class="rounded-2xl bg-slate-100 p-6 pe-2 dark:bg-slate-800/50">
	<h2 class="mb-6 text-xl font-bold text-slate-800 dark:text-white">
		{i18n.t('common.your_progress')}
	</h2>
	<div class="space-y-8">
		<div class="grid grid-cols-[auto_1fr_auto] items-center gap-3">
			<Icon name="book-open" size={32} />
			<div>
				<div class="mb-3 flex items-center justify-between text-base">
					<span class="font-semibold text-slate-700 dark:text-slate-300">
						{i18n.t('common.lessons_completed')}
					</span>
					<span class="font-mono font-medium text-slate-500 dark:text-slate-400">
						{completedLessons}/{totalLessons}
					</span>
				</div>
				<div class="mb-2 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
					<div
						class="h-3 rounded-full bg-yellow-400 transition-all duration-500"
						style="width: {lessonsProgress}%"
					></div>
				</div>
			</div>
		</div>
		<div class="grid grid-cols-[auto_1fr_auto] items-center gap-3">
			<Icon name="code" size={32} />
			<div>
				<div class="mb-2 flex items-center justify-between text-base">
					<span class="font-semibold text-slate-700 dark:text-slate-300">
						{i18n.t('common.challenges_completed')}
					</span>
					<span class="font-mono font-medium text-slate-500 dark:text-slate-400">
						{completedProjects}/{totalProjects}
					</span>
				</div>
				<div class="mb-2 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
					<div
						class="h-3 rounded-full bg-yellow-400 transition-all duration-500"
						style="width: {challengesProgress}%"
					></div>
				</div>
			</div>
		</div>
		<div class="grid grid-cols-[auto_1fr_auto] items-center gap-3">
			<Icon name="zap" size={32} />
			<div>
				<div class="mb-2 flex items-center justify-between text-base">
					<span class="font-semibold text-slate-700 dark:text-slate-300">
						{i18n.t('common.xp_earned')}
					</span>
					<span class="font-mono font-medium text-slate-500 dark:text-slate-400">
						{earnedXP}/{totalXP}
					</span>
				</div>
				<div class="mb-2 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
					<div
						class="h-3 rounded-full bg-yellow-400 transition-all duration-500"
						style="width: {xpProgress}%"
					></div>
				</div>
			</div>
		</div>
	</div>
</div>

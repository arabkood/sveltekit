<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import type { SelectModule } from '$lib/server/db/schema/class';
	import type { TranslationKey } from '$types/i18n';
	import Icon from '$ui/common/Icon.svelte';
	import { cn } from '$utils/classnames';

	const { module, trackSlug } = $props<{
		module: SelectModule;
		trackSlug: string;
	}>();

	if (!module.difficulty || module.difficulty == '') {
		module.difficulty = 'novice';
	}

	const status = $derived(module.done ? 'completed' : module.premiumOnly ? 'locked' : 'default');

	function getDifficultyColor(difficulty: string): string {
		const colors = {
			novice: 'text-green-800 dark:text-green-300',
			beginner: 'text-cyan-800 dark:text-cyan-300',
			intermediate: 'text-indigo-800 dark:text-indigo-300',
			advanced: 'text-yellow-800 dark:text-yellow-300',
			expert: 'text-red-900 dark:text-red-300'
		};
		return colors[difficulty as keyof typeof colors] || 'text-gray-600 bg-gray-50';
	}

	function getContainerClasses(): string {
		const baseClasses =
			'group relative flex items-center gap-3 first:border-t last:border-none border-b border-gray-100 dark:border-gray-700 p-3';

		if (status === 'locked') {
			return cn(
				baseClasses,
				'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 opacity-50'
			);
		}

		return cn(
			baseClasses,
			'bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100',
			'hover:bg-gray-100 hover:dark:bg-gray-700'
		);
	}

	function getStatusIconClasses(): string {
		const baseClasses = 'flex items-center justify-center rounded-full';
		const statusClasses: Record<string, string> = {
			completed: 'h-6 w-6 bg-green-100/10 text-green-600',
			locked: 'h-6 w-6 bg-gray-100 text-gray-400 dark:bg-gray-600 dark:text-gray-100',
			default:
				'h-5 w-5 border border-gray-200 text-gray-500 dark:border-gray-400 dark:text-gray-200'
		};
		return `${baseClasses} ${statusClasses[status] || statusClasses.default}`;
	}
</script>

<a href={`/track/${trackSlug}/${module.slug}`} class={getContainerClasses()}>
	<div class={getStatusIconClasses()}>
		{#if status === 'completed'}
			<Icon name="check" class="h-4 w-4" />
		{:else if status === 'locked'}
			<Icon name="lock" class="h-4 w-4" />
		{/if}
	</div>
	<div class="flex flex-1 items-center justify-between gap-4">
		<h4 class="font-medium">{module.title}</h4>
		<div class="mt-1 flex items-center gap-3 text-sm">
			<!-- <span class="flex items-center gap-1"> -->
			<!-- 	<Icon name="clock" class="h-3.5 w-3.5" /> -->
			<!-- 	{module.estimated_minutes}m -->
			<!-- </span> -->
			<span class="flex items-center gap-1">
				{module.xpReward}
				<Icon name="zap" class="h-3.5 w-3.5" />
			</span>
			<span
				class={cn(
					'text-small inline-flex items-center px-2 py-0.5 font-medium',
					getDifficultyColor(module.difficulty)
				)}
			>
				{i18n.t(`tracks.difficulty.${module.difficulty}` as TranslationKey)}
			</span>
			<!-- {#if module.type === 'project'} -->
			<!-- 	<span -->
			<!-- 		class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700" -->
			<!-- 	> -->
			<!-- 		<Icon name="check-circle" class="h-3.5 w-3.5" /> -->
			<!-- 		{i18n.t('tracks.module_types.project')} -->
			<!-- 	</span> -->
			<!-- {:else if module.type === 'exercise'} -->
			<!-- 	<span -->
			<!-- 		class="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700" -->
			<!-- 	> -->
			<!-- 		<Icon name="code" class="h-3.5 w-3.5" /> -->
			<!-- 		{i18n.t('tracks.module_types.coding')} -->
			<!-- 	</span> -->
			<!-- {:else} -->
			<!-- 	<span -->
			<!-- 		class="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700" -->
			<!-- 	> -->
			<!-- 		<Icon name="folder" class="h-3.5 w-3.5" /> -->
			<!-- 		{i18n.t('tracks.module_types.lesson')} -->
			<!-- 	</span> -->
			<!-- {/if} -->
		</div>
	</div>
</a>

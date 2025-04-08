<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import Icon from '$ui/common/Icon.svelte';

	let {
		longestStreak = '0',
		completedItems = '0'
	}: {
		longestStreak?: number | string;
		completedItems?: number | string;
	} = $props();
</script>

<div class="bg-section rounded-2xl p-6 shadow-sm">
	<h2 class="mb-6 text-xl font-semibold">
		{i18n.t('dashboard.achievements')}
	</h2>

	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2">
		<div class="flex flex-col items-center rounded-lg bg-yellow-50 p-4 dark:bg-gray-700">
			<Icon name="trophy" class="mb-2 h-8 w-8 text-transparent" />
			<div class="text-center">
				<div class="font-medium">{i18n.t('dashboard.highest_streak')}</div>
				<div class="mt-1 text-sm opacity-60">
					{i18n.t('common.days', { days: String(longestStreak) })}
				</div>
			</div>
		</div>

		<div class="flex flex-col items-center rounded-lg bg-yellow-50 p-4 dark:bg-gray-700">
			<Icon name="check-circle" class="mb-2 h-8 w-8 text-yellow-500" />
			<div class="text-center">
				<div class="font-medium">{i18n.t('common.solutions')}</div>
				<div class="mt-1 text-sm opacity-60">{completedItems}</div>
			</div>
		</div>
	</div>
</div>

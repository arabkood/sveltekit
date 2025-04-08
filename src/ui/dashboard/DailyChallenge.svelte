<script>
	import { i18n } from '$i18n/i18n';

	import Icon from '$ui/common/Icon.svelte';
</script>

<div class="bg-section rounded-2xl p-6 shadow-sm transition hover:shadow-md">
	<div class="mb-6">
		<div
			class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 dark:bg-gray-700"
		>
			<Icon name="trophy" class="h-6 w-6 text-transparent" />
		</div>
		<h3 class="mb-2 text-xl font-semibold">{i18n.t('dashboard.daily_challenge')}</h3>
		<p class="text-sm opacity-60">{i18n.t('dashboard.daily_challenge_desc')}</p>
	</div>
	<button
		class="w-full rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-600 dark:bg-yellow-500"
	>
		{i18n.t('common.start_now')}
	</button>
</div>

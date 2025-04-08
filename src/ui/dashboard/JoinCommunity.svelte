<script>
	import { i18n } from '$i18n/i18n';

	import Icon from '$ui/common/Icon.svelte';
</script>

<div class="rounded-2xl bg-gray-900 p-6">
	<div class="mb-6">
		<span
			class="bg-primary-500/20 text-primary-300 mb-4 inline-flex items-center rounded-full px-4 py-1 text-sm"
		>
			<Icon name="users" class="me-2 h-4 w-4" />
			{i18n.t('dashboard.community')}
		</span>
		<h3 class="mb-2 text-xl font-bold text-white">{i18n.t('dashboard.join_community')}</h3>
		<p class="text-sm text-gray-400">{i18n.t('dashboard.join_community_desc')}</p>
	</div>
	<button
		class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
	>
		<Icon name="message-circle" class="h-5 w-5" />
		{i18n.t('dashboard.join_now')}
	</button>
</div>

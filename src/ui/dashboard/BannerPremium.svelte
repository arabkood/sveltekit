<script>
	import { i18n } from '$i18n/i18n';
	import Icon from '$ui/common/Icon.svelte';
</script>

<div class="mb-8 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-1">
	<div class="relative flex items-center justify-between rounded-xl bg-gray-900 p-6 lg:p-8">
		<div class="relative z-10 max-w-xl space-y-4">
			<span
				class="inline-flex items-center rounded-full bg-purple-500/20 px-4 py-1 text-sm text-purple-300"
			>
				<Icon name="sparkles" class="me-2 h-4 w-4" />
				{i18n.t('dashboard.premium_offer')}
			</span>
			<h2 class="text-2xl font-bold text-white lg:text-3xl">
				{i18n.t('dashboard.unlock_premium')}
			</h2>
			<p class="text-purple-200">{i18n.t('dashboard.premium_description')}</p>
			<a
				href="/pricing"
				class="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-purple-600 transition hover:bg-purple-50"
			>
				<Icon name="star" class="h-5 w-5 text-yellow-500" />
				<span>{i18n.t('common.upgrade_now')}</span>
			</a>
		</div>
		<div class="absolute top-0 right-0 h-full w-1/3">
			<div
				class="absolute top-1/2 right-16 h-64 w-64 -translate-y-1/2 rounded-full bg-purple-500/20 blur-3xl"
			></div>
			<div
				class="absolute top-1/2 right-32 h-48 w-48 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-2xl"
			></div>
		</div>
	</div>
</div>

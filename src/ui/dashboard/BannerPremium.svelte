<script>
	import { i18n } from '$i18n/i18n';
	import Button from '$ui/common/Button.svelte';
	import IconPng from '$ui/common/IconPng.svelte';
</script>

<div
	class="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-100 ring-1 ring-gray-900/5 dark:from-gray-900 dark:to-gray-950 dark:ring-white/10"
>
	<div class="relative flex flex-col p-6 text-center md:flex-row md:gap-12 md:p-10 md:text-start">
		<!-- Content -->
		<div
			class="relative z-10 mx-auto flex max-w-xl flex-shrink-0 flex-col items-center space-y-6 pt-20 md:mx-0 md:items-start md:pt-0"
		>
			<p class="font-semibold text-purple-600 dark:text-purple-400">
				{i18n.t('dashboard.premium_offer')}
			</p>
			<h2
				class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl dark:text-white"
			>
				{i18n.t('dashboard.unlock_premium')}
			</h2>
			<p class="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
				{i18n.t('dashboard.premium_description')}
			</p>
			<Button
				href="/pricing"
				variant="attention"
				size="lg"
				class="transition-all hover:scale-105 hover:brightness-110"
			>
				<span>{i18n.t('common.upgrade_now')}</span>
			</Button>
		</div>
		<!-- Visual Element -->
		<div
			class="pointer-events-none absolute top-16 left-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 select-none md:top-1/2 md:left-auto md:h-[400px] md:w-[400px] md:translate-x-0 md:-translate-y-1/2 md:ltr:-right-20 md:rtl:-left-20"
		>
			<div
				class="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 opacity-20 blur-3xl dark:from-purple-600 dark:to-indigo-600 dark:opacity-25"
			></div>
			<div
				class="absolute top-1/2 left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/10 backdrop-blur-lg md:h-32 md:w-32 dark:bg-gray-950/50 dark:ring-white/20"
			>
				<IconPng name="premium" size={48} class="md:hidden" />
				<IconPng name="premium" size={64} class="hidden md:block" />
			</div>
		</div>
	</div>
</div>

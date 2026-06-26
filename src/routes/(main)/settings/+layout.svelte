<script lang="ts">
	import { page } from '$app/state';
	import { i18n } from '$i18n/i18n';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';

	let { children, data } = $props();

	type Tab = {
		label: string;
		href: string;
	};

	const tabs: Tab[] = [
		{ label: i18n.t('settings.account.title'), href: '/settings/account' }
		// { label: i18n.t('settings.billing.title'), href: '/settings/billing' }
	];
	if (data.user?.hasBilling) {
		tabs.push({ label: i18n.t('settings.billing.title'), href: '/services/portal' });
	}
</script>

<div class="bg-page min-h-screen">
	<main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="py-6 sm:py-10">
			<!-- Header -->
			<div class="mb-6 sm:mb-8">
				<div class="flex items-center">
					<Icon name="cog" class="h-5 w-5  sm:h-6 sm:w-6" />
					<h1 class="ms-3 text-xl font-semibold sm:text-2xl">
						{i18n.t('settings.title')}
					</h1>
				</div>
			</div>

			<!-- Mobile Tabs -->
			<nav class="mb-6 block sm:hidden">
				<div class="border-b border-gray-200">
					<ul class="scrollbar-none flex space-x-4 overflow-x-auto pb-1">
						{#each tabs as tab}
							<li class="flex-shrink-0">
								<a
									href={tab.href}
									class="inline-flex border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap {page
										.url.pathname === tab.href
										? 'border-emerald-500 text-emerald-600'
										: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
								>
									{tab.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</nav>

			<!-- Desktop Layout -->
			<div class="flex flex-col sm:flex-row sm:gap-8">
				<nav class="hidden w-48 flex-shrink-0 sm:block">
					{#each tabs as tab}
						<Button
							href={tab.href}
							variant={page.url.pathname === tab.href ? 'link-pill-active' : 'link-pill'}
							fullWidth={true}
						>
							{tab.label}
						</Button>
					{/each}
				</nav>

				<!-- Content -->
				<div class="min-w-0 flex-1">
					{@render children()}
				</div>
			</div>
		</div>
	</main>
</div>

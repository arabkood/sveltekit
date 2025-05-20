<script lang="ts">
	import { page } from '$app/state';
	import { i18n } from '$i18n/i18n';
	import type { SelectUser } from '$lib/server/db/schema/auth';
	import Icon from '$ui/common/Icon.svelte';
	import Logo from '$ui/common/Logo.svelte';
	import NavbarUserMenu from './NavbarUserMenu.svelte';
	import { slide } from 'svelte/transition';

	let { user, transition = true }: { user: SelectUser; transition?: boolean } = $props();

	let isOpen = $state(false);

	const links = [
		{
			name: i18n.t('navigation.dashboard'),
			href: '/'
		},
		{
			name: i18n.t('navigation.exploreTracks'),
			href: '/courses'
		},
		{
			name: i18n.t('navigation.upgradePlan'),
			href: '/settings/billing'
		}
	];

	const activeLink = $derived(page.url.pathname);
</script>

<nav
	class="bg-header max-h-16 shadow-sm transition-all"
	transition:slide={{ duration: transition ? 500 : 0 }}
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-12 items-center gap-4">
			<!-- Mobile menu button -->
			<div class="sm:hidden">
				<button
					onclick={() => (isOpen = !isOpen)}
					class="bg-clickable inline-flex items-center justify-center rounded-md p-2 focus:outline-none"
					aria-expanded={isOpen}
					aria-label="Toggle menu"
				>
					{#if isOpen}
						<Icon name="x" size={24} />
					{:else}
						<Icon name="menu" size={24} />
					{/if}
				</button>
			</div>

			<!-- Logo Section -->
			<div class="flex flex-shrink-0 items-center">
				<Logo variant="withTextMobile" size="md" />
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden items-center sm:flex">
				{#each links as link}
					<a
						href={link.href}
						class={`bg-clickable me-2 flex items-center rounded-full px-3 py-1 text-sm`}
					>
						<span
							class={`${activeLink === link.href ? 'text-primary-700 dark:text-primary-400' : ''}`}
						>
							{link.name}
						</span>
					</a>
				{/each}
			</div>

			<!-- Desktop Menu -->
			<div class="ms-auto hidden items-center sm:flex">
				<NavbarUserMenu {user} />
			</div>

			<p class="bg-clickable pointer-events-none rounded-full px-2 py-1 text-sm" dir="ltr">
				{user?.username} XP
			</p>
		</div>

		<!-- Mobile Menu -->
		{#if isOpen}
			<div transition:slide={{ duration: 200 }} class="sm:hidden">
				<ul class="space-y-1 divide-y divide-gray-100 pt-2 pb-3">
					{#each links as link}
						<li>
							<a
								href={link.href}
								class={`bg-clickable flex gap-2 px-4 py-2 text-right text-sm ${
									activeLink === link.href ? 'text-primary-700 dark:text-primary-400' : ''
								}`}
							>
								{link.name}
							</a>
						</li>
					{/each}
					<NavbarUserMenu {user} variant="mobile" />
				</ul>
			</div>
		{/if}
	</div>
</nav>

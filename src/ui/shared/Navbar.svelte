<script lang="ts">
	import { page } from '$app/state';
	import { i18n } from '$i18n/i18n';
	import type { SelectUser } from '$lib/server/db/schema/auth';
	import Button from '$ui/common/Button.svelte';
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
		}
		// {
		// 	name: i18n.t('navigation.upgradePlan'),
		// 	href: '/settings/billing'
		// }
	];

	const activeLink = $derived(page.url.pathname);
</script>

<nav
	class="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
	transition:slide={{ duration: transition ? 500 : 0 }}
>
	<div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center gap-4">
				<!-- Mobile menu button -->
				<div class="sm:hidden">
					<button
						onclick={() => (isOpen = !isOpen)}
						class="focus-visible:ring-primary-500 inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
						aria-expanded={isOpen}
						aria-label={'toggle menu'}
					>
						{#if isOpen}
							<Icon name="x" size={24} />
						{:else}
							<Icon name="menu" size={24} />
						{/if}
					</button>
				</div>

				<!-- Logo Section -->
				<a href="/" aria-label={'home'} class="flex flex-shrink-0 items-center">
					<Logo variant="withTextMobile" size="md" />
				</a>

				<!-- Desktop Navigation -->
				<div class="ml-6 hidden items-center gap-6 sm:flex">
					{#each links as link}
						<Button
							href={link.href}
							aria-current={activeLink === link.href ? 'page' : undefined}
							variant={activeLink === link.href ? 'link-pill-active' : 'link-pill'}
							size="sm"
							rounded={true}
							onclick={() => (isOpen = false)}
						>
							{link.name}
						</Button>
					{/each}
				</div>
			</div>

			<!-- Desktop User Area -->
			<div class="hidden items-center gap-4 sm:flex">
				<div
					class="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 select-none dark:bg-amber-700/60 dark:text-amber-100"
					dir="ltr"
					aria-label="User XP"
				>
					<Icon name="star" size={14} class="text-amber-500 dark:text-amber-300" />
					0 XP
				</div>
				<NavbarUserMenu {user} />
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if isOpen}
			<div
				transition:slide={{ duration: 250 }}
				class="border-t border-gray-200 pt-2 pb-4 sm:hidden dark:border-gray-700"
			>
				<ul class="space-y-1">
					{#each links as link}
						<li>
							<Button
								href={link.href}
								aria-current={activeLink === link.href ? 'page' : undefined}
								variant={activeLink === link.href ? 'link-pill-active' : 'link-pill'}
								size="sm"
								class="w-full"
								rounded={false}
								onclick={() => (isOpen = false)}
							>
								{link.name}
							</Button>
						</li>
					{/each}
				</ul>
				<div class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
					<NavbarUserMenu {user} variant="mobile" />

					<div
						class="mt-4 flex items-center justify-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 dark:bg-amber-700 dark:text-amber-100"
						aria-label="User XP"
						dir="ltr"
					>
						<Icon name="star" size={16} class="text-amber-500 dark:text-amber-300" />
						XP
					</div>
				</div>
			</div>
		{/if}
	</div>
</nav>

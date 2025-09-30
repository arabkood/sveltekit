<script lang="ts">
	import { page } from '$app/state';
	import { i18n } from '$i18n/i18n';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import Logo from '$ui/common/Logo.svelte';
	import NavbarUserMenu from './NavbarUserMenu.svelte';
	import { slide, scale } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';
	import NavbarLevel from './NavbarLevel.svelte';
	import type { UserPrivate, UserStats } from '$lib/server/db/repos/user';

	let {
		user,
		userStats,
		transition = true
	}: { user?: UserPrivate; userStats?: UserStats; transition?: boolean } = $props();

	let isOpen = $state(false);
	let isScrolled = $state(false);

	// Handle navbar scroll behavior
	let lastScrollY = 0;
	let navbarVisible = $state(true);

	const handleScroll = () => {
		const currentScrollY = window.scrollY;
		isScrolled = currentScrollY > 20;
		if (currentScrollY > lastScrollY && currentScrollY > 100) {
			navbarVisible = false;
		} else {
			navbarVisible = true;
		}
		lastScrollY = currentScrollY;
	};

	const links = $derived.by(() => {
		let l = [
			{ name: i18n.t('navigation.exploreTracks'), href: '/courses', icon: 'book-open' },
			{ name: i18n.t('navigation.glossary'), href: '/pages/glossary', icon: 'search' }
		];
		if (user) {
			l.unshift({ name: i18n.t('navigation.dashboard'), href: '/dashboard', icon: 'dashboard' });
		}
		return l;
	});
	const activePath = $derived(page.url.pathname);

	const handleOutsideClick = (event: Event) => {
		const target = event.target as HTMLElement;
		if (!target.closest('nav') && isOpen) {
			isOpen = false;
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && isOpen) {
			isOpen = false;
		}
	};
</script>

<svelte:window onclick={handleOutsideClick} onkeydown={handleKeyDown} onscroll={handleScroll} />

<nav
	class="fixed top-0 right-0 left-0 z-50 border-b border-gray-200/50 bg-white/90 shadow-xs backdrop-blur-xl transition-all duration-300 dark:border-gray-800/50 dark:bg-gray-900/90 {isScrolled
		? 'bg-white/95 shadow-xl dark:bg-gray-900/95'
		: ''} {navbarVisible ? 'translate-y-0' : '-translate-y-full'}"
	transition:slide={{ duration: transition ? 500 : 0 }}
	aria-label="Main navigation"
>
	<div class="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<!-- Left section: Logo and Navigation -->
		<div class="flex items-center gap-6">
			<!-- Mobile menu button -->
			<button
				class="group relative rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 sm:hidden dark:text-gray-300 dark:hover:bg-gray-800"
				onclick={() => (isOpen = !isOpen)}
				aria-label={isOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={isOpen}
				aria-controls="mobile-menu"
			>
				<div class="relative">
					<Icon
						name={isOpen ? 'x' : 'menu'}
						size={24}
						class="transition-transform duration-200 {isOpen ? 'rotate-90' : ''}"
					/>
					<div
						class="absolute inset-0 rounded-lg bg-current opacity-0 transition-opacity group-hover:opacity-10"
					></div>
				</div>
			</button>

			<!-- Logo -->
			<a
				href="/"
				aria-label="Go to homepage"
				class="group flex-shrink-0 rounded-lg p-1 transition-transform duration-200"
			>
				<Logo
					variant="withTextMobile"
					size="md"
					class="transition-opacity group-hover:opacity-80"
				/>
			</a>

			<!-- Desktop navigation -->
			<div class="ml-2 hidden items-center gap-3 sm:flex">
				{#each links as link}
					{@const isActive = activePath === link.href}
					<Button
						href={link.href}
						aria-current={isActive ? 'page' : undefined}
						variant={isActive ? 'link-pill-active' : 'link-pill'}
						size="sm"
						rounded
						class="relative"
						startIcon={link.icon as any}
					>
						{link.name}
						{#if isActive}
							<div
								class="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-current"
								transition:scale={{ duration: 300, easing: backOut }}
							></div>
						{/if}
					</Button>
				{/each}
			</div>
		</div>

		<!-- Right section: User info or Auth buttons -->
		<div class="hidden items-center gap-2 sm:flex">
			{#if user && userStats}
				<NavbarLevel {userStats} />

				<NavbarUserMenu {user} />
			{:else}
				<!-- Auth Buttons -->
				<Button href="/signin" variant="link-pill" size="sm" rounded>
					{i18n.t('navigation.signin')}
				</Button>
				<Button href="/signup" variant="attention" size="sm" rounded>
					{i18n.t('navigation.signup')}
				</Button>
			{/if}
		</div>
	</div>

	<!-- Mobile menu -->
	{#if isOpen}
		<div
			transition:slide={{ duration: 300, easing: quintOut }}
			class="border-t border-gray-200 bg-white/95 backdrop-blur-sm sm:hidden dark:border-gray-800 dark:bg-gray-900/95"
			id="mobile-menu"
		>
			<div class="px-4 py-4">
				<nav class="space-y-2" aria-label="Mobile navigation">
					{#each links as link}
						{@const isActive = activePath === link.href}
						<Button
							href={link.href}
							aria-current={isActive ? 'page' : undefined}
							variant={isActive ? 'link-pill-active' : 'link-pill'}
							size="sm"
							class="w-full justify-start py-5"
							onclick={() => (isOpen = false)}
							startIcon={link.icon as any}
						>
							<span class="whitespace-nowrap">{link.name}</span>
						</Button>
					{/each}
				</nav>

				{#if user && userStats}
					<div class="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
						<NavbarUserMenu {user} variant="mobile" />
					</div>
				{:else}
					<div class="mt-6 space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
						<Button
							href="/signup"
							variant="default"
							size="sm"
							class="flex w-full items-center justify-center"
							onclick={() => (isOpen = false)}
						>
							{i18n.t('navigation.signup')}
						</Button>
						<Button
							href="/signin"
							variant="ghost"
							size="sm"
							class="flex w-full items-center justify-center"
							onclick={() => (isOpen = false)}
						>
							{i18n.t('navigation.signin')}
						</Button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>

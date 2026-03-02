<script lang="ts">
	import { page } from '$app/state';
	import { i18n } from '$i18n/i18n';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import Logo from '$ui/common/Logo.svelte';
	import NavbarUserMenu from './NavbarUserMenu.svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import NavbarLevel from './NavbarLevel.svelte';
	import type { UserPrivate, UserStats } from '$lib/server/db/repos/user';

	let {
		user,
		userStats,
		transition = true,
		logoVariant = 'withTextMobile' as 'withText' | 'iconOnly' | 'withTextMobile'
	}: {
		user?: UserPrivate;
		userStats?: UserStats;
		transition?: boolean;
		logoVariant?: 'withText' | 'iconOnly' | 'withTextMobile';
	} = $props();

	let isOpen = $state(false);
	let isScrolled = $state(false);
	let navbarVisible = $state(true);
	let lastScrollY = 0;

	// Handle navbar scroll behavior
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
	class="fixed inset-x-0 top-0 z-50 border-b border-black/10 transition-all duration-500 dark:border-white/10 {isScrolled
		? 'bg-white/80 shadow-sm backdrop-blur-xl dark:bg-zinc-950/80'
		: 'bg-white dark:bg-zinc-950'} {navbarVisible ? 'translate-y-0' : '-translate-y-full'}"
	aria-label="Main navigation"
>
	<div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
		<!-- Left section: Logo and Navigation -->
		<div class="flex items-center gap-8">
			<!-- Mobile menu button -->
			<button
				class="p-2 text-zinc-500 transition-colors hover:text-zinc-900 sm:hidden dark:text-zinc-400 dark:hover:text-zinc-50"
				onclick={() => (isOpen = !isOpen)}
				aria-label={isOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={isOpen}
				aria-controls="mobile-menu"
			>
				<Icon
					name={isOpen ? 'x' : 'menu'}
					size={24}
					class="transition-transform duration-300 {isOpen ? 'scale-110 rotate-90' : ''}"
				/>
			</button>

			<!-- Logo -->
			<a
				href="/"
				aria-label="Go to homepage"
				class="flex-shrink-0 transition-opacity duration-300 hover:opacity-70"
			>
				<Logo variant={logoVariant} size="md" />
			</a>

			<!-- Desktop navigation -->
			<div class="hidden items-center gap-2 sm:flex">
				{#each links as link}
					{@const isActive = activePath === link.href}
					<Button
						href={link.href}
						aria-current={isActive ? 'page' : undefined}
						variant={isActive ? 'link-pill-active' : 'link-pill'}
						size="sm"
						rounded
						startIcon={link.icon as any}
					>
						{link.name}
					</Button>
				{/each}
			</div>
		</div>

		<!-- Right section: User info or Auth buttons -->
		<div class="hidden items-center gap-4 sm:flex">
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

	<!-- Mobile menu (Glassmorphism overlay) -->
	{#if isOpen}
		<div
			transition:slide={{ duration: 300, easing: quintOut }}
			class="absolute inset-x-0 top-full bg-white/95 px-6 pt-2 pb-6 shadow-lg backdrop-blur-2xl sm:hidden dark:bg-zinc-950/95"
			id="mobile-menu"
		>
			<nav class="flex flex-col gap-2" aria-label="Mobile navigation">
				{#each links as link}
					{@const isActive = activePath === link.href}
					<Button
						href={link.href}
						aria-current={isActive ? 'page' : undefined}
						variant={isActive ? 'link-pill-active' : 'link-pill'}
						size="md"
						class="w-full justify-start text-base"
						onclick={() => (isOpen = false)}
						startIcon={link.icon as any}
					>
						{link.name}
					</Button>
				{/each}
			</nav>

			<div class="mt-6">
				{#if user && userStats}
					<NavbarUserMenu {user} variant="mobile" />
				{:else}
					<div class="flex flex-col gap-3">
						<Button
							href="/signup"
							variant="attention"
							size="md"
							class="w-full justify-center text-base"
							onclick={() => (isOpen = false)}
						>
							{i18n.t('navigation.signup')}
						</Button>
						<Button
							href="/signin"
							variant="link-pill"
							size="md"
							class="w-full justify-center text-base"
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

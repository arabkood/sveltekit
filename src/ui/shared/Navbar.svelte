<script lang="ts">
	import { page } from '$app/state';
	import { i18n } from '$i18n/i18n';
	import type { SelectUser } from '$lib/server/db/schema/auth';
	import type { SelectUsersStats } from '$lib/server/db/schema/users';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import Logo from '$ui/common/Logo.svelte';
	import NavbarUserMenu from './NavbarUserMenu.svelte';
	import { slide, fly, scale } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';
	import { useXp } from '$utils/xp';

	let {
		user,
		userStats,
		transition = true
	}: { user?: SelectUser; userStats?: SelectUsersStats; transition?: boolean } = $props();

	let isOpen = $state(false);
	let isHovering = $state(false);
	let isLevelAnimating = $state(false);
	let isScrolled = $state(false);

	// Handle navbar scroll behavior
	let lastScrollY = 0;
	let navbarVisible = $state(true);

	const handleScroll = () => {
		const currentScrollY = window.scrollY;

		// Update scroll state for styling
		isScrolled = currentScrollY > 20;

		// Show/hide navbar based on scroll direction
		if (currentScrollY > lastScrollY && currentScrollY > 100) {
			// Scrolling down & past threshold - hide navbar
			navbarVisible = false;
		} else {
			// Scrolling up or at top - show navbar
			navbarVisible = true;
		}

		lastScrollY = currentScrollY;
	};

	const xp = $derived(userStats ? useXp(userStats.totalXp) : undefined);
	const currentLevel = $derived(xp?.currentLevel);
	const progressPercent = $derived(xp?.progressPercent);

	const RANKS = [
		{
			minLevel: 100,
			title: 'أسطورة عظمى',
			color:
				'dark:from-violet-500 dark:via-purple-500 dark:to-fuchsia-600 from-violet-600 via-purple-600 to-fuchsia-700 dark:text-violet-200 text-violet-100',
			glow: 'dark:shadow-violet-400/40 shadow-violet-500/60',
			bgColor:
				'dark:bg-gradient-to-br dark:from-violet-500/20 dark:to-fuchsia-500/20 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15',
			icon: '👑'
		},
		{
			minLevel: 50,
			title: 'محارب أسطوري',
			color:
				'dark:from-rose-500 dark:via-red-500 dark:to-pink-600 from-rose-600 via-red-600 to-pink-700 dark:text-rose-200 text-rose-100',
			glow: 'dark:shadow-rose-400/40 shadow-rose-500/60',
			bgColor:
				'dark:bg-gradient-to-br dark:from-rose-500/20 dark:to-red-500/20 bg-gradient-to-br from-rose-500/15 to-red-500/15',
			icon: '⚔️'
		},
		{
			minLevel: 25,
			title: 'خبير ماهر',
			color:
				'dark:from-cyan-500 dark:via-blue-500 dark:to-indigo-600 from-cyan-600 via-blue-600 to-indigo-700 dark:text-cyan-200 text-cyan-100',
			glow: 'dark:shadow-blue-400/40 shadow-blue-500/60',
			bgColor:
				'dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-blue-500/20 bg-gradient-to-br from-cyan-500/15 to-blue-500/15',
			icon: '🎯'
		},
		{
			minLevel: 10,
			title: 'محترف متقدم',
			color:
				'dark:from-green-500 dark:via-emerald-500 dark:to-teal-600 from-green-600 via-emerald-600 to-teal-700 dark:text-green-200 text-green-100',
			glow: 'dark:shadow-green-400/40 shadow-green-500/60',
			bgColor:
				'dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-500/20 bg-gradient-to-br from-green-500/15 to-emerald-500/15',
			icon: '🚀'
		},
		{
			minLevel: 5,
			title: 'نجم صاعد',
			color:
				'dark:from-yellow-500 dark:via-amber-500 dark:to-orange-600 from-yellow-600 via-amber-600 to-orange-700 dark:text-yellow-200 text-yellow-100',
			glow: 'dark:shadow-yellow-400/40 shadow-yellow-500/60',
			bgColor:
				'dark:bg-gradient-to-br dark:from-yellow-500/20 dark:to-amber-500/20 bg-gradient-to-br from-yellow-500/15 to-amber-500/15',
			icon: '⭐'
		},
		{
			minLevel: 0,
			title: 'مبتدئ واعد',
			color:
				'dark:from-slate-500 dark:via-gray-500 dark:to-zinc-600 from-slate-600 via-gray-600 to-zinc-700 dark:text-slate-200 text-slate-100',
			glow: 'dark:shadow-slate-400/40 shadow-slate-500/60',
			bgColor:
				'dark:bg-gradient-to-br dark:from-slate-500/20 dark:to-gray-500/20 bg-gradient-to-br from-slate-500/15 to-gray-500/15',
			icon: '🌱'
		}
	];

	const rankInfo = $derived(
		currentLevel !== undefined ? RANKS.find((r) => currentLevel >= r.minLevel)! : undefined
	);
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

	// Enhanced animations and interactions
	const handleLevelClick = () => {
		isLevelAnimating = true;
		setTimeout(() => (isLevelAnimating = false), 600);
	};

	// Close mobile menu when clicking outside
	const handleOutsideClick = (event: Event) => {
		const target = event.target as HTMLElement;
		if (!target.closest('nav') && isOpen) {
			isOpen = false;
		}
	};

	// Keyboard navigation support
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
				class="group relative rounded-lg p-2 text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-gray-100 active:scale-95 sm:hidden dark:text-gray-300 dark:hover:bg-gray-800"
				onclick={() => (isOpen = !isOpen)}
				aria-label={isOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={isOpen}
				aria-controls="mobile-menu"
			>
				<div class="relative">
					<Icon
						name={isOpen ? 'x' : 'menu'}
						size={24}
						class="transition-transform duration-200 {isOpen
							? 'rotate-90'
							: 'group-hover:scale-110'}"
					/>
					<!-- Subtle interaction indicator -->
					<div
						class="absolute inset-0 rounded-lg bg-current opacity-0 transition-opacity group-hover:opacity-10"
					></div>
				</div>
			</button>

			<!-- Logo with enhanced hover effect -->
			<a
				href="/"
				aria-label="Go to homepage"
				class="group flex-shrink-0 rounded-lg p-1 transition-transform duration-200 hover:scale-105 active:scale-95"
			>
				<Logo
					variant="withTextMobile"
					size="md"
					class="transition-opacity group-hover:opacity-80"
				/>
			</a>

			<!-- Desktop navigation with improved visual hierarchy -->
			<div class="ml-2 hidden items-center gap-3 sm:flex">
				{#each links as link}
					{@const isActive = activePath === link.href}
					<Button
						href={link.href}
						aria-current={isActive ? 'page' : undefined}
						variant={isActive ? 'link-pill-active' : 'link-pill'}
						size="sm"
						rounded
						class="group relative overflow-hidden transition-all duration-200 {isActive
							? 'font-semibold'
							: 'hover:scale-105'} flex items-center"
						startIcon={link.icon}
					>
						{link.name}

						<!-- Active indicator -->
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
			{#if user && userStats && rankInfo && currentLevel !== undefined && progressPercent !== undefined && xp}
				<!-- Enhanced level indicator with better UX -->
				<div
					class="group relative"
					onmouseenter={() => (isHovering = true)}
					onmouseleave={() => (isHovering = false)}
					role="button"
					tabindex="0"
					onclick={handleLevelClick}
					onkeydown={(e) => e.key === 'Enter' && handleLevelClick()}
					aria-label="View level progress details"
				>
					<button
						class="flex h-10 cursor-pointer items-center gap-3 rounded-xl bg-gradient-to-r from-gray-200/60 to-gray-300/60 ps-2 pe-3 text-black ring-1 ring-gray-300 transition-all duration-300 hover:shadow-xl hover:ring-gray-400 dark:from-gray-800/60 dark:to-gray-900/60 dark:text-white dark:ring-gray-700/50 dark:hover:ring-gray-600 {rankInfo.glow} {isLevelAnimating
							? 'scale-105 animate-pulse'
							: ''} backdrop-blur-sm"
					>
						<!-- Rank icon and level display -->
						<div class="flex items-center gap-2">
							<!-- Level badge with better design -->
							<div
								class="flex items-center gap-1 rounded-lg bg-gradient-to-br {rankInfo.bgColor} px-2 py-1 shadow-lg"
							>
								<span class="text-xs font-bold text-white">مستوى</span>
								<span class="text-sm font-bold text-white">{currentLevel}</span>
							</div>
							<span class="text-lg">{rankInfo.icon}</span>
						</div>

						<!-- XP display with better typography -->
						<div class="flex flex-col items-end">
							<div class="text-sm leading-none font-bold tabular-nums">
								{userStats.totalXp.toLocaleString()}
							</div>
							<div class="text-xs leading-none text-gray-400">XP</div>
						</div>

						<!-- Progress indicator -->
						<div class="h-6 w-1 overflow-hidden rounded-full bg-gray-700">
							<div
								class="w-full rounded-full bg-gradient-to-t {rankInfo.color} transition-all duration-1000"
								style="height: {progressPercent}%"
							></div>
						</div>
					</button>

					<!-- Enhanced tooltip with better information architecture -->
					{#if isHovering}
						<div
							class="absolute top-full left-0 z-50 mt-3 w-96 rounded-2xl border border-gray-300/50 bg-white/95 p-6 text-black shadow-2xl backdrop-blur-xl dark:border-white/20 dark:bg-gray-900/95 dark:text-white {rankInfo.glow}"
							transition:fly={{ y: -10, duration: 300, easing: quintOut }}
							dir="rtl"
							role="tooltip"
						>
							<!-- Header with rank info -->
							<div class="mb-4 flex items-start justify-between">
								<div class="flex-1">
									<div class="mb-1 flex items-center gap-2">
										<span class="text-2xl">{rankInfo.icon}</span>
										<h3
											class="bg-gradient-to-r {rankInfo.color} bg-clip-text text-xl font-bold text-transparent"
										>
											{rankInfo.title}
										</h3>
									</div>
									<p class="text-sm text-gray-700 dark:text-gray-400">المستوى {currentLevel}</p>
								</div>
								<div
									class="flex items-center gap-1 rounded-lg bg-gradient-to-br {rankInfo.bgColor} px-3 py-2 shadow-lg"
								>
									<span class="text-xs font-bold text-white">مستوى</span>
									<span class="text-lg font-bold text-white">{currentLevel}</span>
								</div>
							</div>

							<!-- Progress section with visual improvements -->
							<div class="mb-6 {rankInfo.bgColor} rounded-xl p-4">
								<div class="mb-3 flex justify-between text-sm">
									<span class="font-medium text-gray-600 dark:text-gray-300"
										>التقدم للمستوى التالي</span
									>
									<span class="font-bold text-black dark:text-white"
										>{Math.floor(progressPercent)}%</span
									>
								</div>

								<div
									class="relative h-3 overflow-hidden rounded-full bg-gray-300/50 shadow-inner dark:bg-gray-700/50"
								>
									<div
										class="h-full rounded-full bg-gradient-to-r {rankInfo.color} shadow-sm transition-all duration-1000"
										style="width: {progressPercent}%"
									></div>
									<!-- Shine effect -->
									<div
										class="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
									></div>
								</div>
							</div>

							<!-- Stats grid with better visual hierarchy -->

							<div class="grid grid-cols-2 gap-4">
								<div
									class="rounded-xl border border-gray-300/50 bg-gray-100 p-4 text-center dark:border-gray-700/50 dark:bg-gray-800/60"
								>
									<div class="mb-1 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
										{xp.xpLeftForNextLevel.toLocaleString()}
									</div>
									<div class="text-xs font-medium text-gray-700 dark:text-gray-400">
										XP للمستوى التالي
									</div>
								</div>
								<div
									class="rounded-xl border border-gray-300/50 bg-gray-100 p-4 text-center dark:border-gray-700/50 dark:bg-gray-800/60"
								>
									<div class="mb-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
										{userStats.totalXp.toLocaleString()}
									</div>
									<div class="text-xs font-medium text-gray-700 dark:text-gray-400">
										إجمالي الخبرة
									</div>
								</div>
							</div>

							<!-- Next rank preview -->
							{#if currentLevel < 100}
								{@const nextRank = RANKS.find((r) => r.minLevel > currentLevel!)}
								{#if nextRank}
									<div class="mt-4 border-t border-gray-700/50 pt-4">
										<div class="flex items-center gap-2 text-sm">
											<span>الرتبة التالية:</span>
											<span class="font-semibold">{nextRank.title}</span>
											<span class="text-lg">{nextRank.icon}</span>
										</div>
									</div>
								{/if}
							{/if}
						</div>
					{/if}
				</div>

				<!-- User menu with subtle enhancement -->
				<div class="transition-transform duration-200 hover:scale-105">
					<NavbarUserMenu {user} />
				</div>
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

	<!-- Enhanced mobile menu -->
	{#if isOpen}
		<div
			transition:slide={{ duration: 300, easing: quintOut }}
			class="border-t border-gray-200 bg-white/95 backdrop-blur-sm sm:hidden dark:border-gray-800 dark:bg-gray-900/95"
			id="mobile-menu"
		>
			<div class="px-4 py-4">
				<!-- Navigation links -->
				<nav class="space-y-2" aria-label="Mobile navigation">
					{#each links as link}
						{@const isActive = activePath === link.href}
						<Button
							href={link.href}
							aria-current={isActive ? 'page' : undefined}
							variant={isActive ? 'link-pill-active' : 'link-pill'}
							size="sm"
							class="flex w-full items-center justify-start transition-all duration-200 hover:scale-[1.02] active:scale-98"
							onclick={() => (isOpen = false)}
						>
							<Icon name={link.icon} size={18} class="mr-3 flex-shrink-0" />
							<span class="whitespace-nowrap">{link.name}</span>
						</Button>
					{/each}
				</nav>

				{#if user && userStats && rankInfo && currentLevel !== undefined && progressPercent !== undefined && xp}
					<!-- Mobile profile section -->
					<div class="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700" dir="rtl">
						<h3 class="mb-4 px-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
							ملفي الشخصي
						</h3>

						<NavbarUserMenu {user} variant="mobile" />

						<!-- Mobile level display -->
						<div class="mt-4 rounded-2xl bg-gradient-to-br {rankInfo.color} p-0.5">
							<div class="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
								<div class="mb-3 flex items-center justify-between">
									<div class="flex items-center gap-2">
										<span class="text-2xl">{rankInfo.icon}</span>
										<div>
											<div class="text-sm font-bold text-white">
												{rankInfo.title}
											</div>
											<div class="text-xs text-white/80">
												المستوى {currentLevel}
											</div>
										</div>
									</div>
									<div class="text-right">
										<div class="text-sm font-bold text-white">
											{userStats.totalXp.toLocaleString()}
										</div>
										<div class="text-xs text-white/80">XP</div>
									</div>
								</div>

								<!-- Mobile progress bar -->
								<div class="space-y-2">
									<div class="flex justify-between text-xs text-white/80">
										<span>التقدم: {Math.floor(progressPercent)}%</span>
										<span>{xp.xpLeftForNextLevel} للمستوى التالي</span>
									</div>
									<div class="h-2 overflow-hidden rounded-full bg-white/20">
										<div
											class="h-full rounded-full bg-white/90 transition-all duration-1000"
											style="width: {progressPercent}%"
										></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<!-- Mobile Auth Buttons -->
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

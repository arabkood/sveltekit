<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
	import { fade } from 'svelte/transition';
	import { i18n } from '$i18n/i18n';
	import Avatar from '$ui/common/Avatar.svelte';
	import Button from '$ui/common/Button.svelte';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import IconPng from '$ui/common/IconPng.svelte';
	import type { UserPrivate } from '$lib/server/db/repos/user';

	let {
		variant = 'desktop',
		user
	}: {
		variant?: 'desktop' | 'mobile';
		user: UserPrivate;
	} = $props();

	let showMenu = $state(false);
	let menuRef = $state<HTMLDivElement | null>(null);
	let dropdownMenuRef = $state<HTMLDivElement | null>(null);
	let dynamicMenuClasses = $state('top-full mt-1.5 right-0 origin-top-right');

	function handleClickOutside(event: MouseEvent) {
		if (menuRef && !menuRef.contains(event.target as Node)) {
			showMenu = false;
		}
	}

	const signOut = async () => goto('/signout');
	const upgrade = async () => {
		goto('/pricing');
		showMenu = false;
	};

	$effect(() => {
		if (showMenu && variant === 'desktop') {
			const adjustPosition = async () => {
				await tick();
				if (!dropdownMenuRef || !menuRef) return;

				const menuElRect = dropdownMenuRef.getBoundingClientRect();
				const parentElRect = menuRef.getBoundingClientRect();
				const viewportH = window.innerHeight;
				const viewportW = window.innerWidth;

				let vPos = 'top-full mt-1.5';
				let vOrigin = 'origin-top';
				let hPos = 'right-0';
				let hOriginSuffix = '-right';

				if (
					menuElRect.height > viewportH - parentElRect.bottom &&
					menuElRect.height <= parentElRect.top
				) {
					vPos = 'bottom-full mb-1.5';
					vOrigin = 'origin-bottom';
				}

				const fitsRightAligned =
					parentElRect.right - menuElRect.width >= 0 && parentElRect.right <= viewportW;
				const fitsLeftAligned =
					parentElRect.left >= 0 && parentElRect.left + menuElRect.width <= viewportW;

				if (!fitsRightAligned && fitsLeftAligned) {
					hPos = 'left-0';
					hOriginSuffix = '-left';
				}

				dynamicMenuClasses = `${vPos} ${hPos} ${vOrigin}${hOriginSuffix}`;
			};

			adjustPosition();
			document.addEventListener('click', handleClickOutside);
			window.addEventListener('resize', adjustPosition);
			return () => {
				document.removeEventListener('click', handleClickOutside);
				window.removeEventListener('resize', adjustPosition);
			};
		} else if (showMenu && variant === 'mobile') {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		} else {
			dynamicMenuClasses = 'top-full mt-1.5 right-0 origin-top-right';
		}
	});
</script>

{#if variant === 'mobile'}
	<ul class="list-none">
		<!-- Profile -->
		<li>
			<Button
				href="/user/{user.username}"
				variant="link-pill"
				size="sm"
				class="w-full justify-start py-5"
				rounded={false}
				startIcon="user"
				iconSize={20}
			>
				{user.username}
			</Button>
		</li>

		{#if !user.premiumActive}
			<li>
				<Button
					variant="link-pill"
					size="sm"
					class="w-full justify-start py-5"
					rounded={false}
					onclick={() => upgrade()}
					startIcon="star"
					iconSize={20}
				>
					{i18n.t('common.upgrade')}
				</Button>
			</li>
		{/if}

		<li>
			<Button
				href="/settings"
				variant="link-pill"
				size="sm"
				class="w-full justify-start py-5"
				rounded={false}
				startIcon="cog"
				iconSize={20}
			>
				{i18n.t('navigation.settings')}
			</Button>
		</li>

		<li>
			<Button
				variant="link-pill"
				size="sm"
				class="w-full justify-start py-5"
				rounded={false}
				onclick={() => signOut()}
				startIcon="exit"
				iconSize={20}
			>
				{i18n.t('navigation.signout')}
			</Button>
		</li>
	</ul>
{:else}
	<div class="relative" bind:this={menuRef}>
		<!-- Trigger: avatar only -->
		<button
			onclick={(e: MouseEvent) => {
				e.stopPropagation();
				showMenu = !showMenu;
			}}
			aria-expanded={showMenu}
			aria-haspopup="true"
			aria-controls="user-menu"
			class="relative flex cursor-pointer items-center transition-opacity hover:opacity-80"
		>
			<Avatar
				src={user?.avatar || undefined}
				alt={user.username}
				fallback={user.username}
				size="md"
			/>
			{#if user.premiumActive}
				<span class="absolute -bottom-3 -left-3">
					<IconPng name="premium" size={32} alt="Premium" />
				</span>
			{/if}
		</button>

		<!-- Dropdown -->
		{#if showMenu}
			<div
				bind:this={dropdownMenuRef}
				id="user-menu"
				class="
					absolute z-50 w-48 overflow-hidden
					rounded-xl border
					border-gray-200/70 bg-white
					shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)]
					dark:border-gray-700/50 dark:bg-gray-900
					dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.25)]
					{dynamicMenuClasses}
				"
				transition:fade={{ duration: 100 }}
			>
				<ul class="p-1">
					<!-- Profile -->
					<li>
						<a
							href="/user/{user.username}"
							onclick={() => (showMenu = false)}
							class="group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors duration-100 hover:bg-gray-100 dark:hover:bg-gray-800"
						>
							<Avatar
								src={user?.avatar || undefined}
								alt={user.username}
								fallback={user.username}
								size="xs"
							/>
							<div class="flex min-w-0 flex-col">
								<span
									class="truncate text-sm font-semibold text-gray-800 group-hover:text-gray-900 dark:text-gray-100 dark:group-hover:text-white"
								>
									{user.username}
								</span>
								<span class="text-xs text-gray-400 dark:text-gray-500">
									{i18n.t('navigation.viewProfile')}
								</span>
							</div>
						</a>
					</li>

					<li class="my-1 h-px bg-gray-100 dark:bg-gray-800" role="separator"></li>

					{#if !user.premiumActive}
						<li>
							<button
								onclick={() => upgrade()}
								class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-amber-600 transition-colors duration-100 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
							>
								<Icon name="star" size={15} class="shrink-0" />
								{i18n.t('common.upgrade')}
							</button>
						</li>
						<li class="my-1 h-px bg-gray-100 dark:bg-gray-800" role="separator"></li>
					{/if}

					<li>
						<a
							href="/settings"
							onclick={() => (showMenu = false)}
							class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition-colors duration-100 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
						>
							<Icon name="cog" size={15} class="shrink-0 text-gray-400 dark:text-gray-500" />
							{i18n.t('navigation.settings')}
						</a>
					</li>

					<li class="my-1 h-px bg-gray-100 dark:bg-gray-800" role="separator"></li>

					<li>
						<button
							onclick={() => signOut()}
							class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 transition-colors duration-100 hover:bg-gray-100 hover:text-rose-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-rose-400"
						>
							<Icon name="exit" size={15} class="shrink-0 text-gray-400 dark:text-gray-500" />
							{i18n.t('navigation.signout')}
						</button>
					</li>
				</ul>
			</div>
		{/if}
	</div>
{/if}

<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
	import { slide } from 'svelte/transition';
	import { i18n } from '$i18n/i18n';
	import Avatar from '$ui/common/Avatar.svelte';
	import Button from '$ui/common/Button.svelte';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import IconPng from '$ui/common/IconPng.svelte';
	import type { User } from '$lib/server/db/repos/user';

	let {
		variant = 'desktop',
		user
	}: {
		variant?: 'desktop' | 'mobile';
		user: User;
	} = $props();

	let showMenu = $state(false);
	let menuRef = $state<HTMLDivElement | null>(null);
	let dropdownMenuRef = $state<HTMLDivElement | null>(null);
	let dynamicMenuClasses = $state('top-full mt-2 right-0 origin-top-right');

	function handleClickOutside(event: MouseEvent) {
		if (menuRef && !menuRef.contains(event.target as Node)) {
			showMenu = false;
		}
	}

	const signOut = async () => {
		goto('/signout');
	};

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

				let vPos = 'top-full mt-2';
				let vOrigin = 'origin-top';
				let hPos = 'right-0';
				let hOriginSuffix = '-right';

				const spaceBelowParent = viewportH - parentElRect.bottom;
				const spaceAboveParent = parentElRect.top;

				if (menuElRect.height > spaceBelowParent && menuElRect.height <= spaceAboveParent) {
					vPos = 'bottom-full mb-2';
					vOrigin = 'origin-bottom';
				}

				const menuLeftIfRightAligned = parentElRect.right - menuElRect.width;
				const menuRightIfLeftAligned = parentElRect.left + menuElRect.width;

				const fitsRightAligned = menuLeftIfRightAligned >= 0 && parentElRect.right <= viewportW;
				const fitsLeftAligned = parentElRect.left >= 0 && menuRightIfLeftAligned <= viewportW;

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
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		} else {
			dynamicMenuClasses = 'top-full mt-2 right-0 origin-top-right';
		}
	});
</script>

{#if variant === 'mobile'}
	<ul class="list-none">
		{#if !user.premiumActive}
			<li>
				<Button
					variant={'link-pill'}
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
				href={'/settings'}
				variant={'link-pill'}
				size="sm"
				class="w-full justify-start py-5"
				rounded={false}
				onclick={() => (showMenu = false)}
				startIcon={'cog'}
				iconSize={20}
			>
				{i18n.t('navigation.settings')}
			</Button>
		</li>
		<li>
			<Button
				variant={'link-pill'}
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
		<Button
			variant="link-pill"
			onclick={(e: MouseEvent) => {
				e.stopPropagation();
				showMenu = !showMenu;
			}}
			aria-expanded={showMenu}
			aria-haspopup="true"
			aria-controls="user-menu"
			size="md"
		>
			<Avatar
				src={user?.avatar || undefined}
				alt={user.username}
				fallback={user.username}
				showStatusIndicator={true}
				status="online"
				size="sm"
				className="me-1"
			/>
			{user.username}
			{#if user.premiumActive}
				<IconPng name="premium" size={20} alt="Premium" class="ms-1 mb-1 inline" />
			{/if}
		</Button>

		{#if showMenu}
			<div
				bind:this={dropdownMenuRef}
				id="user-menu"
				class="absolute z-50 w-56 rounded-lg bg-white py-1.5 shadow-xl ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10 {dynamicMenuClasses}"
				transition:slide={{ duration: 200 }}
			>
				<ul class="divide-y divide-gray-100 dark:divide-gray-700">
					{#if !user.premiumActive}
						<li>
							<button
								class="group flex w-full cursor-pointer items-center gap-3 px-3.5 py-2.5 text-sm text-yellow-600 transition-colors duration-150 ease-in-out hover:bg-yellow-50 hover:text-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-300"
								onclick={() => upgrade()}
							>
								<Icon
									name="star"
									size={20}
									class="text-yellow-500 transition-colors duration-150 ease-in-out group-hover:text-yellow-600 dark:text-yellow-400 dark:group-hover:text-yellow-300"
								/>
								{i18n.t('common.upgrade')}
							</button>
						</li>
					{/if}
					<li>
						<a
							href="/settings"
							class="group flex cursor-pointer items-center gap-3 px-3.5 py-2.5 text-sm text-gray-700 transition-colors duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
							onclick={() => (showMenu = false)}
						>
							<Icon
								name="cog"
								size={20}
								class="text-gray-400 transition-colors duration-150 ease-in-out group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
							/>
							{i18n.t('navigation.settings')}
						</a>
					</li>
					<li>
						<button
							class="group flex w-full cursor-pointer items-center gap-3 px-3.5 py-2.5 text-sm text-gray-700 transition-colors duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
							onclick={() => signOut()}
						>
							<Icon
								name="exit"
								size={20}
								class="text-gray-400 transition-colors duration-150 ease-in-out group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
							/>
							{i18n.t('navigation.signout')}
						</button>
					</li>
				</ul>
			</div>
		{/if}
	</div>
{/if}

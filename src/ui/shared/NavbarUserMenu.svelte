<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
	import { slide } from 'svelte/transition';
	import { i18n } from '$i18n/i18n';
	import Avatar from '$ui/common/Avatar.svelte';
	import type { User } from '$types/user';
	import { API_ENDPOINTS } from '$api/config';

	let { variant = 'desktop', user } = $props<{
		variant?: 'desktop' | 'mobile';
		user: User;
	}>();

	let showMenu = $state(false);
	let menuRef = $state<HTMLDivElement | null>(null);

	function handleClickOutside(event: MouseEvent) {
		if (menuRef && !menuRef.contains(event.target as Node)) {
			showMenu = false;
		}
	}

	const signOut = async () => {
		await fetch(API_ENDPOINTS.auth.signout, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}).then(() => {
			location.reload();
		});
	};

	$effect(() => {
		if (showMenu) {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});
</script>

{#if variant === 'mobile'}
	<li>
		<a
			href="/settings"
			class="bg-clickable flex gap-2 px-4 py-2 text-right text-sm"
			onclick={() => (showMenu = false)}
		>
			<Icon name="cog" size={20} />

			{i18n.t('navigation.settings')}
		</a>
	</li>
	<li>
		<button
			class="bg-clickable flex w-full gap-2 px-4 py-2 text-right text-sm"
			onclick={() => signOut()}
		>
			<Icon name="exit" size={20} />
			{i18n.t('navigation.signout')}
		</button>
	</li>
{:else}
	<div class="relative" bind:this={menuRef}>
		<!-- Toggle Button -->
		<button
			onclick={(e) => {
				e.stopPropagation();
				if (showMenu) {
					showMenu = false;
				} else {
					showMenu = true;
				}
			}}
		>
			<Avatar
				src={user?.Avatar || undefined}
				alt={user?.Username}
				fallback={user?.Username}
				size="sm"
			/>
		</button>

		<!-- Dropdown Menu -->
		{#if showMenu}
			<div
				class="bg-modal ring-opacity-5 absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black"
				transition:slide={{ duration: 200 }}
			>
				<ul class="divide-y divide-gray-200 dark:divide-gray-600">
					<li>
						<a
							href="/settings"
							class="flex gap-2 px-4 py-2 text-right text-sm"
							onclick={() => (showMenu = false)}
						>
							<Icon name="cog" size={20} />
							{i18n.t('navigation.settings')}
						</a>
					</li>
					<li>
						<button
							class="flex w-full gap-2 px-4 py-2 text-right text-sm"
							onclick={() => signOut()}
						>
							<Icon name="exit" size={20} />
							{i18n.t('navigation.signout')}
						</button>
					</li>
				</ul>
			</div>
		{/if}
	</div>
{/if}

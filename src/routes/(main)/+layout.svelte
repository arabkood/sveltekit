<script lang="ts">
	import Navbar from '$ui/shared/Navbar.svelte';
	import { onMount, type Snippet } from 'svelte';
	import { page } from '$app/state';
	import type { LayoutData } from './$types';
	import { browser } from '$app/environment';

	let {
		data,
		children
	}: {
		data: LayoutData;
		children: Snippet;
	} = $props();

	onMount(() => {
		setTimeout(() => {
			if (data.user && browser) {
				window.posthog?.identify(data.user.id, {
					email: data.user.email,
					username: data.user.username,
					premium: data.user.premiumActive,
					dbid: data.user.id
				});
			}
		}, 500);
	});

	const hideNavbarFor = new Set([
		// '/(main)/courses/[track_slug]/[item_slug]/lesson',
		'/(main)/courses/[track_slug]/[item_slug]/code'
	]);
	const disableNavbar = $derived(
		!page.route.id || page.route.id.startsWith('/(auth)') || hideNavbarFor.has(page.route.id)
	);
</script>

{#if !disableNavbar}
	<Navbar user={data.user} userStats={data.userStats || undefined} />
	<div
		class="h-[64px] w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
	></div>
{/if}
{@render children()}

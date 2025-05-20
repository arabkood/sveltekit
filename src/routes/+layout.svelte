<script lang="ts">
	import '../app.css';
	import Navbar from '$ui/shared/Navbar.svelte';
	import SvgSprite from '$ui/shared/SvgSprite.svelte';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import type { LayoutData } from './$types';

	let {
		data,
		children
	}: {
		data: LayoutData;
		children: Snippet;
	} = $props();

	const hideNavbarFor = new Set([
		'/track/[track]/[module]',
		'/courses/[track_slug]/[item_slug]/lesson',
		'/courses/[track_slug]/[item_slug]/code'
	]);
	const disableNavbar = $derived(
		!page.route.id || page.route.id.startsWith('/(auth)') || hideNavbarFor.has(page.route.id)
	);
</script>

{#if !disableNavbar}
	<Navbar user={data.user!} />
{/if}
{@render children()}

<SvgSprite />

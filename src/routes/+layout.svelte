<script lang="ts">
	import type { Snippet } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	import '../styles/app.css';
	import SvgSprite from '$ui/shared/SvgSprite.svelte';
	import { APP_ENV } from '$config';

	afterNavigate(() => {
		if (APP_ENV === 'production') {
			window.posthog?.capture('$pageview');
		}
	});

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

{@render children()}

<SvgSprite />

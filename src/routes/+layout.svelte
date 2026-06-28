<script lang="ts">
	import posthog from 'posthog-js';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	import '../styles/app.css';
	import SvgSprite from '$ui/shared/SvgSprite.svelte';
	import { APP_ENV } from '$config';

	onMount(() => {
		if (APP_ENV === 'production') {
			window.posthog = posthog.init('phc_XzgJDy16KOk6p0vYtoRxOtetjOfhoIjgbzT50chF7RR', {
				defaults: '2025-05-24',
				api_host: 'https://tatabo3.akood.com',
				ui_host: 'https://eu.posthog.com',
				person_profiles: 'identified_only'
			});
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

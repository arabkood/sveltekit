<script lang="ts">
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	import '../app.css';
	import SvgSprite from '$ui/shared/SvgSprite.svelte';
	import { APP_ENV } from '$config';

	export const load = async () => {
		if (browser && APP_ENV === 'production') {
			// @ts-expect-error no typing
			window.posthog = posthog.init('phc_XzgJDy16KOk6p0vYtoRxOtetjOfhoIjgbzT50chF7RR', {
				defaults: '2025-05-24',
				api_host: 'https://tatabo3.akood.com',
				ui_host: 'https://eu.posthog.com',
				person_profiles: 'identified_only'
			});
		}

		return;
	};

	onMount(load);

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

{@render children()}

<SvgSprite />

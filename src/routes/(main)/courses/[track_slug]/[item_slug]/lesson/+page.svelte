<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import Page from './Page.svelte';
	import finish_wav from '$assets/success.wav';
	import success_wav from '$assets/correct.wav';
	import fail_wav from '$assets/fail.wav';
	import { Sound } from '$utils/sound';
	import { browser } from '$app/environment';

	let { data }: { data: PageData } = $props();

	const successPlayer = browser
		? new Sound([success_wav], {
				fadeInDuration: 0,
				volume: 0.5,
				preload: true
			})
		: undefined;
	const finishPlayer = browser
		? new Sound([finish_wav], {
				fadeInDuration: 0,
				volume: 0.5,
				preload: true
			})
		: undefined;
	const failPlayer = browser
		? new Sound([fail_wav], {
				fadeInDuration: 0,
				volume: 0.6,
				preload: true
			})
		: undefined;
</script>

{#key page.params.item_slug}
	<Page {data} {successPlayer} {failPlayer} {finishPlayer} />
{/key}

<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import Page from './Page.svelte';
	import finish_mp3 from '$assets/success.mp3';
	import success_mp3 from '$assets/correct.mp3';
	import fail_mp3 from '$assets/fail.mp3';
	import { Sound } from '$utils/sound';
	import { browser } from '$app/environment';

	let { data }: { data: PageData } = $props();

	const successPlayer = browser
		? new Sound([success_mp3], {
				fadeInDuration: 0,
				volume: 0.5,
				preload: true
			})
		: undefined;
	const finishPlayer = browser
		? new Sound([finish_mp3], {
				fadeInDuration: 0,
				volume: 0.5,
				preload: true
			})
		: undefined;
	const failPlayer = browser
		? new Sound([fail_mp3], {
				fadeInDuration: 0,
				volume: 0.6,
				preload: true
			})
		: undefined;
</script>

{#key page.params.item_slug}
	<Page {data} {successPlayer} {failPlayer} {finishPlayer} />
{/key}

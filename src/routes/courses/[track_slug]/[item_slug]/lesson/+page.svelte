<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import Page from './Page.svelte';
	import success_mp3 from '$assets/success.mp3';
	import fail_mp3 from '$assets/fail.mp3';
	import { Sound } from '$utils/sound';

	let { data }: { data: PageData } = $props();

	const successPlayer = new Sound([success_mp3], {
		fadeInDuration: 0,
		volume: 0.5,
		preload: true
	});
	const failPlayer = new Sound([fail_mp3], {
		fadeInDuration: 0,
		volume: 0.6,
		preload: true
	});
</script>

{#key page.params.item_slug}
	<Page {data} {successPlayer} {failPlayer} />
{/key}

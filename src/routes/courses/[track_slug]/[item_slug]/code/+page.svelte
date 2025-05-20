<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import Page from './Page.svelte';

	let { data }: { data: PageData } = $props();
</script>

{#key page.params.item_slug}
	<Page {data} />
{/key}

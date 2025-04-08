<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import Page from './Page.svelte';

	let props: PageProps = $props();
</script>

{#key page.params.module}
	<Page {...props} />
{/key}

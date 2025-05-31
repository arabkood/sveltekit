<script lang="ts">
	import GlossaryWrapper from '$ui/wrappers/GlossaryWrapper.svelte';
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<GlossaryWrapper>
	{@render children()}
</GlossaryWrapper>

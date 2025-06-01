<script lang="ts">
	import CodeBlockWrapper from '$ui/wrappers/CodeBlockWrapper.svelte';
	import GlossaryWrapper from '$ui/wrappers/GlossaryWrapper.svelte';
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<CodeBlockWrapper>
	<GlossaryWrapper>
		{@render children()}
	</GlossaryWrapper>
</CodeBlockWrapper>

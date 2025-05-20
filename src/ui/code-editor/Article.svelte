<script lang="ts">
	import Markdown from '$ui/common/Markdown.svelte';
	import type { Snippet } from 'svelte';

	let {
		markdown = '',
		title,
		Tags
	}: {
		markdown?: string;
		title?: string;
		Tags?: Snippet;
	} = $props();
</script>

<article>
	<div class="flex items-center justify-between">
		{#if !!title}
			<h1 class="m-0 text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
		{/if}
		{#if !!Tags}
			{@render Tags()}
		{/if}
	</div>
	<Markdown evalPublicAssets={true} {markdown} />
</article>

<script lang="ts">
	import { marked } from '$lib/markdown';
	import { replacePublicUrls } from '$utils/s3-public-assets';
	import DOMPurify from 'isomorphic-dompurify';

	let {
		markdown: markdownp = '',
		evalPublicAssets = false,
		inline = false
	}: {
		markdown?: string;
		evalPublicAssets?: boolean;
		inline?: boolean;
	} = $props();

	let markdown = $derived(evalPublicAssets ? replacePublicUrls(markdownp) : markdownp);
	let html = $derived(
		DOMPurify.sanitize(
			marked.parse(markdown, {
				async: false
			})
		)
	);
	let classes = $state('markdown-body');
	if (inline) {
		classes += ' markdown-inline';
	}
</script>

<div class={classes} dir="auto">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html html}
</div>

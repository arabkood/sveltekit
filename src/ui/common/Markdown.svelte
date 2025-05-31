<script lang="ts">
	import { marked } from '$lib/markdown';
	import { replacePublicUrls } from '$utils/s3-public-assets';
	import DOMPurify from 'dompurify';

	let {
		markdown: markdownp = '',
		evalPublicAssets = false
	}: {
		markdown?: string;
		evalPublicAssets?: boolean;
	} = $props();

	let markdown = $derived(evalPublicAssets ? replacePublicUrls(markdownp) : markdownp);
	let html = $derived(
		DOMPurify.sanitize(
			marked.parse(markdown, {
				async: false
			})
		)
	);
</script>

<div class="markdown-body" dir="auto">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html html}
</div>

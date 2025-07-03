<script lang="ts">
	// eslint-disable svelte/no-at-html-tags

	import { FancyAnsi } from 'fancy-ansi';

	const fancyAnsi = new FancyAnsi();

	let { text = 'hello world' }: { text?: string } = $props();

	const colored = fancyAnsi.toHtml(text);
</script>

<pre dir="ltr" class="max-h-80 overflow-auto p-4 font-mono text-sm"><code
		class="block whitespace-pre">{@html colored}</code
	></pre>

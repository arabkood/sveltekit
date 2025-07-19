<script lang="ts">
	import { FancyAnsi } from 'fancy-ansi';

	interface Props {
		text?: string;
		className?: string;
		enableWrap?: boolean;
	}

	let { text = '', className = '', enableWrap = true }: Props = $props();

	// Initialize FancyAnsi instance once
	const fancyAnsi = new FancyAnsi();

	const colored = $derived.by(() => {
		return text ? fancyAnsi.toHtml(text) : '';
	});
</script>

<pre
	dir="ltr"
	class="max-h-80 overflow-auto p-4 font-mono text-sm {className}"
	class:whitespace-pre-wrap={enableWrap}
	class:whitespace-pre={!enableWrap}><!--
	--><code class="block"
		><!--
		-->{#if colored}<!--
			-->{@html colored}<!--
		-->{:else if text}<!--
			-->{text}<!--
		-->{/if}<!--
	--></code
	><!--
--></pre>

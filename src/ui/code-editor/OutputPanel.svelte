<script lang="ts">
	import { FancyAnsi } from 'fancy-ansi';

	interface Props {
		output?: string;
		enableWrap?: boolean;
	}

	let { output = '', enableWrap = true }: Props = $props();

	let showCopiedMessage = $state(false);

	const fancyAnsi = new FancyAnsi();

	const coloredOutput = $derived.by(() => {
		return output ? fancyAnsi.toHtml(output) : '';
	});

	console.log('bbb', output, typeof output, output.length);
</script>

<div class="h-full w-full bg-gray-50 p-4 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
	<header class="mb-3 flex items-center justify-between">
		<h3 class="text-lg font-semibold">الناتج (Console)</h3>
	</header>

	<div
		class="h-full w-full rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
		style="max-height: calc(100% - 52px);"
	>
		{#if typeof output === 'string' && output.length > 0}
			<pre
				dir="ltr"
				class="h-full overflow-auto p-4 font-mono text-sm"
				class:whitespace-pre-wrap={enableWrap}
				class:whitespace-pre={!enableWrap}><code class="block">{@html coloredOutput}</code></pre>
		{:else}
			<div
				class="flex h-full items-center justify-center p-4 text-center text-gray-500 dark:text-gray-400"
			>
				<p>سيظهر ناتج تنفيذ الكود هنا.</p>
			</div>
		{/if}
	</div>
</div>

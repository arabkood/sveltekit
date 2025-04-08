<script lang="ts">
	import Article from './Article.svelte';

	let { markdown } = $props<{ markdown?: string }>();

	const title = 'البحث في المصفوفة';
</script>

{#snippet Tags()}
	<span
		class="rounded-full bg-green-100 px-2.5 py-1 text-sm font-medium text-green-800 dark:bg-green-900/50 dark:text-green-400"
		>سهل</span
	>
{/snippet}

<div class="p-6">
	<!-- <Article {Tags} {title} {markdown} /> -->
	<Article {markdown} />
</div>

<script lang="ts">
	import Article from './Article.svelte';
	interface MarkdownContent {
		title: string;
		content: string;
	}
	let { markdown } = $props<{ markdown?: MarkdownContent[] }>();
	let activeTab = $state(0);
</script>

<div class="p-4">
	{#if markdown?.length}
		{#if markdown.length > 1}
			<div class="mb-6 border-b border-gray-200 dark:border-gray-700">
				<nav class="-mb-px flex space-x-8">
					{#each markdown as item, index}
						<button
							class="cursor-pointer border-b-2 px-1 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 {activeTab ===
							index
								? 'border-primary-500 text-primary-600'
								: 'hover:border-primary-300 hover:text-primary-500 border-transparent'}"
							onclick={() => (activeTab = index)}
						>
							{item.title}
						</button>
					{/each}
				</nav>
			</div>
		{/if}
		<div class="min-h-[200px]">
			{#if markdown[activeTab]}
				<div class="animate-in fade-in slide-in-from-bottom-2 duration-200">
					<Article markdown={markdown[activeTab].content} />
				</div>
			{/if}
		</div>
	{:else}
		<div class="text-primary-400">No content available</div>
	{/if}
</div>

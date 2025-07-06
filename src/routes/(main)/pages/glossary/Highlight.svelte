<script lang="ts">
	type Props = {
		text: string;
		query: string;
		class?: string;
	};
	let { text, query, class: className = '' }: Props = $props();

	let parts = $derived.by(() => {
		if (!query || !text) {
			return [{ text, match: false }];
		}
		const regex = new RegExp(`(${query})`, 'gi');
		return text
			.split(regex)
			.filter(Boolean)
			.map((part) => ({
				text: part,
				match: part.toLowerCase() === query.toLowerCase()
			}));
	});
</script>

<span class={className}>
	{#each parts as part}
		{#if part.match}
			<mark
				class="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-sm px-1 py-0.5"
				>{part.text}</mark
			>
		{:else}
			{part.text}
		{/if}
	{/each}
</span>

<script lang="ts">
	import type { Item, Track } from '$lib/server/db/schema/class';
	import Icon from '$ui/common/Icon.svelte';
	import Logo from '$ui/common/Logo.svelte';
	import type { Snippet } from 'svelte';

	let {
		Actions,
		track,
		item,
		nextSlug,
		prevSlug
	}: {
		Actions?: Snippet;
		track: Track;
		item: Item;
		nextSlug?: string;
		prevSlug?: string;
	} = $props();
</script>

<div
	class="sticky top-0 z-10 grid grid-cols-3 border-b border-gray-300 bg-gray-200 px-2 py-1 dark:border-gray-800 dark:bg-gray-950"
>
	<div class="flex items-center space-x-2">
		<a
			href="/"
			class="me-3 flex cursor-pointer items-center justify-center text-gray-950 dark:text-gray-50"
		>
			<Logo variant="iconOnly" size={26} />
		</a>

		<nav class="flex items-center gap-1 text-base">
			<a
				class="cursor-pointer rounded-md px-2 py-1 text-gray-950/50 transition-colors hover:bg-gray-500/10 dark:text-gray-50/50"
				href={`/courses/${track?.slug}`}>{track.title}</a
			>
			<Icon class="text-gray-950/50 dark:text-gray-50/50" name="chevron-left" size={22} />
			<span class="px-2 py-1 text-gray-950 dark:text-gray-50">{item.title}</span>
		</nav>
	</div>

	<div class="flex items-center justify-center space-x-1">
		{#if !!Actions}
			{@render Actions()}
		{/if}
	</div>

	<div class="flex items-center justify-end space-x-3">
		<div class="flex items-center justify-center gap-2">
			<a
				href={`/courses/${track?.slug}/${prevSlug}`}
				class="cursor-pointer rounded-md p-1 text-gray-950 transition-colors hover:bg-gray-500/10 dark:text-gray-50"
				class:pointer-events-none={!prevSlug}
				class:opacity-40={!prevSlug}
			>
				<Icon name="chevron-right" size={26} />
			</a>
			<!-- TODO: this should be a button that opens a modal for choose exercise -->
			<span class="text-lg font-medium text-gray-950 dark:text-gray-50">24</span>
			<a
				class:pointer-events-none={!nextSlug}
				class:opacity-40={!nextSlug}
				href={`/courses/${track?.slug}/${nextSlug}`}
				class="cursor-pointer rounded-md p-1 text-gray-950 transition-colors hover:bg-gray-500/10 dark:text-gray-50"
			>
				<Icon name="chevron-left" size={26} />
			</a>
		</div>
	</div>
</div>

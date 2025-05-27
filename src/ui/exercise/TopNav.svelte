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
	class="bg-page sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-700"
>
	<div class="flex min-w-0 flex-1 items-center">
		<a
			href="/"
			class="mr-3 flex shrink-0 items-center justify-center rounded-md p-1 text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
			aria-label="Home"
		>
			<Logo variant="iconOnly" size={26} />
		</a>

		<nav class="flex min-w-0 items-center gap-1 text-sm">
			<a
				class="truncate rounded px-2 py-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
				href={`/courses/${track?.slug}`}
				title={track.title}>{track.title}</a
			>
			<Icon class="shrink-0 text-gray-400 dark:text-gray-500" name="chevron-left" size={18} />
			<span
				class="truncate px-2 py-1 font-medium text-gray-800 dark:text-gray-100"
				title={item.title}>{item.title}</span
			>
		</nav>
	</div>

	<div class="flex items-center justify-center px-4">
		{#if !!Actions}
			{@render Actions()}
		{/if}
	</div>

	<div class="flex shrink-0 items-center justify-end gap-1.5">
		<a
			href={`/courses/${track?.slug}/${prevSlug}`}
			class="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
			class:pointer-events-none={!prevSlug}
			class:opacity-50={!prevSlug}
			aria-label="Previous item"
		>
			<Icon name="chevron-right" size={22} />
		</a>

		<button
			type="button"
			class="flex h-9 min-w-[2.25rem] shrink-0 cursor-pointer items-center justify-center rounded-md bg-transparent px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
			aria-label="Choose exercise"
		>
			24
		</button>

		<a
			href={`/courses/${track?.slug}/${nextSlug}`}
			class="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
			class:pointer-events-none={!nextSlug}
			class:opacity-50={!nextSlug}
			aria-label="Next item"
		>
			<Icon name="chevron-left" size={22} />
		</a>
	</div>
</div>

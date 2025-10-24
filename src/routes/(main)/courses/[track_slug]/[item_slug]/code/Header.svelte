<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
	import Logo from '$ui/common/Logo.svelte';

	// --- Props ---
	interface Props {
		trackSlug: string;
		trackTitle: string;
		itemTitle: string;
	}

	let { trackSlug, trackTitle, itemTitle }: Props = $props();
</script>

<header
	class="flex shrink-0 items-center justify-between border-b border-gray-200 px-2 py-2 sm:px-4 dark:border-gray-700"
>
	<div class="flex min-w-0 flex-1 items-center md:hidden">
		<a
			href={`/courses/${trackSlug}`}
			class="ms-2 flex shrink-0 items-center justify-center gap-3 rounded-md p-1 text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
			title={trackTitle}
		>
			<Icon name="arrow-right" size={22} class="-mb-1" />
			<span>رجوع الى المسار</span>
		</a>
	</div>
	<div class="hidden min-w-0 flex-1 items-center md:flex">
		<a
			href="/"
			class="mr-2 hidden shrink-0 items-center justify-center rounded-md p-1 text-gray-700 hover:bg-gray-200 md:flex dark:text-gray-200 dark:hover:bg-gray-800"
			aria-label="Home"
		>
			<Logo variant="iconOnly" size={26} />
		</a>
		<nav class="hidden min-w-0 items-center gap-1 text-sm md:flex">
			<a
				class="truncate rounded px-2 py-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
				href={`/courses/${trackSlug}`}
				title={trackTitle}>{trackTitle}</a
			>
			<Icon class="shrink-0 text-gray-400 dark:text-gray-500" name="chevron-left" size={18} />
			<span
				class="truncate px-2 py-1 font-medium text-gray-800 dark:text-gray-100"
				title={itemTitle}>{itemTitle}</span
			>
		</nav>
		<div class="flex min-w-0 items-center md:hidden">
			<a
				href={`/courses/${trackSlug}`}
				class="me-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
				aria-label="Back to track"
				title={trackTitle}
			>
				<Icon name="arrow-right" size={20} />
			</a>
			<span class="truncate text-sm font-medium text-gray-800 dark:text-gray-100" title={itemTitle}>
				{itemTitle}
			</span>
		</div>
	</div>
</header>

<script lang="ts">
	import { getContext } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import type { Writable } from 'svelte/store';

	type TransitionType = 'fade' | 'slide' | 'none';

	interface TabPanelProps {
		index: number;
		lazy?: boolean;
		transition?: TransitionType;
		class?: string;
		children: Snippet;
	}

	let {
		index,
		lazy = false,
		transition = 'fade',
		class: className = '',
		children
	}: TabPanelProps = $props();

	const { activeTab, orientation } = getContext<{
		activeTab: Writable<number>;
		orientation: 'horizontal' | 'vertical';
	}>('tabs');

	const isActive = $derived($activeTab === index);
	let hasBeenActive = $state(isActive);

	$effect(() => {
		if (isActive && !hasBeenActive) {
			hasBeenActive = true;
		}
	});

	const shouldRender = $derived(lazy ? hasBeenActive : true);

	const panelClasses = $derived(() => {
		const base = 'tab-panel';
		const orientationClass = orientation === 'vertical' ? 'flex-1 pl-4' : 'pt-0';
		const darkModeClass = 'text-gray-900 dark:text-gray-100';

		return `${base} ${orientationClass} ${darkModeClass} ${className}`;
	});

	const transitionConfig = {
		fade: { duration: 150 },
		slide: { duration: 200 }
	};
</script>

{#if shouldRender}
	<div role="tabpanel" class={panelClasses()} class:hidden={!isActive} aria-hidden={!isActive}>
		{#if isActive}
			{#if transition === 'fade'}
				<div transition:fade={transitionConfig.fade}>
					{@render children()}
				</div>
			{:else if transition === 'slide'}
				<div transition:slide={transitionConfig.slide}>
					{@render children()}
				</div>
			{:else}
				{@render children()}
			{/if}
		{/if}
	</div>
{/if}

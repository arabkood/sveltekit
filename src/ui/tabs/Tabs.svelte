<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { Snippet } from 'svelte';

	type Orientation = 'horizontal' | 'vertical';
	type Variant = 'default' | 'pills' | 'underline' | 'enclosed';
	type Size = 'sm' | 'md' | 'lg';

	interface TabsContext {
		activeTab: Writable<number>;
		orientation: Orientation;
		variant: Variant;
		size: Size;
		setActiveTab: (index: number) => void;
	}

	interface TabsProps {
		activeTab?: number;
		orientation?: Orientation;
		variant?: Variant;
		size?: Size;
		fullWidth?: boolean;
		class?: string;
		onChange?: (index: number) => void;
		children: Snippet;
	}

	let {
		activeTab = $bindable(0),
		orientation = 'horizontal',
		variant = 'default',
		size = 'md',
		fullWidth = false,
		class: className = '',
		onChange = () => {},
		children
	}: TabsProps = $props();

	const activeTabStore = writable(activeTab);

	$effect(() => {
		activeTabStore.set(activeTab);
	});

	setContext<TabsContext>('tabs', {
		activeTab: activeTabStore,
		orientation,
		variant,
		size,
		setActiveTab: (index: number) => {
			activeTab = index;
			onChange(index);
		}
	});

	const containerClasses = $derived(() => {
		const base = 'tabs-container';
		const orientationClass = orientation === 'vertical' ? 'flex' : '';
		const widthClass = fullWidth ? 'w-full' : '';

		return `${base} ${orientationClass} ${widthClass} ${className}`;
	});
</script>

<div class={containerClasses()}>
	{@render children()}
</div>

<style>
	.tabs-container {
		position: relative;
	}
</style>

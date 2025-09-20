<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';

	interface TabListProps {
		class?: string;
		children: Snippet;
	}

	let { class: className = '', children }: TabListProps = $props();

	const { orientation, variant } = getContext<{
		orientation: 'horizontal' | 'vertical';
		variant: 'default' | 'pills' | 'underline' | 'enclosed';
	}>('tabs');

	const listClasses = $derived(() => {
		const base = 'tab-list flex';

		const orientationClasses = {
			horizontal: 'flex-row border-b border-gray-200 dark:border-gray-700',
			vertical: 'flex-col border-r border-gray-200 dark:border-gray-700 pr-4'
		};

		const variantClasses = {
			default: '',
			pills: 'gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border-0',
			underline: 'border-0 border-b-2 border-gray-200 dark:border-gray-700',
			enclosed: 'border-b-0'
		};

		return `${base} ${orientationClasses[orientation]} ${variantClasses[variant]} ${className}`;
	});
</script>

<div role="tablist" class={listClasses()}>
	{@render children()}
</div>

<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { Writable } from 'svelte/store';

	interface TabProps {
		index: number;
		disabled?: boolean;
		icon?: Snippet;
		badge?: string | number;
		class?: string;
		children: Snippet;
	}

	let {
		index,
		disabled = false,
		icon,
		badge,
		class: className = '',
		children
	}: TabProps = $props();

	const { activeTab, setActiveTab, variant, size, orientation } = getContext<{
		activeTab: Writable<number>;
		setActiveTab: (index: number) => void;
		variant: 'default' | 'pills' | 'underline' | 'enclosed';
		size: 'sm' | 'md' | 'lg';
		orientation: 'horizontal' | 'vertical';
	}>('tabs');

	const isActive = $derived($activeTab === index);

	const handleClick = () => {
		if (!disabled) {
			setActiveTab(index);
		}
	};

	const tabClasses = $derived(() => {
		const base =
			'tab-trigger relative flex items-center justify-center font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900';

		const sizeClasses = {
			sm: 'px-3 py-1.5 text-sm',
			md: 'px-4 py-2 text-base',
			lg: 'px-6 py-3 text-lg'
		};

		const variantClasses = {
			default: `
        ${
					isActive
						? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-px'
						: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
				}
      `,
			pills: `
        rounded-md
        ${
					isActive
						? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm dark:shadow-gray-700/50'
						: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
				}
      `,
			underline: `
        ${
					isActive
						? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
						: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
				}
      `,
			enclosed: `
        border border-gray-200 dark:border-gray-700 -mb-px
        ${
					isActive
						? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-white dark:border-b-gray-900'
						: 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
				}
        ${
					orientation === 'horizontal'
						? 'first:rounded-tl-md last:rounded-tr-md'
						: 'first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md'
				}
      `
		};

		const disabledClass = disabled
			? 'opacity-50 cursor-not-allowed hover:text-gray-600 dark:hover:text-gray-400'
			: 'cursor-pointer';

		return `${base} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClass} ${className}`;
	});

	const badgeClasses =
		'ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full';
</script>

<button
	role="tab"
	type="button"
	class={tabClasses()}
	aria-selected={isActive}
	{disabled}
	onclick={handleClick}
	tabindex={isActive ? 0 : -1}
>
	{#if icon}
		<span class="mr-2">{@render icon()}</span>
	{/if}

	{@render children()}

	{#if badge}
		<span class={badgeClasses}>
			{badge}
		</span>
	{/if}
</button>

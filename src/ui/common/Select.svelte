<script lang="ts">
	import { cn } from '$utils/classnames';

	let {
		class: className = '',
		options = [],
		placeholder = 'Select an option',
		value = $bindable(''),
		disabled = false
	}: {
		class?: string;
		options: Array<{
			value: string;
			label: string;
		}>;
		placeholder?: string;
		value?: string;
		disabled?: boolean;
	} = $props();

	let isOpen = $state(false);
	let selectRef: HTMLDivElement;

	$effect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectRef && !selectRef.contains(event.target as Node)) {
				isOpen = false;
			}
		};

		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	const handleSelect = (option: string) => {
		value = option;
		isOpen = false;
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			isOpen = !isOpen;
		} else if (event.key === 'Escape') {
			isOpen = false;
		}
	};

	const containerClasses = $derived(cn('relative w-full', className));
	const triggerClasses = $derived(
		cn(
			'w-full px-3 py-2 text-sm text-left',
			'rounded-md border border-gray-300 dark:border-gray-600',
			'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
			'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600',
			'disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800',
			'flex items-center justify-between'
		)
	);
	const dropdownClasses = $derived(
		cn(
			'absolute z-50 w-full mt-1',
			'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg',
			'max-h-60 overflow-auto'
		)
	);
</script>

<div class={containerClasses} bind:this={selectRef}>
	<button
		type="button"
		class={triggerClasses}
		onclick={() => !disabled && (isOpen = !isOpen)}
		onkeydown={handleKeyDown}
		{disabled}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
	>
		<span class="truncate">
			{options.find((o) => o.value === value)?.label || placeholder}
		</span>
		<span class="ml-2">
			<svg
				class={cn(
					'h-4 w-4 transition-transform dark:text-gray-400',
					isOpen ? 'rotate-180 transform' : ''
				)}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</span>
	</button>
	{#if isOpen && !disabled}
		<div class={dropdownClasses} role="listbox">
			{#each options as option}
				<div
					class={cn(
						'cursor-pointer px-3 py-2 text-sm',
						'hover:bg-gray-100 dark:hover:bg-gray-600',
						option.value === value
							? 'bg-primary-50 text-primary-900 dark:bg-primary-900/50 dark:text-primary-100'
							: 'text-gray-900 dark:text-gray-100'
					)}
					role="option"
					aria-selected={option.value === value}
					onclick={() => handleSelect(option.value)}
					onkeydown={(e) => e.key === 'Enter' && handleSelect(option.value)}
					tabindex="0"
				>
					{option.label}
				</div>
			{/each}
		</div>
	{/if}
</div>

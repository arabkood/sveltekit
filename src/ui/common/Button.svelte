<script lang="ts">
	import { cn } from '$utils/classnames';
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import type { IconId } from '$ui/shared/SvgSprite.svelte';

	type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	type Size = 'default' | 'sm' | 'lg' | 'icon';

	let {
		class: className = '',
		variant = 'default',
		size = 'default',
		type = 'button',
		rounded = false,
		disabled = false,
		loading = false,
		children,
		startIcon,
		endIcon,
		iconSize,
		href,
		...props
	} = $props<{
		children: Snippet;
		class?: string;
		variant?: Variant;
		size?: Size;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		rounded?: boolean;
		loading?: boolean;
		startIcon?: IconId;
		endIcon?: IconId;
		iconSize?: number;
		href?: string;
		[key: string]: unknown;
	}>();

	const defaultIconSizes = {
		default: 16,
		sm: 14,
		lg: 20,
		icon: 20
	};
	const finalIconSize = $derived(
		iconSize ?? defaultIconSizes[size as keyof typeof defaultIconSizes]
	);

	const variantClasses = {
		default: 'bg-primary-500 text-black hover:bg-primary-700 focus:ring-primary-600',
		destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-600',
		outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
		secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
		ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
		link: 'text-primary-600 underline-offset-4 hover:underline'
	};

	const sizeClasses = {
		default: 'h-9 px-5 text-sm',
		sm: 'h-8 px-3 py-1.5 text-xs',
		lg: 'h-10 px-6 text-base',
		icon: 'h-10 w-10 p-2 flex items-center justify-center'
	};

	const classes = $derived(
		cn(
			'cursor-pointer inline-flex items-center justify-center font-medium transition-colors',
			'focus:outline-none focus:ring-2 focus:ring-offset-2',
			'disabled:opacity-50 disabled:pointer-events-none',
			loading && 'cursor-wait',
			variantClasses[variant as Variant],
			sizeClasses[size as Size],
			rounded ? 'rounded-full' : 'rounded-md',
			className
		)
	);

	const handleClick = (event: MouseEvent) => {
		if (disabled || loading) {
			event.preventDefault();
			event.stopPropagation();
		}
	};
</script>

{#if href}
	<a
		{href}
		class={classes}
		onclick={handleClick}
		aria-disabled={disabled || loading ? 'true' : undefined}
		{...props}
	>
		{@render inner()}
	</a>
{:else}
	<button
		{type}
		class={classes}
		disabled={disabled || loading}
		{...props}
		aria-disabled={disabled || loading}
	>
		{@render inner()}
	</button>
{/if}

{#snippet inner()}
	{#if loading}
		<svg
			class={cn(
				'animate-spin',
				children ? 'ltr:mr-2 rtl:ml-2' : 'm-0',
				startIcon ? 'absolute' : ''
			)}
			xmlns="http://www.w3.org/2000/svg"
			width={finalIconSize}
			height={finalIconSize}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</svg>
	{/if}

	{#if startIcon && !loading}
		<Icon
			name={startIcon}
			size={finalIconSize}
			class={cn('ltr:mr-2 rtl:ml-2', children ? '' : 'm-0')}
		/>
	{/if}

	{#if children}
		<span class={cn(loading && startIcon && 'invisible')}>
			{@render children?.()}
		</span>
	{/if}

	{#if endIcon && !loading}
		<Icon
			name={endIcon}
			size={finalIconSize}
			class={cn('ltr:ml-2 rtl:mr-2', children ? '' : 'm-0')}
		/>
	{/if}
{/snippet}

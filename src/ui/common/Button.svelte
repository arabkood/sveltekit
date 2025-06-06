<script lang="ts">
	import { cn } from '$utils/classnames';
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import type { IconId } from '$ui/shared/SvgSprite.svelte';

	type Variant =
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link'
		| 'link-pill'
		| 'link-pill-active'
		| 'continue';

	type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';

	let {
		class: className = '',
		variant = 'default',
		size = 'md',
		type = 'button',
		rounded = false,
		disabled = false,
		loading = false,
		fullWidth = false,
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
		fullWidth?: boolean;
		startIcon?: IconId;
		endIcon?: IconId;
		iconSize?: number;
		href?: string;
		[key: string]: unknown;
	}>();

	const defaultIconSizes = {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 20,
		xl: 24,
		icon: 24
	};
	const finalIconSize = $derived(
		iconSize ?? defaultIconSizes[size as keyof typeof defaultIconSizes]
	);

	const variantClasses = {
		default: `
    bg-primary-500 text-white shadow-lg shadow-primary-500/20 
    hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-600/20
    focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    disabled:bg-primary-300 disabled:text-white/70 disabled:shadow-none
    dark:bg-primary-500 dark:hover:bg-primary-600 dark:shadow-primary-600/30
  `,
		destructive: `
    bg-rose-500 text-white shadow-lg shadow-rose-500/20 
    hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-600/20
    focus:ring-2 focus:ring-rose-500 focus:ring-offset-2
    disabled:bg-rose-300 disabled:text-white/70 disabled:shadow-none
    dark:bg-rose-600 dark:hover:bg-rose-700 dark:shadow-rose-600/30
  `,
		outline: `
    border border-neutral-300 bg-white text-neutral-700 
    hover:bg-neutral-50 
    focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
    disabled:border-neutral-200 disabled:text-neutral-400 disabled:bg-neutral-100
    dark:border-neutral-700 dark:bg-gray-900 dark:text-neutral-300 dark:hover:bg-gray-800
  `,
		secondary: `
    bg-neutral-100 text-neutral-900 
    hover:bg-neutral-200 
    focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
    disabled:bg-neutral-200 disabled:text-neutral-400
    dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700
  `,
		ghost: `
    text-neutral-700 
    hover:bg-neutral-100 hover:text-neutral-900 
    focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
    disabled:text-neutral-400 disabled:hover:bg-transparent
    dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100
  `,
		link: `
    text-primary-600 underline-offset-4 
    hover:underline 
    focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
    disabled:text-primary-300 disabled:no-underline
    dark:text-primary-400
  `,
		'link-pill': `
    text-sm text-gray-700 
    hover:text-primary-700 hover:bg-primary-50
    focus:ring-primary-500 focus:ring-2 focus:ring-offset-1
    dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-primary-700/20
  `,
		'link-pill-active': `
    text-sm text-primary-700 bg-primary-100
    focus:ring-primary-500 focus:ring-2 focus:ring-offset-1
    dark:text-primary-400 dark:bg-primary-900/50
  `,
		continue: `
    bg-lime-500 text-white uppercase tracking-wider shadow-lg shadow-lime-500/30 
    hover:bg-lime-600 hover:shadow-xl hover:shadow-lime-600/30
    focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2
    disabled:bg-lime-300 disabled:text-white/70 disabled:shadow-none
    dark:bg-lime-600 dark:hover:bg-lime-500 dark:shadow-lime-900/50
    dark:focus:ring-lime-400
  `
	};

	const sizeClasses = {
		xs: 'h-6 px-3 text-xs',
		sm: 'h-8 px-4 text-sm',
		md: 'h-10 px-6 text-base',
		lg: 'h-12 px-8 text-lg',
		xl: 'h-14 px-10 text-xl',
		icon: 'h-10 w-10 p-2 flex items-center justify-center'
	};

	const classes = $derived(
		cn(
			'cursor-pointer inline-flex items-center justify-center font-bold duration-200 transition-all',
			'focus:outline-none',
			'disabled:pointer-events-none disabled:opacity-75',
			loading && 'cursor-wait',
			fullWidth && 'w-full',
			variantClasses[variant as Variant],
			sizeClasses[size as Size],
			rounded ? 'rounded-full' : 'rounded-lg',
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
			class={cn('animate-spin', startIcon ? 'absolute' : '')}
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
		<Icon name={startIcon} size={finalIconSize} class={'me-2'} />
	{/if}

	{#if children}
		<span class={cn(loading && startIcon && 'invisible')}>
			{@render children?.()}
		</span>
	{/if}

	{#if endIcon && !loading}
		<Icon name={endIcon} size={finalIconSize} class={'ms-2'} />
	{/if}
{/snippet}

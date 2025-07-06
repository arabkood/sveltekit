<script lang="ts">
	import { cn } from '$utils/classnames';
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import type { IconId } from '$ui/shared/SvgSprite.svelte';
	import Spinner from './Spinner.svelte';

	type Variant =
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link'
		| 'link-pill'
		| 'link-pill-active'
		| 'continue'
		| 'attention'
		| 'fire';

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
    disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed
    dark:bg-primary-500 dark:hover:bg-primary-600 dark:shadow-primary-600/30
    dark:disabled:bg-gray-700 dark:disabled:text-gray-400
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
    hover:bg-neutral-100/30 hover:text-neutral-900 
    focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:outline-none
    disabled:text-neutral-400 disabled:hover:bg-transparent disabled:cursor-not-allowed
    dark:text-neutral-300 dark:hover:bg-neutral-700/30 dark:hover:text-neutral-100 dark:disabled:text-neutral-600
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
  `,
		attention: `
    text-white rounded-2xl
    bg-gradient-to-r from-lime-600 via-emerald-600 to-cyan-600
    shadow-xl shadow-emerald-500/30
    transition-all duration-300 transform-gpu
    hover:-translate-y-1 hover:shadow-2xl 
    hover:from-lime-700 hover:via-emerald-700 hover:to-cyan-700
    focus:outline-none focus:ring-4 focus:ring-lime-500/50
    active:scale-95
    disabled:transform-none disabled:shadow-none
  `,
		fire: `
    bg-orange-500 text-white shadow-lg shadow-orange-500/25
    hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-600/30
    active:bg-orange-700 active:shadow-lg
    focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
    transition-all duration-200 ease-out
    disabled:bg-orange-300 disabled:text-white/70 disabled:shadow-none
    dark:bg-orange-600 dark:hover:bg-orange-500 dark:active:bg-orange-700
    dark:shadow-orange-700/40 dark:hover:shadow-orange-600/50
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
		<Spinner {size} class="me-2" />
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

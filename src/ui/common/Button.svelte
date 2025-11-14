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
		| 'boring'
		| 'friendly'
		| 'secondary'
		| 'ghost'
		| 'link'
		| 'link-pill'
		| 'link-pill-active'
		| 'continue'
		| 'attention'
		| 'fire'
		| 'neutral';

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
		// eslint-disable-next-line svelte/valid-compile
		...props
	}: {
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
	} = $props();

	const spinnerSize = {
		xs: 'xs',
		sm: 'sm',
		md: 'md',
		lg: 'md',
		xl: 'lg'
	};

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
 bg-gradient-to-r from-primary-500 to-emerald-500 text-white
 hover:from-primary-600 hover:to-emerald-600
 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
 active:from-primary-700 active:to-emerald-700
 disabled:from-primary-300 disabled:to-emerald-300 disabled:text-white/70 disabled:cursor-not-allowed
 dark:from-primary-500 dark:to-emerald-500 dark:hover:from-primary-400 dark:hover:to-emerald-400
 transition-all duration-200 ease-out
 `,
		destructive: `
   bg-rose-500 text-white shadow-lg shadow-rose-500/20 
   hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-600/30
   focus:ring-2 focus:ring-rose-500 focus:ring-offset-2
   disabled:bg-rose-300 disabled:text-white/70 disabled:shadow-none
   dark:bg-rose-600 dark:hover:bg-rose-500 dark:shadow-rose-600/30
   transition-all duration-200 ease-out
 `,
		outline: `
   border border-neutral-300 bg-white text-neutral-700 
   hover:bg-neutral-100 hover:border-neutral-400
   focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
   disabled:border-neutral-200 disabled:text-neutral-400 disabled:bg-neutral-100
   dark:border-neutral-700 dark:bg-gray-900 dark:text-neutral-300 
   dark:hover:bg-gray-800 dark:hover:border-neutral-600
   transition-all duration-150 ease-out
 `,
		boring: `
  bg-gray-200 text-gray-900 shadow-md shadow-gray-300
  hover:bg-gray-300 hover:shadow-lg hover:shadow-gray-400
  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
  disabled:bg-gray-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed
  dark:bg-gray-700 dark:text-gray-100 dark:shadow-gray-900/30
  dark:hover:bg-gray-600 dark:hover:shadow-gray-900/50
  transition-all duration-200 ease-out
`,
		friendly: `
  bg-emerald-500 text-white shadow-md shadow-emerald-400/30
  hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/40
  focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
  active:bg-emerald-700 disabled:bg-emerald-800
  disabled:bg-emerald-300 disabled:text-white/70 disabled:shadow-none disabled:cursor-not-allowed
  dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:active:bg-emerald-700
  dark:shadow-emerald-700/40 dark:hover:shadow-emerald-600/50
  transition-all duration-200 ease-out`,

		secondary: `
   bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30
   hover:from-violet-700 hover:to-purple-700 hover:shadow-xl hover:shadow-violet-600/40
   focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
   active:from-violet-800 active:to-purple-800
   disabled:from-violet-300 disabled:to-purple-300 disabled:text-white/70 disabled:shadow-none disabled:cursor-not-allowed
   dark:from-violet-500 dark:to-purple-500 dark:hover:from-violet-400 dark:hover:to-purple-400
   dark:shadow-violet-600/40 dark:hover:shadow-violet-500/50
   transition-all duration-200 ease-out
 `,
		ghost: `
   text-neutral-700 
   hover:bg-neutral-100 hover:text-neutral-900
   focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:outline-none
   disabled:text-neutral-400 disabled:hover:bg-transparent disabled:cursor-not-allowed
   dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 
   dark:disabled:text-neutral-600
   transition-all duration-150 ease-out
 `,
		link: `
   text-primary-600 underline-offset-4 
   hover:underline hover:text-primary-700
   focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
   disabled:text-primary-300 disabled:no-underline
   dark:text-primary-400 dark:hover:text-primary-300
   transition-colors duration-150 ease-out
 `,
		'link-pill': `
   text-sm text-gray-700 
   hover:text-primary-700 hover:bg-primary-100
   focus:ring-primary-500 focus:ring-2 focus:ring-offset-1
   dark:text-gray-300 dark:hover:text-primary-300 dark:hover:bg-primary-800/30
   transition-all duration-150 ease-out
 `,
		'link-pill-active': `
   text-sm text-primary-700 bg-primary-100
   focus:ring-primary-500 focus:ring-2 focus:ring-offset-1
   dark:text-primary-300 dark:bg-primary-900/50
 `,
		continue: `
   bg-lime-500 text-white uppercase tracking-wider shadow-lg shadow-lime-500/30 
   hover:bg-lime-600 hover:shadow-xl hover:shadow-lime-600/40
   focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2
   disabled:bg-lime-300 disabled:text-white/70 disabled:shadow-none
   dark:bg-lime-600 dark:hover:bg-lime-500 dark:shadow-lime-900/50
   dark:focus:ring-lime-400
   transition-all duration-200 ease-out
 `,
		attention: `
   bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30
   hover:from-violet-700 hover:to-purple-700 hover:shadow-xl hover:shadow-violet-600/40
   focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
   active:from-violet-800 active:to-purple-800
   disabled:from-violet-300 disabled:to-purple-300 disabled:text-white/70 disabled:shadow-none disabled:cursor-not-allowed
   dark:from-violet-500 dark:to-purple-500 dark:hover:from-violet-400 dark:hover:to-purple-400
   dark:shadow-violet-600/40 dark:hover:shadow-violet-500/50
   transition-all duration-200 ease-out
 `,
		fire: `
   bg-orange-500 text-white shadow-lg shadow-orange-500/25
   hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-600/35
   active:bg-orange-700
   focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
   transition-all duration-200 ease-out
   disabled:bg-orange-300 disabled:text-white/70 disabled:shadow-none
   dark:bg-orange-600 dark:hover:bg-orange-500 dark:active:bg-orange-700
   dark:shadow-orange-700/40 dark:hover:shadow-orange-600/50
 `,
		neutral: `
		bg-gray-700 text-white shadow-md shadow-gray-700/20
		hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-800/30
		focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2
		active:bg-gray-900
		disabled:bg-gray-400 disabled:text-white/70 disabled:shadow-none disabled:cursor-not-allowed
		dark:bg-gray-600 dark:hover:bg-gray-500 dark:active:bg-gray-700
		dark:shadow-gray-800/30 dark:hover:shadow-gray-700/40
		transition-all duration-200 ease-out
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
			{
				'cursor-wait': loading,
				'w-full': fullWidth
			},
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
		<Spinner
			size={size !== 'icon' ? (spinnerSize[size as keyof typeof spinnerSize] as any) : 'sm'}
			class="me-2"
		/>
	{/if}

	{#if startIcon && !loading}
		<Icon name={startIcon} size={finalIconSize} class={'me-2'} />
	{/if}

	{#if children}
		{@render children?.()}
	{/if}

	{#if endIcon && !loading}
		<Icon name={endIcon} size={finalIconSize} class={'ms-2'} />
	{/if}
{/snippet}

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
		| 'gray';

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
		// Luminous gradient with inset top-highlight for depth
		default: `
			bg-gradient-to-b from-primary-400 via-primary-500 to-emerald-600
			shadow-[0_1px_2px_rgba(0,0,0,0.12),0_4px_12px_rgba(16,185,129,0.22),inset_0_1px_0_rgba(255,255,255,0.18)]
			text-white tracking-[-0.01em]
			hover:from-primary-300 hover:via-primary-400 hover:to-emerald-500
			hover:shadow-[0_1px_2px_rgba(0,0,0,0.10),0_6px_16px_rgba(16,185,129,0.30),inset_0_1px_0_rgba(255,255,255,0.22)]
			focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
			active:from-primary-600 active:to-emerald-700
			active:shadow-[0_1px_2px_rgba(0,0,0,0.14),inset_0_1px_3px_rgba(0,0,0,0.15)]
			active:scale-[0.99]
			disabled:from-primary-300 disabled:to-emerald-300 disabled:text-white/60 disabled:shadow-none disabled:cursor-not-allowed
			dark:from-primary-500 dark:via-primary-500 dark:to-emerald-600
			dark:hover:from-primary-400 dark:hover:to-emerald-500
			transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
		`,

		// Deep rose — saturated, surgical
		destructive: `
			bg-gradient-to-b from-rose-400 to-rose-600
			shadow-[0_1px_2px_rgba(0,0,0,0.12),0_4px_12px_rgba(244,63,94,0.20),inset_0_1px_0_rgba(255,255,255,0.16)]
			text-white tracking-[-0.01em]
			hover:from-rose-300 hover:to-rose-500
			hover:shadow-[0_1px_2px_rgba(0,0,0,0.10),0_6px_16px_rgba(244,63,94,0.28),inset_0_1px_0_rgba(255,255,255,0.20)]
			focus:ring-2 focus:ring-rose-400 focus:ring-offset-2
			active:from-rose-600 active:to-rose-700 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.18)]
			active:scale-[0.99]
			disabled:from-rose-300 disabled:to-rose-400 disabled:text-white/60 disabled:shadow-none
			dark:from-rose-500 dark:to-rose-700 dark:hover:from-rose-400 dark:hover:to-rose-600
			transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
		`,

		// Hairline border, glass-like surface
		outline: `
			border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700
			shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]
			tracking-[-0.01em]
			hover:bg-white hover:border-gray-300 hover:text-gray-900
			hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)]
			focus:ring-2 focus:ring-primary-400 focus:ring-offset-1
			active:bg-gray-50 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]
			active:scale-[0.99]
			disabled:border-gray-100 disabled:text-gray-300 disabled:shadow-none
			dark:border-gray-700/80 dark:bg-gray-900/80 dark:text-gray-300
			dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:hover:text-gray-100
			dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]
			transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
		`,

		// Muted, elevated — for secondary actions
		boring: `
			bg-gray-100 text-gray-800
			shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]
			tracking-[-0.01em]
			hover:bg-gray-200 hover:text-gray-900
			hover:shadow-[0_1px_3px_rgba(0,0,0,0.08)]
			focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
			active:bg-gray-300 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]
			active:scale-[0.99]
			disabled:bg-gray-50 disabled:text-gray-300 disabled:shadow-none disabled:cursor-not-allowed
			dark:bg-gray-800 dark:text-gray-200
			dark:hover:bg-gray-700 dark:hover:text-gray-100
			dark:shadow-[0_1px_2px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)]
			transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
		`,

		// Fresh emerald — confidence without aggression
		friendly: `
			bg-gradient-to-b from-emerald-400 to-emerald-600
			shadow-[0_1px_2px_rgba(0,0,0,0.10),0_4px_12px_rgba(16,185,129,0.20),inset_0_1px_0_rgba(255,255,255,0.20)]
			text-white tracking-[-0.01em]
			hover:from-emerald-300 hover:to-emerald-500
			hover:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_6px_16px_rgba(16,185,129,0.28),inset_0_1px_0_rgba(255,255,255,0.24)]
			focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
			active:from-emerald-600 active:to-emerald-700 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]
			active:scale-[0.99]
			disabled:from-emerald-200 disabled:to-emerald-300 disabled:text-white/60 disabled:shadow-none disabled:cursor-not-allowed
			dark:from-emerald-500 dark:to-emerald-700 dark:hover:from-emerald-400 dark:hover:to-emerald-600
			transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
		`,

		// Purple — editorial weight, premium
		secondary: `
			bg-gradient-to-b from-violet-500 to-purple-700
			shadow-[0_1px_2px_rgba(0,0,0,0.14),0_4px_14px_rgba(139,92,246,0.25),inset_0_1px_0_rgba(255,255,255,0.18)]
			text-white tracking-[-0.01em]
			hover:from-violet-400 hover:to-purple-600
			hover:shadow-[0_1px_2px_rgba(0,0,0,0.12),0_6px_18px_rgba(139,92,246,0.35),inset_0_1px_0_rgba(255,255,255,0.22)]
			focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2
			active:from-violet-700 active:to-purple-800 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.18)]
			active:scale-[0.99]
			disabled:from-violet-200 disabled:to-purple-300 disabled:text-white/60 disabled:shadow-none disabled:cursor-not-allowed
			dark:from-violet-500 dark:to-purple-700 dark:hover:from-violet-400 dark:hover:to-purple-600
			transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
		`,

		// Featherweight — pure affordance
		ghost: `
			text-gray-600 bg-transparent
			tracking-[-0.01em]
			hover:bg-gray-100 hover:text-gray-900
			focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 focus:outline-none
			active:bg-gray-200 active:scale-[0.99]
			disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed
			dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100
			dark:active:bg-gray-700 dark:disabled:text-gray-600
			transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
		`,

		link: `
			text-primary-600 underline-offset-[3px]
			tracking-[-0.01em]
			hover:underline hover:text-primary-700
			focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 focus:rounded-sm
			active:text-primary-800
			disabled:text-primary-300 disabled:no-underline
			dark:text-primary-400 dark:hover:text-primary-300
			transition-colors duration-100
		`,

		'link-pill': `
			text-sm text-gray-600 rounded-full
			tracking-[-0.01em]
			hover:text-primary-700 hover:bg-primary-50
			focus:ring-2 focus:ring-primary-400 focus:ring-offset-1
			active:bg-primary-100
			dark:text-gray-400 dark:hover:text-primary-300 dark:hover:bg-primary-900/30
			transition-all duration-150 ease-out
		`,

		'link-pill-active': `
			text-sm text-primary-700 bg-primary-50 rounded-full
			tracking-[-0.01em]
			focus:ring-2 focus:ring-primary-400 focus:ring-offset-1
			dark:text-primary-300 dark:bg-primary-900/40
		`,

		// High-contrast lime CTA — urgency, clarity
		continue: `
			bg-gradient-to-b from-lime-400 to-lime-600
			shadow-[0_1px_2px_rgba(0,0,0,0.10),0_4px_12px_rgba(132,204,22,0.22),inset_0_1px_0_rgba(255,255,255,0.25)]
			text-white tracking-[0.04em] uppercase text-[0.8em] font-extrabold
			hover:from-lime-300 hover:to-lime-500
			hover:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_6px_16px_rgba(132,204,22,0.30),inset_0_1px_0_rgba(255,255,255,0.30)]
			focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2
			active:from-lime-600 active:to-lime-700 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]
			active:scale-[0.99]
			disabled:from-lime-200 disabled:to-lime-300 disabled:text-white/60 disabled:shadow-none
			dark:from-lime-500 dark:to-lime-700 dark:hover:from-lime-400 dark:hover:to-lime-600
			transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
		`,

		// Alias of secondary
		attention: `
			bg-gradient-to-b from-violet-500 to-purple-700
			shadow-[0_1px_2px_rgba(0,0,0,0.14),0_4px_14px_rgba(139,92,246,0.25),inset_0_1px_0_rgba(255,255,255,0.18)]
			text-white tracking-[-0.01em]
			hover:from-violet-400 hover:to-purple-600
			hover:shadow-[0_1px_2px_rgba(0,0,0,0.12),0_6px_18px_rgba(139,92,246,0.35),inset_0_1px_0_rgba(255,255,255,0.22)]
			focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2
			active:from-violet-700 active:to-purple-800 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.18)]
			active:scale-[0.99]
			disabled:from-violet-200 disabled:to-purple-300 disabled:text-white/60 disabled:shadow-none disabled:cursor-not-allowed
			dark:from-violet-500 dark:to-purple-700 dark:hover:from-violet-400 dark:hover:to-purple-600
			transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
		`,

		// Warm orange — energy without alarm
		fire: `
			bg-gradient-to-b from-orange-400 to-orange-600
			shadow-[0_1px_2px_rgba(0,0,0,0.10),0_4px_12px_rgba(249,115,22,0.20),inset_0_1px_0_rgba(255,255,255,0.20)]
			text-white tracking-[-0.01em]
			hover:from-orange-300 hover:to-orange-500
			hover:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_6px_16px_rgba(249,115,22,0.28),inset_0_1px_0_rgba(255,255,255,0.24)]
			focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
			active:from-orange-600 active:to-orange-700 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]
			active:scale-[0.99]
			disabled:from-orange-200 disabled:to-orange-300 disabled:text-white/60 disabled:shadow-none
			dark:from-orange-500 dark:to-orange-700 dark:hover:from-orange-400 dark:hover:to-orange-600
			transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
		`,

		// Anthracite — quiet authority
		gray: `
			bg-gradient-to-b from-gray-600 to-gray-800
			shadow-[0_1px_2px_rgba(0,0,0,0.16),0_3px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.10)]
			text-white tracking-[-0.01em]
			hover:from-gray-500 hover:to-gray-700
			hover:shadow-[0_1px_2px_rgba(0,0,0,0.14),0_5px_12px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.12)]
			focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
			active:from-gray-800 active:to-gray-900 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)]
			active:scale-[0.99]
			disabled:from-gray-400 disabled:to-gray-500 disabled:text-white/60 disabled:shadow-none disabled:cursor-not-allowed
			dark:from-gray-600 dark:to-gray-800 dark:hover:from-gray-500 dark:hover:to-gray-700
			transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
		`
	};

	const sizeClasses = {
		xs: 'h-6 px-3 text-xs gap-1',
		sm: 'h-8 px-3.5 text-sm gap-1.5',
		md: 'h-9 px-5 text-sm gap-2',
		lg: 'h-11 px-7 text-base gap-2',
		xl: 'h-13 px-9 text-lg gap-2.5',
		icon: 'h-9 w-9 p-0 flex items-center justify-center'
	};

	const classes = $derived(
		cn(
			'cursor-pointer inline-flex items-center justify-center font-semibold select-none',
			'focus:outline-none',
			'disabled:pointer-events-none disabled:opacity-60',
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
		/>
	{/if}

	{#if startIcon && !loading}
		<Icon name={startIcon} size={finalIconSize} />
	{/if}

	{#if children}
		{@render children?.()}
	{/if}

	{#if endIcon && !loading}
		<Icon name={endIcon} size={finalIconSize} />
	{/if}
{/snippet}

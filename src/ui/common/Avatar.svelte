<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
	import { cn } from '$utils/classnames';

	const sizeClasses = {
		xs: 'h-6 w-6 text-xs',
		sm: 'h-7 w-7 text-sm',
		md: 'h-9 w-9 text-base',
		lg: 'h-12 w-12 text-lg',
		xl: 'h-16 w-16 text-xl',
		'2xl': 'h-20 w-20 text-2xl',
		'3xl': 'h-28 w-28 text-2xl',
		'4xl': 'h-32 w-32 text-2xl',
		'5xl': 'h-36 w-36 text-2xl'
	} as const;

	type SizeVariant = keyof typeof sizeClasses;
	type StatusVariant = 'online' | 'offline' | 'away' | 'busy';

	let {
		src = '',
		alt = '',
		fallback = '',
		size = 'sm' as SizeVariant,
		className = '',
		showFallbackIcon = false,
		status = null as StatusVariant | null,
		showStatusIndicator = false,
		loading = false
	} = $props();

	const dicebearUrl = $derived.by(() => {
		if (!fallback) return '';
		const seed = encodeURIComponent(fallback.trim());
		return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}`;
	});

	let imageError = $state(false);
	let imageLoaded = $state(false);

	const handleImageError = () => {
		imageError = true;
	};

	const handleImageLoad = () => {
		imageLoaded = true;
	};

	const outerClasses = $derived(cn('relative inline-block', sizeClasses[size], className));

	const innerClasses = $derived(
		cn(
			'flex h-full w-full items-center justify-center rounded-full overflow-hidden',
			'bg-gradient-to-br from-primary to-primary-600 text-primary-foreground',
			'dark:from-slate-700 dark:to-slate-800 dark:text-slate-100',
			'transition-all duration-200 ease-in-out'
		)
	);

	const statusIndicatorSize = $derived(
		(() => {
			switch (size) {
				case 'xs':
					return 'h-2 w-2';
				case 'sm':
					return 'h-2.5 w-2.5';
				case 'md':
					return 'h-3 w-3';
				case 'lg':
					return 'h-4 w-4';
				default:
					return 'h-5 w-5';
			}
		})()
	);

	const statusIndicatorColor = $derived(
		((): string => {
			switch (status) {
				case 'online':
					return 'bg-green-500 dark:bg-green-400';
				case 'offline':
					return 'bg-gray-400 dark:bg-gray-500';
				case 'away':
					return 'bg-yellow-500 dark:bg-yellow-400';
				case 'busy':
					return 'bg-red-500 dark:bg-red-400';
				default:
					return 'bg-gray-400 dark:bg-gray-500';
			}
		})()
	);
</script>

<div class={outerClasses}>
	<div class={innerClasses}>
		{#if loading}
			<div class="bg-primary-300 h-full w-full animate-pulse rounded-full dark:bg-slate-700"></div>
		{:else if src && !imageError}
			<img
				{src}
				{alt}
				onerror={handleImageError}
				onload={handleImageLoad}
				class="h-full w-full rounded-full object-cover transition-opacity duration-200 {imageLoaded
					? 'opacity-100'
					: 'opacity-0'}"
			/>
			{#if !imageLoaded}
				<div
					class="bg-primary-300 absolute inset-0 animate-pulse rounded-full dark:bg-slate-700"
				></div>
			{/if}
		{:else if fallback && !showFallbackIcon}
			<img
				src={dicebearUrl}
				{alt}
				class="h-full w-full rounded-full object-cover transition-opacity duration-200"
			/>
		{:else}
			<Icon
				name="user"
				size={size === 'xs'
					? 12
					: size === 'sm'
						? 16
						: size === 'md'
							? 20
							: size === 'lg'
								? 28
								: size === 'xl'
									? 36
									: 44}
				class="opacity-70"
			/>
		{/if}
	</div>

	{#if showStatusIndicator && status}
		<div
			class="absolute -right-0.5 -bottom-0.5 rounded-full {statusIndicatorSize} {statusIndicatorColor}"
			aria-label="Status: {status}"
		></div>
	{/if}
</div>

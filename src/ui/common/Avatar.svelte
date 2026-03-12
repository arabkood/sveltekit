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
		return `https://api.dicebear.com/9.x/bottts-neutral/svg?scale=90&seed=${seed}`;
	});

	let imageError = $state(false);
	let imageLoaded = $state(false);

	const handleImageError = () => {
		imageError = true;
	};
	const handleImageLoad = () => {
		imageLoaded = true;
	};

	const outerClasses = $derived(cn('relative inline-block shrink-0', sizeClasses[size], className));

	const innerClasses = $derived(
		cn(
			'flex h-full w-full items-center justify-center rounded-full overflow-hidden',
			'ring-1 ring-black/8 dark:ring-white/10',
			'bg-gray-100 text-gray-500',
			'dark:bg-gray-800 dark:text-gray-400',
			'transition-opacity duration-200'
		)
	);

	const statusSizeClasses = {
		xs: 'h-2 w-2',
		sm: 'h-2.5 w-2.5',
		md: 'h-3 w-3',
		lg: 'h-4 w-4',
		xl: 'h-4 w-4',
		'2xl': 'h-5 w-5',
		'3xl': 'h-5 w-5',
		'4xl': 'h-5 w-5',
		'5xl': 'h-5 w-5'
	} as const;

	const statusColorClasses = {
		online: 'bg-emerald-500 dark:bg-emerald-400',
		offline: 'bg-gray-400 dark:bg-gray-500',
		away: 'bg-amber-400 dark:bg-amber-400',
		busy: 'bg-rose-500 dark:bg-rose-400'
	} as const;

	const iconSizes: Record<SizeVariant, number> = {
		xs: 12,
		sm: 14,
		md: 20,
		lg: 28,
		xl: 36,
		'2xl': 40,
		'3xl': 48,
		'4xl': 52,
		'5xl': 56
	};
</script>

<div class={outerClasses}>
	<div class={innerClasses}>
		{#if loading}
			<div class="h-full w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
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
				<div class="absolute inset-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
			{/if}
		{:else if fallback && !showFallbackIcon}
			<img src={dicebearUrl} {alt} class="h-full w-full rounded-full object-cover" />
		{:else}
			<Icon name="user" size={iconSizes[size]} class="opacity-50" />
		{/if}
	</div>

	{#if showStatusIndicator && status}
		<span
			class="
				absolute -right-0.5 -bottom-0.5 rounded-full
				ring-2 ring-white dark:ring-gray-900
				{statusSizeClasses[size]} {statusColorClasses[status]}
			"
			aria-label="Status: {status}"
		></span>
	{/if}
</div>

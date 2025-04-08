<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
	import { cn } from '$utils/classnames';

	// Define size variants for quick use
	const sizeClasses = {
		xs: 'h-6 w-6 text-xs',
		sm: 'h-7 w-7 text-sm',
		md: 'h-9 w-9 text-base',
		lg: 'h-12 w-12 text-lg',
		xl: 'h-16 w-16 text-xl'
	} as const;

	type SizeVariant = keyof typeof sizeClasses;

	let {
		src = '',
		alt = '',
		fallback = '',
		size = 'sm' as SizeVariant,
		className = '',
		showFallbackIcon = false
	} = $props();

	// Get user initials for fallback
	const initials = $derived(
		fallback
			? fallback
					.split(' ')
					.map((word) => word[0])
					.join('')
					.toUpperCase()
					.slice(0, 2)
			: ''
	);

	let imageError = $state(false);

	const handleImageError = () => {
		imageError = true;
	};

	// Computed classes for the avatar container
	const classes = $derived(
		cn(
			'inline-flex items-center justify-center rounded-full bg-primary text-primary-900',
			sizeClasses[size],
			className
		)
	);
</script>

<div class={classes}>
	{#if src && !imageError}
		<img {src} {alt} onerror={handleImageError} class="h-full w-full rounded-full object-cover" />
	{:else if fallback && !showFallbackIcon}
		<span class="font-medium">{initials}</span>
	{:else}
		<Icon
			name="user"
			size={size === 'xs' ? 14 : size === 'sm' ? 20 : size === 'md' ? 24 : size === 'lg' ? 32 : 40}
		/>
	{/if}
</div>

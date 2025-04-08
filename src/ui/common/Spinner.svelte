<script lang="ts">
	import { cn } from '$utils/classnames';

	type Size = 'sm' | 'md' | 'lg' | 'xl';
	type Variant = 'primary' | 'secondary' | 'destructive' | 'current';

	let {
		class: className = '',
		size = 'md',
		variant = 'current',
		thickness,
		label = 'Loading...',
		...props
	}: {
		class?: string;
		size?: Size;
		variant?: Variant;
		thickness?: number;
		label?: string;
		[key: string]: unknown;
	} = $props();

	const defaultSizes = {
		sm: 16,
		md: 24,
		lg: 32,
		xl: 48
	};

	const defaultThicknesses = {
		sm: 2,
		md: 3,
		lg: 3,
		xl: 4
	};

	const finalSize = $derived(defaultSizes[size]);
	const finalThickness = $derived(thickness ?? defaultThicknesses[size]);

	const variantClasses = {
		primary: 'text-primary-500',
		secondary: 'text-gray-500',
		destructive: 'text-red-500',
		current: 'text-current'
	};

	const spinnerClasses = $derived(
		cn('inline-block animate-spin', variantClasses[variant], className)
	);
</script>

<svg
	class={spinnerClasses}
	xmlns="http://www.w3.org/2000/svg"
	width={finalSize}
	height={finalSize}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={finalThickness}
	stroke-linecap="round"
	stroke-linejoin="round"
	role="status"
	aria-label={label}
	{...props}
>
	<path d="M21 12a9 9 0 1 1-6.219-8.56" />
</svg>

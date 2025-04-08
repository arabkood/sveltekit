<script lang="ts">
	import { cn } from '$utils/classnames';
	let {
		value = 0,
		max = 100,
		class: className = '',
		barHeight = 'h-2',
		barColor = 'bg-primary-600',
		barGradient = undefined as string | undefined,
		trackColor = 'bg-gray-200 dark:bg-gray-700',
		labelType = 'none' as 'percentage' | 'value' | 'none',
		ariaLabel = 'Progress indicator'
	} = $props<{
		value?: number;
		max?: number;
		class?: string;
		barHeight?: string;
		barColor?: string;
		barGradient?: string;
		trackColor?: string;
		labelType?: 'percentage' | 'value' | 'none';
		ariaLabel?: string;
	}>();

	const calculatedValue = $derived(Math.min(Math.max(0, value), max));
	const percentage = $derived(max === 0 ? 0 : (calculatedValue / max) * 100);
	const percentageText = $derived(`${percentage.toFixed(0)}%`);

	const barBaseClasses =
		'absolute top-0 bottom-0 start-0 h-full transition-width duration-300 ease-in-out';
</script>

<div class={cn('flex w-full items-center gap-x-3', className)}>
	<div
		role="progressbar"
		aria-valuenow={calculatedValue}
		aria-valuemin={0}
		aria-valuemax={max}
		aria-label={ariaLabel}
		class={cn('relative w-full overflow-hidden rounded-full', barHeight, trackColor)}
	>
		<div
			class={cn(barBaseClasses, barGradient ? barGradient : barColor)}
			style="width: {percentage}%"
			aria-hidden="true"
		></div>
	</div>
	{#if labelType !== 'none'}
		<span class="text-sm font-medium whitespace-nowrap tabular-nums transition-colors duration-200">
			{#if labelType === 'value'}
				<span class="value-part font-semibold text-gray-800 dark:text-gray-100"
					>{calculatedValue}</span
				>
				<span class="separator-and-total-part text-gray-500 dark:text-gray-400">
					<span aria-hidden="true"> / </span>
					<span class="total-part">{max}</span>
				</span>
			{:else if labelType === 'percentage'}
				<span class="percentage-part text-gray-700 dark:text-gray-200">{percentageText}</span>
			{/if}
		</span>
	{/if}
</div>

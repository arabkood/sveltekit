<script lang="ts">
	import { cn } from '$utils/classnames';
	import type { Snippet } from 'svelte';

	let { class: className = '', children } = $props<{
		class?: string;
		children?: Snippet;
	}>();
</script>

<div
	class={cn(
		'relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-primary-600 [&>svg~*]:pl-7',
		'border-primary-200 bg-primary-50 text-primary-900',
		className
	)}
>
	{@render children()}
</div>

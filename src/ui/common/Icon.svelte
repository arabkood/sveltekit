<script lang="ts">
	import { isValidIconId, type IconId } from '$ui/shared/SvgSprite.svelte';

	const {
		name,
		size = 24,
		class: class_name = '',
		...rest
	}: {
		name: IconId;
		size?: number;
		class?: string;
		[key: string]: unknown;
	} = $props();

	// Check if icon exists in development mode
	if (import.meta.env.DEV) {
		if (!isValidIconId(name)) {
			console.error(`Icon "${name}" does not exist`);
		}
	}
</script>

<svg width={size} height={size} class={class_name} {...rest}>
	<use
		href="#icon-{name}"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>

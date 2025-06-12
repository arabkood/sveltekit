<script lang="ts">
	import '../../app.css';
	import SvgSprite from '$ui/shared/SvgSprite.svelte';
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

{@render children()}

<SvgSprite />

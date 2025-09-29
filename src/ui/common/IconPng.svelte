<script lang="ts" module>
	import premium from '$assets/images/icons/premium.png?enhanced';
	import fire from '$assets/images/icons/fire.png?enhanced';
	import bolt from '$assets/images/icons/bolt.png?enhanced';
	import terminal from '$assets/images/icons/terminal.png?enhanced';
	import bookClose from '$assets/images/icons/book-close.png?enhanced';
	import levelBadges0 from '$assets/images/icons/level-badges/0.png?enhanced';
	import levelBadges1 from '$assets/images/icons/level-badges/1.png?enhanced';
	import levelBadges2 from '$assets/images/icons/level-badges/2.png?enhanced';
	import levelBadges3 from '$assets/images/icons/level-badges/3.png?enhanced';
	import levelBadges4 from '$assets/images/icons/level-badges/4.png?enhanced';
	import levelBadges5 from '$assets/images/icons/level-badges/5.png?enhanced';
	import levelBadges6 from '$assets/images/icons/level-badges/6.png?enhanced';
	import levelBadges7 from '$assets/images/icons/level-badges/7.png?enhanced';
	import levelBadges8 from '$assets/images/icons/level-badges/8.png?enhanced';
	import levelBadges9 from '$assets/images/icons/level-badges/9.png?enhanced';

	const icons = {
		premium,
		fire,
		bolt,
		terminal,
		'book-close': bookClose,
		level_badges_0: levelBadges0,
		level_badges_1: levelBadges1,
		level_badges_2: levelBadges2,
		level_badges_3: levelBadges3,
		level_badges_4: levelBadges4,
		level_badges_5: levelBadges5,
		level_badges_6: levelBadges6,
		level_badges_7: levelBadges7,
		level_badges_8: levelBadges8,
		level_badges_9: levelBadges9
	};

	export type IconPngName = keyof typeof icons;
</script>

<script lang="ts">
	const {
		name,
		size = 24,
		class: class_name = '',
		...rest
	}: {
		name: IconPngName;
		size?: number;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const src = icons[name];

	if (!src) {
		console.warn(`PNG icon "${name}" does not exist`);
	}
</script>

{#if src}
	<div
		class={`relative flex items-center justify-center overflow-hidden ${class_name}`}
		style={`width: ${size}px; height: ${size}px;`}
	>
		<!-- svelte-ignore hydration_attribute_changed -->
		<enhanced:img
			{src}
			alt={name}
			style="max-width: 100%; max-height: 100%; object-fit: contain;"
			{...rest}
		/>
	</div>
{/if}

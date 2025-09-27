<script lang="ts" module>
	const icons = {
		premium: '/images/icons/premium.png',
		fire: '/images/icons/fire.png',
		level_badges_0: '/images/icons/level-badges/0.png',
		level_badges_1: '/images/icons/level-badges/1.png',
		level_badges_2: '/images/icons/level-badges/2.png',
		level_badges_3: '/images/icons/level-badges/3.png',
		level_badges_4: '/images/icons/level-badges/4.png',
		level_badges_5: '/images/icons/level-badges/5.png',
		level_badges_6: '/images/icons/level-badges/6.png',
		level_badges_7: '/images/icons/level-badges/7.png',
		level_badges_8: '/images/icons/level-badges/8.png',
		level_badges_9: '/images/icons/level-badges/9.png'
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
	<img {src} alt={name} width={size} height={size} class={class_name} {...rest} />
{/if}

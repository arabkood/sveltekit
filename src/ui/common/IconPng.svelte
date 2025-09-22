<script lang="ts">
	const icons = {
		premium: '/images/icons/premium.png'
	};

	const {
		name,
		size = 24,
		class: class_name = '',
		...rest
	}: {
		name: keyof typeof icons;
		size?: number;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const src = icons[name];

	if (!src) {
		console.error(`PNG icon "${name}" does not exist`);
	}
</script>

<img {src} alt={name} width={size} height={size} class={class_name} {...rest} />

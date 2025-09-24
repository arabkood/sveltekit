<script lang="ts">
	import Button from '$ui/common/Button.svelte';

	type Props = {
		level: string;
		levelBars: 0 | 1 | 2 | 3 | 4;
		levelClass?: string;
		category: string[];
		title: string;
		description?: string;
		buttonText: string;
		buttonHref?: string;
		buttonOnClick?: () => {};
		imageSrc?: string;
		imageAlt?: string;
	};

	const {
		level,
		buttonOnClick,
		levelBars,
		levelClass,
		category,
		title,
		description,
		buttonText,
		buttonHref,
		imageSrc,
		imageAlt = ''
	}: Props = $props();

	const bars = [
		{ x: 0, y: 9, h: 5 },
		{ x: 4, y: 6, h: 8 },
		{ x: 8, y: 3, h: 11 },
		{ x: 12, y: 0, h: 14 }
	];
</script>

<div class="w-full bg-gradient-to-r from-transparent via-purple-900/60 to-transparent text-white">
	<div class="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
		<div class="flex flex-col items-center gap-10 lg:flex-row lg:gap-12">
			<div class="w-full max-w-3xl flex-1 text-center lg:text-start">
				<div
					class="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start"
				>
					<span
						class={'inline-flex items-center gap-x-3 rounded-full border-2 border-white/50 px-4 py-1.5 text-sm font-semibold ' +
							levelClass}
					>
						{level}
						<svg class="h-4 w-4" viewBox="0 0 16 16" aria-hidden="true">
							{#each bars as bar, i}
								<rect
									x={bar.x}
									y={bar.y}
									width="3"
									height={bar.h}
									rx="1"
									fill={i < levelBars ? 'currentColor' : 'rgba(255,255,255,0.3)'}
								/>
							{/each}
						</svg>
					</span>
					<div class="flex gap-2">
						{#each category as cat}
							<span class="text-sm font-semibold tracking-wider text-white/80 uppercase">
								{cat}
							</span>
						{/each}
					</div>
				</div>
				<h1
					class="text-4xl leading-tight font-bold tracking-tight text-white drop-shadow-[5px_5px_0_rgba(0,0,0,0.2)] sm:text-5xl lg:text-6xl"
				>
					{title}
				</h1>
				{#if !!description}
					<p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/90 lg:mx-0">
						{description}
					</p>
				{/if}
				{#if !!buttonHref || !!buttonOnClick}
					<div class="mt-10">
						<Button size="lg" variant="attention" href={buttonHref} onclick={buttonOnClick}>
							{buttonText}
						</Button>
					</div>
				{/if}
			</div>

			{#if imageSrc}
				<div class="flex-shrink-0">
					<img
						src={imageSrc}
						alt={imageAlt}
						class="h-auto w-full max-w-xs rounded-lg object-contain sm:max-w-sm lg:w-72"
					/>
				</div>
			{/if}
		</div>
	</div>
</div>

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

<div class="relative w-full border-b border-gray-200/60 dark:border-gray-700/40">
	<div class="relative mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
		<div class="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
			<!-- Text -->
			<div class="w-full flex-1 text-center lg:text-start">
				<!-- Badges row -->
				<div class="mb-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
					<!-- Difficulty badge -->
					<span
						class="inline-flex items-center gap-2 rounded-lg border border-gray-200/80 bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-wide text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.06)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-300 {levelClass}"
					>
						{level}
						<svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" aria-hidden="true">
							{#each bars as bar, i}
								<rect
									x={bar.x}
									y={bar.y}
									width="3"
									height={bar.h}
									rx="1"
									opacity={i < levelBars ? '1' : '0.2'}
									fill="currentColor"
								/>
							{/each}
						</svg>
					</span>

					<!-- Category tags -->
					{#each category as cat}
						<span
							class="rounded-lg border border-gray-200/60 bg-white/50 px-3 py-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase backdrop-blur-sm dark:border-white/8 dark:bg-white/5 dark:text-gray-400"
						>
							{cat}
						</span>
					{/each}
				</div>

				<!-- Title -->
				<h1
					class="text-4xl leading-[1.15] font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white"
				>
					{title}
				</h1>

				<!-- Description -->
				{#if description}
					<p
						class="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-500 lg:mx-0 lg:text-lg dark:text-gray-400"
					>
						{description}
					</p>
				{/if}

				<!-- CTA -->
				{#if buttonHref || buttonOnClick}
					<div class="mt-8">
						<Button size="lg" variant="attention" href={buttonHref} onclick={buttonOnClick}>
							{buttonText}
						</Button>
					</div>
				{/if}
			</div>

			<!-- Image -->
			{#if imageSrc}
				<div class="relative shrink-0">
					<img
						src={imageSrc}
						alt={imageAlt}
						class="relative h-auto w-48 object-contain drop-shadow-xl sm:w-56 lg:w-64 xl:w-72"
					/>
				</div>
			{/if}
		</div>
	</div>
</div>

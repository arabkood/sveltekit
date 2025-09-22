<script>
	let {
		src,
		poster,
		autoplay = false,
		muted = false,
		loop = false,
		controls = true,
		preload = 'metadata',
		width,
		height,
		class: className = '',
		style = ''
	} = $props();

	let videoElement = $state();
	let isPlaying = $state(false);

	async function togglePlay() {
		if (!videoElement) return;
		try {
			if (videoElement.paused) {
				await videoElement.play();
			} else {
				videoElement.pause();
			}
		} catch (error) {
			console.error('Video playback failed:', error);
		}
	}

	function handlePlay() {
		isPlaying = true;
	}

	function handlePauseOrEnd() {
		isPlaying = false;
	}

	$effect(() => {
		if (videoElement && autoplay) {
			videoElement.muted = true;
			videoElement.play().catch((error) => {
				console.warn('Autoplay was prevented by the browser.', error);
				isPlaying = false;
			});
		}
	});

	export async function play() {
		try {
			await videoElement?.play();
		} catch (error) {
			console.error('Programmatic play failed:', error);
		}
	}

	export function pause() {
		videoElement?.pause();
	}
</script>

<div class="video-container {className}" {style} onclick={togglePlay}>
	<video
		bind:this={videoElement}
		{src}
		{poster}
		{autoplay}
		{muted}
		{loop}
		{controls}
		{preload}
		{width}
		{height}
		onplay={handlePlay}
		onpause={handlePauseOrEnd}
		onended={handlePauseOrEnd}
		playsinline
	>
		Your browser does not support the video tag.
	</video>

	{#if !isPlaying}
		<div class="play-overlay">
			<button class="play-button" aria-label="Play Video">
				<svg width="60" height="60" viewBox="0 0 60 60" fill="none">
					<circle cx="30" cy="30" r="30" fill="rgba(0, 0, 0, 0.7)" />
					<path d="M25 20 L40 30 L25 40 Z" fill="white" />
				</svg>
			</button>
		</div>
	{/if}
</div>

<style>
	.video-container {
		position: relative;
		width: 100%;
		max-width: 100%;
		cursor: pointer;
		line-height: 0;
	}

	video {
		width: 100%;
		height: auto;
		display: block;
	}

	.play-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		transition: background-color 0.2s ease;
		pointer-events: none;
	}

	.video-container:hover .play-overlay {
		background: rgba(0, 0, 0, 0.2);
	}

	.play-button {
		background: none;
		border: none;
		padding: 0;
		transition: transform 0.2s ease;
		pointer-events: all;
		cursor: pointer;
	}

	.play-button:hover {
		transform: scale(1.1);
	}

	.play-button svg {
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	}
</style>

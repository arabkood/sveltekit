<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onDestroy } from 'svelte';

	interface Props {
		status?: 'idle' | 'loading' | 'success' | 'error';
		estimatedSeconds?: number;
	}

	let { status = 'idle', estimatedSeconds = 5 }: Props = $props();

	// State management
	let showLoader = $state(false);
	let statusText = $state('جاري إجراء الاختبارات...');
	let timeEstimate = $state('');
	let fullBar = $state(false);
	let isLoading = $state(false);

	// Progress tracking
	let progressInterval: ReturnType<typeof setInterval> | undefined;
	let startTime: number;

	// Status messages
	const STATUS_MESSAGES = {
		initial: 'جاري إجراء الاختبارات...',
		analyzing: 'تحليل النتائج...',
		completed: 'تم إنهاء العملية'
	} as const;

	function updateTimeEstimate(): void {
		const elapsed = Date.now() - startTime;
		const elapsedSeconds = elapsed / 1000;

		timeEstimate =
			elapsed < 1500
				? `الوقت المتوقع: حوالي ${estimatedSeconds.toFixed(1)} ثوانٍ`
				: `الوقت المستغرق: ${elapsedSeconds.toFixed(1)} ثانية`;

		// Switch to analysis phase at halfway point + random variation
		const analysisThreshold = (estimatedSeconds * 1000) / 2 + Math.random() * 1000;
		if (elapsed > analysisThreshold && statusText === STATUS_MESSAGES.initial) {
			statusText = STATUS_MESSAGES.analyzing;
		}
	}

	function startProgress(): void {
		if (isLoading) return;

		isLoading = true;
		startTime = Date.now();
		statusText = STATUS_MESSAGES.initial;
		timeEstimate = `الوقت المتوقع: حوالي ${estimatedSeconds.toFixed(1)} ثوانٍ`;

		progressInterval = setInterval(updateTimeEstimate, 100);
	}

	function stopProgress(): void {
		if (progressInterval) {
			clearInterval(progressInterval);
			progressInterval = undefined;
		}
		isLoading = false;
	}

	function resetToInitialState(): void {
		showLoader = false;
		fullBar = false;
		statusText = STATUS_MESSAGES.initial;
		timeEstimate = `الوقت المتوقع: حوالي ${estimatedSeconds.toFixed(1)} ثوانٍ`;
		stopProgress();
	}

	// Main effect to handle status changes
	$effect(() => {
		switch (status) {
			case 'loading':
				showLoader = true;
				startProgress();
				break;

			case 'success':
			case 'error':
				stopProgress();
				statusText = STATUS_MESSAGES.completed;
				timeEstimate = `الوقت المتوقع: حوالي ${estimatedSeconds.toFixed(1)} ثوانٍ`;
				fullBar = true;
				break;

			case 'idle':
				resetToInitialState();
				break;
		}
	});

	// Cleanup on component destroy
	onDestroy(() => {
		stopProgress();
	});
</script>

{#if showLoader}
	<div class="loader" in:fade={{ duration: 200 }}>
		<div class="loader__content">
			<!-- Bouncing dots indicator -->
			<div class="loader__dots">
				{#each Array(3) as _, i}
					<div class="loader__dot" style="--delay: {i * 0.2}s"></div>
				{/each}
			</div>

			<!-- Status text with smooth transitions -->
			<div class="loader__status">
				{#key statusText}
					<span
						class="loader__status-text"
						in:fade={{ delay: 100, duration: 150 }}
						out:fade={{ duration: 100 }}
					>
						{statusText}
					</span>
				{/key}
			</div>

			<!-- Time estimate -->
			<div class="loader__time">
				{timeEstimate}
			</div>
		</div>

		<!-- Progress bar -->
		<div class="loader__progress">
			<div class="loader__progress-bar" class:loader__progress-bar--complete={fullBar}></div>
		</div>
	</div>
{/if}

<style>
	.loader {
		width: 320px;
		margin: 3rem auto;
		text-align: center;
	}

	.loader__content {
		margin-bottom: 1.5rem;
	}

	.loader__dots {
		display: flex;
		justify-content: center;
		gap: 6px;
		margin-bottom: 8px;
		height: 24px;
		align-items: center;
	}

	.loader__dot {
		width: 8px;
		height: 8px;
		background-color: var(--color-blue-500, #3b82f6);
		border-radius: 50%;
		animation: bounce 1.2s infinite ease-in-out;
		animation-delay: var(--delay);
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: translateY(0);
			opacity: 0.8;
		}
		40% {
			transform: translateY(-12px);
			opacity: 1;
		}
	}

	.loader__status {
		position: relative;
		height: 1.6em;
		margin-bottom: 4px;
	}

	.loader__status-text {
		position: absolute;
		inset: 0;
		font-weight: 500;
		font-size: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loader__time {
		font-size: 13px;
		opacity: 0.7;
		color: var(--color-text-secondary, currentColor);
	}

	.loader__progress {
		height: 6px;
		background-color: var(--color-progress-bg, rgba(59, 130, 246, 0.1));
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}

	.loader__progress-bar {
		width: 45%;
		height: 100%;
		background-color: var(--color-blue-500, #3b82f6);
		border-radius: 3px;
		position: absolute;
		animation:
			travel 2s ease-in-out infinite,
			pulse 1.5s ease-in-out infinite;
		transition: all 300ms ease;
	}

	.loader__progress-bar--complete {
		width: 100%;
		background-color: var(--color-emerald-500, #10b981);
		animation: none;
	}

	@keyframes travel {
		0% {
			right: -35%;
		}
		70%,
		100% {
			right: 120%;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.8;
		}
		50% {
			opacity: 1;
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.loader__dot {
			animation-duration: 2s;
		}

		.loader__progress-bar {
			animation-duration: 3s;
		}
	}
</style>

<script lang="ts">
	import { fade } from 'svelte/transition';

	let {
		status = 'idle',
		estimatedSeconds = 5
	}: {
		status?: 'idle' | 'loading' | 'success' | 'error';
		estimatedSeconds?: number;
	} = $props();

	let showLoader = $state(status != 'idle');
	let statusText = $state('جاري إجراء الاختبارات...');
	let timeEstimate = $state(`الوقت المتوقع: حوالي ${estimatedSeconds} ثوانٍ`);
	let progressInterval: ReturnType<typeof setInterval> | undefined = $state();
	let fullBar = $state(false);

	function startFakeProgress(): void {
		const startTime: number = Date.now();
		timeEstimate = `الوقت المتوقع: حوالي ${estimatedSeconds.toFixed(1)} ثوانٍ`;

		progressInterval = setInterval(() => {
			const elapsed: number = Date.now() - startTime;
			const elapsedSeconds: number = elapsed / 1000;

			timeEstimate =
				elapsed < 1500
					? `الوقت المتوقع: حوالي ${estimatedSeconds.toFixed(1)} ثوانٍ`
					: `الوقت المستغرق: ${elapsedSeconds.toFixed(1)} ثانية`;

			// when half estimated time pass + random second for variation
			if (elapsed > (estimatedSeconds * 1000) / 2 + Math.random() * 1000) {
				statusText = 'تحليل النتائج...';
			}
		}, 100);
	}

	$effect(() => {
		switch (status) {
			case 'loading':
				showLoader = true;
				startFakeProgress();
				break;
			case 'success':
			case 'error':
				clearInterval(progressInterval);
				statusText = 'تم إنهاء العملية';
				fullBar = true;
				break;
			case 'idle':
				showLoader = false;
				fullBar = false;
				statusText = 'جاري إجراء الاختبارات...';
				break;
		}
	});
</script>

{#if showLoader}
	<div class="advanced-loader" in:fade>
		<div class="loading-status">
			<div class="bouncing-dots">
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dot"></div>
			</div>
			<div class="status-text">
				{#key statusText}
					<span in:fade={{ delay: 100, duration: 100 }} out:fade={{ duration: 100 }}>
						{statusText}</span
					>
				{/key}
			</div>
			<div class="time-estimate">
				{timeEstimate}
			</div>
		</div>
		<div class="smooth-progress">
			<div class="progress-track" class:full-bar={fullBar}></div>
		</div>
	</div>
{/if}

<style>
	.advanced-loader {
		width: 320px;
		margin: 3rem auto;
		text-align: center;
	}

	.loading-status {
		margin-bottom: 1.5rem;
	}

	.bouncing-dots {
		display: flex;
		justify-content: center;
		gap: 6px;
		margin-bottom: 8px;
		height: 24px;
	}

	.dot {
		width: 8px;
		height: 8px;
		background: var(--color-blue-500);
		border-radius: 50%;
		animation: bounce 1.2s infinite ease-in-out;
	}

	.dot:nth-child(2) {
		animation-delay: 0.2s;
	}
	.dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-12px);
		}
	}

	.status-text {
		font-weight: 500;
		font-size: 15px;
		margin-bottom: 4px;
		position: relative;
		height: 1.6em;
	}

	.status-text span {
		position: absolute;
		inset: 0;
	}

	.time-estimate {
		font-size: 13px;
		opacity: 0.9;
	}

	.smooth-progress {
		height: 6px;
		background: rgba(127, 127, 213, 0.1);
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}

	.progress-track {
		width: 45%;
		height: 100%;
		background: var(--color-blue-500);
		border-radius: 3px;
		position: absolute;
		animation:
			travel 2s ease-in-out infinite,
			pulse 1.5s ease-in-out infinite;
		transform-origin: right;
		transition: 200ms ease;
	}
	.full-bar {
		width: 100%;
		animation: none;
		background: var(--color-emerald-500);
	}

	@keyframes travel {
		0% {
			right: -35%;
		}
		70% {
			right: 120%;
		}
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
</style>

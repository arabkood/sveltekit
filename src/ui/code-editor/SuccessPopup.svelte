<script lang="ts">
	import { scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import Button from '$ui/common/Button.svelte';
	import type { Sound } from '$utils/sound';

	let {
		visible = false,
		onClose = () => {},
		nextHref,
		score = 100,
		message = 'لقد اجتزت جميع الاختبارات بنجاح',
		sound
	} = $props<{
		visible: boolean;
		onClose: () => void;
		nextHref?: string;
		score?: number;
		message?: string;
		sound?: Sound;
	}>();

	let showConfetti = $state(false);
	let scoreCount = $state(0);

	$effect(() => {
		if (visible && sound) {
			sound.play();
		}
	});

	// Reactive effect to trigger animations
	$effect(() => {
		if (visible) {
			// Stagger confetti and score count-up
			setTimeout(() => {
				showConfetti = true;
				// Animate score count-up
				const duration = 1500; // 1.5 seconds
				const startTime = performance.now();

				function animateScore(currentTime: number) {
					const elapsedTime = currentTime - startTime;
					const progress = Math.min(elapsedTime / duration, 1);
					scoreCount = Math.floor(progress * score);

					if (progress < 1) {
						requestAnimationFrame(animateScore);
					}
				}

				requestAnimationFrame(animateScore);
			}, 700);
		} else {
			// Reset when hiding
			showConfetti = false;
			scoreCount = 0;
		}
	});
</script>

{#if visible}
	<div class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
		<button
			type="button"
			class="absolute inset-0 bg-white/10 backdrop-blur-sm dark:bg-black/30"
			aria-label="close"
			onclick={onClose}
		></button>
		<div
			class="relative mx-4 w-full max-w-md p-8 text-center"
			in:scale={{ delay: 200, duration: 800, easing: elasticOut, start: 0.7 }}
		>
			<div class="celebration-animation mb-6">
				<div class="celebration-container">
					<!-- Explosion circles -->
					<div class="explosion-circle explosion-circle-1"></div>
					<div class="explosion-circle explosion-circle-2"></div>
					<div class="explosion-circle explosion-circle-3"></div>

					<!-- Pulse circles -->
					<div class="pulse-circle pulse-circle-1"></div>
					<div class="pulse-circle pulse-circle-2"></div>
					<div class="pulse-circle pulse-circle-3"></div>

					<!-- Stars -->
					<svg class="star star-1" width="30" height="30" viewBox="0 0 24 24">
						<polygon fill="#FFD700" points="12,0 15,9 24,9 18,15 21,24 12,18 3,24 6,15 0,9 9,9"
						></polygon>
					</svg>
					<svg class="star star-2" width="40" height="40" viewBox="0 0 24 24">
						<polygon fill="#FFD700" points="12,0 15,9 24,9 18,15 21,24 12,18 3,24 6,15 0,9 9,9"
						></polygon>
					</svg>
					<svg class="star star-3" width="25" height="25" viewBox="0 0 24 24">
						<polygon fill="#FFD700" points="12,0 15,9 24,9 18,15 21,24 12,18 3,24 6,15 0,9 9,9"
						></polygon>
					</svg>
					<svg class="star star-4" width="35" height="35" viewBox="0 0 24 24">
						<polygon fill="#FFD700" points="12,0 15,9 24,9 18,15 21,24 12,18 3,24 6,15 0,9 9,9"
						></polygon>
					</svg>
					<svg class="star star-5" width="20" height="20" viewBox="0 0 24 24">
						<polygon fill="#FFD700" points="12,0 15,9 24,9 18,15 21,24 12,18 3,24 6,15 0,9 9,9"
						></polygon>
					</svg>

					<!-- Success icon -->
					<div class="relative z-10 flex h-full items-center justify-center">
						<svg width="130" height="130" viewBox="0 0 130 130" class="jelly-animation mx-auto">
							<!-- Main circle with gradient fill -->
							<defs>
								<linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stop-color="var(--color-emerald-100)" />
									<stop offset="60%" stop-color="var(--color-emerald-500)" />
									<stop offset="100%" stop-color="var(--color-emerald-700)" />
								</linearGradient>
								<filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
									<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
									<feOffset in="blur" dx="0" dy="1" result="offsetBlur" />
									<feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
								</filter>
							</defs>

							<!-- Outer glow ring -->
							<circle
								cx="65"
								cy="65"
								r="60"
								fill="none"
								class="stroke-emerald-500/50"
								stroke-width="3"
								opacity="0"
							>
								<animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze" />
								<animate attributeName="r" from="55" to="60" dur="1.5s" repeatCount="indefinite" />
								<animate
									attributeName="opacity"
									from="1"
									to="0"
									dur="1.5s"
									repeatCount="indefinite"
								/>
							</circle>

							<!-- Main circle -->
							<circle
								cx="65"
								cy="65"
								r="55"
								fill="url(#successGradient)"
								stroke="#10B981"
								stroke-width="3"
								opacity="0"
								filter="url(#innerShadow)"
							>
								<animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" />
							</circle>

							<!-- Checkmark -->
							<path
								d="M45 65L60 80L90 50"
								fill="none"
								stroke="white"
								stroke-width="7"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-dasharray="100"
								stroke-dashoffset="100"
							>
								<animate
									attributeName="stroke-dashoffset"
									from="100"
									to="0"
									dur="0.7s"
									begin="0.3s"
									fill="freeze"
								/>
							</path>
						</svg>

						<div class="shine-effect"></div>
					</div>

					<!-- Confetti -->
					{#if showConfetti}
						{#each Array(20) as _, i}
							<div
								class="confetti"
								style:--tx="{-50 + Math.random() * 100}px"
								style:--ty="{50 + Math.random() * 150}px"
								style:--tr="{Math.random() * 360}deg"
								style:--size="{5 + Math.random() * 8}px"
								style:--delay="{Math.random() * 0.5}s"
								style:--duration="{1.3 + Math.random() * 1}s"
								style:--color="var(--confetti-color-{i % 7})"
							></div>
						{/each}
					{/if}
				</div>
			</div>

			<!-- Success message -->
			<div class="message-animation">
				<h2
					class="mb-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 bg-clip-text text-3xl leading-10 font-bold text-transparent"
				>
					نجاح رائع!
				</h2>
				<p class="mb-3 text-lg">{message}</p>
				<div class="score-container">
					<div class="score text-3xl font-bold text-amber-500 dark:text-amber-400">
						{scoreCount} XP
					</div>
				</div>
			</div>

			<div class="mt-6 flex justify-center gap-4">
				{#if nextHref}
					<Button href={nextHref} onclick={onClose} endIcon="arrow-left">التالي</Button>
				{/if}
			</div>
		</div>
	</div>
	{#each Array(10) as _, i}
		<div
			class="floating-emoji"
			style="--emoji-top: {Math.random() * 100}%; --emoji-left: {Math.random() * 100}%;"
		>
			<svg class="star star-5" width="20" height="20" viewBox="0 0 24 24">
				<polygon fill="#FFD700" points="12,0 15,9 24,9 18,15 21,24 12,18 3,24 6,15 0,9 9,9"
				></polygon>
			</svg>
		</div>
	{/each}
{/if}

<style>
	:root {
		--confetti-color-0: var(--color-yellow-400);
		--confetti-color-1: var(--color-blue-500);
		--confetti-color-2: var(--color-pink-500);
		--confetti-color-3: var(--color-purple-500);
		--confetti-color-4: var(--color-green-500);
		--confetti-color-5: var(--color-red-500);
		--confetti-color-6: var(--color-indigo-500);
	}
	/* Base animation container */
	.celebration-container {
		position: relative;
		height: 200px;
		width: 200px;
		margin: 0 auto;
	}

	.floating-emoji {
		position: absolute;
		z-index: 1000;
		top: var(--emoji-top);
		left: var(--emoji-left);
		font-size: 1.5rem;
		animation: floatEmoji 4s ease-in-out infinite alternate;
		opacity: 0.7;
	}

	@keyframes floatEmoji {
		from {
			transform: translateY(0) scale(1);
		}
		to {
			transform: translateY(-20px) scale(1.1);
		}
	}

	/* Explosion effects with more dynamic timing */
	@keyframes explode {
		0% {
			transform: scale(0);
			opacity: 0.8;
		}
		60% {
			transform: scale(1.5);
			opacity: 0.6;
		}
		100% {
			transform: scale(2.2);
			opacity: 0;
		}
	}

	.explosion-circle {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		opacity: 0;
	}

	.explosion-circle-1 {
		background: radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0.1) 70%);
		animation: explode 1.2s ease-out 0.6s forwards;
	}

	.explosion-circle-2 {
		background: radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0.1) 70%);
		animation: explode 1.4s ease-out 0.8s forwards;
	}

	.explosion-circle-3 {
		background: radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0.1) 70%);
		animation: explode 1.6s ease-out 1s forwards;
	}

	/* Enhanced circle pulse animations */
	@keyframes circlePulse {
		0% {
			transform: scale(0) translate(-50%, -50%);
			opacity: 0.7;
		}
		50% {
			transform: scale(0.9) translate(-50%, -50%);
			opacity: 0.4;
		}
		100% {
			transform: scale(1.5) translate(-50%, -50%);
			opacity: 0;
		}
	}

	.pulse-circle {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		transform-origin: 0 0;
		opacity: 0;
	}

	.pulse-circle-1 {
		background: radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0) 70%);
		animation: circlePulse 2s ease-out 0.4s infinite;
	}

	.pulse-circle-2 {
		background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0) 70%);
		animation: circlePulse 2s ease-out 1s infinite;
	}

	.pulse-circle-3 {
		background: radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0) 70%);
		animation: circlePulse 2s ease-out 1.6s infinite;
	}

	/* Enhanced star animations */
	@keyframes starSpin {
		from {
			transform: rotate(0deg) scale(0);
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
		to {
			transform: rotate(360deg) scale(1);
			opacity: 0;
		}
	}

	.star {
		position: absolute;
		opacity: 0;
		filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.8));
	}

	.star-1 {
		top: 25%;
		left: 20%;
		animation: starSpin 1.7s ease-out 0.7s forwards;
	}

	.star-2 {
		top: 30%;
		left: 70%;
		animation: starSpin 1.9s ease-out 0.9s forwards;
	}

	.star-3 {
		top: 65%;
		left: 30%;
		animation: starSpin 1.6s ease-out 1.1s forwards;
	}

	.star-4 {
		top: 60%;
		left: 75%;
		animation: starSpin 1.8s ease-out 1.3s forwards;
	}

	.star-5 {
		top: 15%;
		left: 50%;
		animation: starSpin 1.5s ease-out 1.5s forwards;
	}

	/* Enhanced jelly animation for the success icon */
	@keyframes jelly {
		0% {
			transform: scale(1);
		}
		15% {
			transform: scale(1.25, 0.75);
		}
		30% {
			transform: scale(0.85, 1.15);
		}
		45% {
			transform: scale(1.1, 0.9);
		}
		65% {
			transform: scale(0.95, 1.05);
		}
		85% {
			transform: scale(1.02, 0.98);
		}
		100% {
			transform: scale(1);
		}
	}

	.jelly-animation {
		animation: jelly 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards;
	}

	/* Enhanced shine effect */
	@keyframes shine {
		0% {
			background-position: -200px;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		60% {
			background-position: 400px;
			opacity: 1;
		}
		100% {
			background-position: 400px;
			opacity: 0;
		}
	}

	.shine-effect {
		position: absolute;
		inset: 0;
		background-size: 200px 100%;
		background-repeat: no-repeat;
		animation: shine 2s linear 1.5s;
	}

	/* Enhanced confetti animation */
	@keyframes confettiFall {
		0% {
			transform: translateY(-30px) translateX(0) rotate(0deg);
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		100% {
			transform: translateY(var(--ty)) translateX(var(--tx)) rotate(var(--tr));
			opacity: 0;
		}
	}

	.confetti {
		position: absolute;
		width: var(--size, 8px);
		height: var(--size, 8px);
		opacity: 0;
		top: 40%;
		left: 50%;
		border-radius: 2px;
		background-color: var(--color);
		animation: confettiFall var(--duration, 1.5s) ease-out var(--delay, 0s) forwards;
	}

	/* Enhanced score counter animation */
	@keyframes countUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.score-container {
		height: 40px;
		position: relative;
		overflow: hidden;
		margin-bottom: 10px;
	}

	.score {
		position: relative;
		opacity: 0;
		animation: countUp 0.5s ease-out 1.2s forwards;
	}

	.score:before {
		content: '+';
	}

	/* Enhanced message animation */
	@keyframes messageAppear {
		0% {
			transform: translateY(20px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.message-animation {
		opacity: 0;
		animation: messageAppear 0.6s ease-out 0.6s forwards;
	}
</style>

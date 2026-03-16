<script lang="ts">
	import Button from '$ui/common/Button.svelte';
	import type { Sound } from '$utils/sound';
	import { cubicOut, elasticOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import { scale, fly } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import Icon from '$ui/common/Icon.svelte';

	let {
		onClose,
		nextHref,
		score = 100,
		title = 'ممتاز!',
		message = 'لقد أكملتَ هذا الدرس بنجاح',
		continueButtonText = 'متابعة',
		courseTitle,
		sound
	} = $props<{
		onClose?: () => void;
		nextHref?: string;
		score?: number;
		title?: string;
		message?: string;
		continueButtonText?: string;
		sound?: Sound;
		courseTitle?: string;
	}>();

	let canvas: HTMLCanvasElement;
	let scoreAnimationComplete = $state(false);
	let animationFrame: number;
	let copied = $state(false); // State for copy-to-clipboard feedback

	const scoreCount = new Tween(0, {
		delay: 600,
		duration: 1200,
		easing: cubicOut
	});

	$effect(() => {
		scoreCount.set(score);
	});

	$effect(() => {
		if (scoreCount.current === score && score > 0) {
			setTimeout(() => {
				scoreAnimationComplete = true;
			}, 50);
		}
	});

	onMount(() => {
		if (!browser) return;
		sound?.play();

		const ctx = canvas?.getContext('2d');
		if (!canvas || !ctx) return;

		let { width, height } = canvas.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		ctx.scale(dpr, dpr);

		const particles: any[] = [];
		const particleCount = 150;
		const colors = ['#fde047', '#f472b6', '#a3e635', '#60a5fa', '#ffffff'];
		const shapes = ['rect', 'circle'];

		const createParticles = () => {
			const centerX = width / 2;
			const centerY = height * 0.3;
			for (let i = 0; i < particleCount; i++) {
				const angle = Math.random() * Math.PI * 2;
				particles.push({
					x: centerX,
					y: centerY,
					angle: angle,
					speed: Math.random() * 8 + 4, // Burst speed
					velocityY: -Math.random() * 10 - 5, // Upward velocity
					friction: 0.98,
					gravity: 0.35,
					decay: Math.random() * 0.01 + 0.005,
					alpha: 1,
					color: colors[Math.floor(Math.random() * colors.length)],
					shape: shapes[Math.floor(Math.random() * shapes.length)],
					size: Math.random() * 8 + 4,
					rotation: Math.random() * Math.PI * 2,
					rotationSpeed: (Math.random() - 0.5) * 0.4
				});
			}
		};

		const drawParticle = (p: any) => {
			ctx.fillStyle = p.color;
			ctx.globalAlpha = p.alpha;
			ctx.save();
			ctx.translate(p.x, p.y);
			ctx.rotate(p.rotation);

			if (p.shape === 'rect') {
				ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
			} else {
				ctx.beginPath();
				ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.restore();
		};

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];

				p.speed *= p.friction;
				p.velocityY += p.gravity;
				p.x += Math.cos(p.angle) * p.speed;
				p.y += p.velocityY;
				p.rotation += p.rotationSpeed;
				p.alpha -= p.decay;

				if (p.alpha <= 0) {
					particles.splice(i, 1);
				} else {
					drawParticle(p);
				}
			}

			animationFrame = requestAnimationFrame(animate);
			if (particles.length === 0) {
				cancelAnimationFrame(animationFrame);
			}
		};

		setTimeout(() => {
			createParticles();
			if (particles.length > 0) {
				animate();
			}
		}, 400);
	});

	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') onClose?.();
	};

	const mainModalTransition = (node: Element, { delay = 0, duration = 400 }) => {
		return {
			delay,
			duration,
			css: (t: number) => {
				const eased = cubicOut(t);
				return `
                    opacity: ${eased};
                    transform: scale(${0.8 + eased * 0.2});
                `;
			}
		};
	};

	const handleShare = async () => {
		if (!browser) return;

		// 1. Create a more engaging share text
		const shareTextTemplate = `أنجزتُ تحديًا في {title} وحصلت على +{score} نقطة خبرة 💡! تعلّم البرمجة معي وجرّب أن تتفوق علي. هل تقدر؟ 😉`;
		let shareText = shareTextTemplate.replace('{score}', String(Math.round(score)));
		if (courseTitle) {
			shareText = shareText.replace('{title}', '"' + courseTitle + '"');
		} else {
			shareText = shareText.replace('{title}', 'أكود');
		}

		// 2. Get the current URL and add a referral parameter
		const url = new URL(window.location.href);
		url.searchParams.set('ref', 'success-share');
		const shareUrl = url.toString();

		// 3. Use Web Share API if available (mobile)
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'إنجاز جديد!',
					text: shareText,
					url: shareUrl
				});
			} catch (error) {
				console.log('Share was cancelled or failed', error);
			}
		} else {
			// 4. Fallback to copying to clipboard (desktop)
			try {
				await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
				copied = true;
				setTimeout(() => {
					copied = false;
				}, 2000); // Show "Copied!" for 2 seconds
			} catch (error) {
				console.error('Failed to copy to clipboard', error);
				alert('لم نتمكن من نسخ الرابط. الرجاء نسخه يدويًا.');
			}
		}
	};
</script>

<svelte:window on:keydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
	role="dialog"
	aria-modal="true"
	aria-labelledby="success-title"
>
	<div
		class="absolute inset-0 bg-white/10 backdrop-blur-sm dark:bg-black/50"
		role="button"
		tabindex="-1"
		aria-label="Close dialog"
	></div>

	<div
		dir="rtl"
		class="relative z-20 mx-4 flex w-full max-w-sm flex-col items-center rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-gray-800"
		in:mainModalTransition={{ duration: 500 }}
		out:mainModalTransition={{ duration: 500 }}
	>
		<canvas
			bind:this={canvas}
			class="pointer-events-none absolute inset-0 z-10 h-full w-full"
			aria-hidden="true"
		></canvas>
		<div class="relative z-20 flex w-full flex-col items-center">
			<div
				in:scale={{ delay: 200, duration: 600, easing: elasticOut, start: 0.5 }}
				class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-lime-200 bg-gradient-to-br from-lime-400 to-lime-500 shadow-lg shadow-lime-500/40 dark:border-lime-700/50 dark:shadow-lime-800/50"
			>
				<svg
					class="h-14 w-14 text-white"
					fill="none"
					stroke="currentColor"
					stroke-width="5"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" class="sppath" />
				</svg>
			</div>

			<div class="mb-3" in:fly={{ y: 20, delay: 500, duration: 500, easing: cubicOut }}>
				<div dir="ltr" class="flex items-baseline justify-center">
					<span
						class="text-5xl font-bold text-amber-500 dark:text-amber-400"
						class:score-pop={scoreAnimationComplete}
					>
						+{String(Math.round(scoreCount.current))}
					</span>
					<span class="ml-1.5 text-xl font-semibold text-amber-500/80 dark:text-amber-400/80"
						>XP</span
					>
				</div>
			</div>

			<h1
				id="success-title"
				class="text-3xl font-bold text-gray-800 dark:text-gray-100"
				in:fly={{ y: 20, delay: 700, duration: 500, easing: cubicOut }}
			>
				{title}
			</h1>

			<p
				class="mt-2 text-lg text-gray-600 dark:text-gray-300"
				in:fly={{ y: 20, delay: 800, duration: 500, easing: cubicOut }}
			>
				{message}
			</p>

			<div
				class="mt-8 w-full space-y-3"
				in:fly={{ y: 20, delay: 900, duration: 500, easing: cubicOut }}
			>
				<!-- Primary Button -->
				<Button
					size="lg"
					fullWidth={true}
					href={nextHref}
					onclick={onClose}
					variant="continue"
					class="transform transition-transform duration-150 ease-in-out hover:scale-[1.03] active:scale-[0.98]"
					data-sveltekit-reload
				>
					{continueButtonText}
				</Button>

				<Button
					size="md"
					fullWidth={true}
					onclick={handleShare}
					variant="link"
					class="mt-2 ring-0!"
				>
					{#if copied}
						<span class="flex items-center gap-2">
							<Icon name="check" size={20} />
							تم النسخ!
						</span>
					{:else}
						<span class="flex items-center gap-2">
							<Icon name="share" size={20} />
							شارك الإنجاز
						</span>
					{/if}
				</Button>
			</div>
		</div>
	</div>
</div>

<style>
	.sppath {
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		animation: draw 0.8s cubic-bezier(0.65, 0, 0.35, 1) 0.5s forwards;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	.score-pop {
		animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}
	@keyframes pop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.15);
		}
		100% {
			transform: scale(1);
		}
	}
</style>

<script lang="ts">
	import Button from '$ui/common/Button.svelte';
	import type { Sound } from '$utils/sound';
	import { cubicOut, elasticOut } from 'svelte/easing';
	import { scale, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let {
		onRetry,
		onContinue,
		retryHref,
		continueHref,
		title = 'لا تستسلم!',
		message = 'الأخطاء جزء من التعلم، كل خطأ يجعلك أقوى وأكثر معرفة',
		retryButtonText = 'حاول مرة أخرى',
		continueButtonText = 'تخطي',
		sound
	} = $props<{
		onRetry?: () => void;
		onContinue?: () => void;
		retryHref?: string;
		continueHref?: string;
		title?: string;
		message?: string;
		retryButtonText?: string;
		continueButtonText?: string;
		sound?: Sound;
	}>();

	onMount(() => {
		if (!browser) return;
		sound?.play();
	});

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
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
	role="dialog"
	aria-modal="true"
	aria-labelledby="failure-title"
>
	<div class="absolute inset-0 bg-white/10 backdrop-blur-sm dark:bg-black/50"></div>

	<div
		dir="rtl"
		class="relative z-20 mx-4 flex w-full max-w-sm flex-col items-center rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-gray-800"
		in:mainModalTransition={{ duration: 500 }}
		out:mainModalTransition={{ duration: 500 }}
	>
		<div class="relative z-20 flex w-full flex-col items-center">
			<div
				in:scale={{ delay: 200, duration: 600, easing: elasticOut, start: 0.5 }}
				class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-orange-200 bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/40 dark:border-orange-700/50 dark:shadow-orange-800/50"
			>
				<svg
					class="h-12 w-12 text-white"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
						class="warning-path"
					/>
				</svg>
			</div>

			<h1
				id="failure-title"
				class="text-3xl font-bold text-gray-800 dark:text-gray-100"
				in:fly={{ y: 20, delay: 500, duration: 500, easing: cubicOut }}
			>
				{title}
			</h1>

			<p
				class="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-300"
				in:fly={{ y: 20, delay: 600, duration: 500, easing: cubicOut }}
			>
				{message}
			</p>

			<div
				class="mt-8 flex w-full flex-col gap-3"
				in:fly={{ y: 20, delay: 700, duration: 500, easing: cubicOut }}
			>
				<!-- Primary action - Retry -->
				<Button
					size="lg"
					fullWidth={true}
					href={retryHref}
					onclick={onRetry}
					variant="fire"
					class="transform bg-gradient-to-r from-orange-500 to-amber-500 transition-transform duration-150 ease-in-out hover:scale-[1.03] hover:from-orange-600 hover:to-amber-600 active:scale-[0.98]"
					data-sveltekit-reload
				>
					{retryButtonText}
				</Button>

				<!-- Secondary action - Continue -->
				<Button
					size="md"
					fullWidth={true}
					href={continueHref}
					onclick={onContinue}
					variant="ghost"
					class="transform text-gray-600 transition-all duration-150 ease-in-out hover:scale-[1.02] hover:bg-gray-100 hover:text-gray-800 active:scale-[0.98] dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200"
					data-sveltekit-reload
				>
					{continueButtonText}
				</Button>
			</div>
		</div>
	</div>
</div>

<style>
	.warning-path {
		stroke-dasharray: 120;
		stroke-dashoffset: 120;
		animation: gentle-draw 1s cubic-bezier(0.65, 0, 0.35, 1) 0.3s forwards;
	}

	@keyframes gentle-draw {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>

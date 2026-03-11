<script lang="ts">
	import { browser } from '$app/environment';
	import success_wav from '$assets/correct.wav';
	import fail_wav from '$assets/fail.wav';
	import { i18n } from '$i18n/i18n';
	import type { FillQuestion } from '$types/lesson';
	import Button from '$ui/common/Button.svelte';
	import Fill from '$ui/lesson/fill/Fill.svelte';
	import { Sound } from '$utils/sound';

	const sampleStep: FillQuestion = {
		type: 'fill',
		lang: 'python',
		question: 'أكمل الكود لطباعة رسالة ترحيب شخصية',
		code: `def welcome_user(name):
    @@INPUT@@ = "أهلاً وسهلاً " + @@INPUT@@
    return message

user_name = "أحمد"
greeting = @@INPUT@@(user_name)
print(greeting)`,
		solution: ['message', 'name', 'welcome_user']
	};

	let answer = $state<string[]>([]);

	const successPlayer = browser
		? new Sound([success_wav], { fadeInDuration: 0, volume: 0.5, preload: true })
		: undefined;

	const failPlayer = browser
		? new Sound([fail_wav], { fadeInDuration: 0, volume: 0.6, preload: true })
		: undefined;

	const handleNext = () => {
		document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
	};
</script>

<section class="relative bg-white text-gray-950 dark:bg-gray-950 dark:text-white">
	<div
		class="relative mx-auto flex max-w-7xl flex-col border-x border-b border-black/10 lg:min-h-240 lg:flex-row dark:border-white/10"
	>
		<div
			aria-hidden="true"
			class="bg-primary-500/10 -lg:translate-x-1/2 pointer-events-none absolute top-1/2 left-1/2 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[80px] sm:h-100 sm:w-100 lg:left-1/4 lg:h-150 lg:w-150 lg:blur-[120px]"
		></div>

		<div
			class="flex w-full flex-col justify-center border-b border-black/10 p-6 text-center backdrop-blur-sm sm:p-20 lg:w-1/2 lg:border-b-0 lg:p-16 lg:text-start dark:border-white/10"
		>
			<div
				class="mx-auto my-auto flex max-w-lg flex-col items-center lg:mx-0 lg:max-w-none lg:items-start"
			>
				<h1 class="text-[clamp(2.5rem,8vw,6rem)] leading-tight font-bold">
					تعلم البرمجة بالممارسة
				</h1>
				<p
					class="mt-6 max-w-md text-base leading-relaxed text-gray-600 sm:text-lg lg:mt-8 lg:text-xl dark:text-gray-500"
				>
					الطريقة الأكثر متعة وسهولة لتعلم البرمجة وممارستها.
				</p>
				<Button href="/signup" rounded variant="attention" size="lg" class="mt-6">
					{i18n.t('navigation.signup')}
				</Button>
			</div>
		</div>

		<div
			class="relative flex w-full flex-col items-center justify-center border-black/10 bg-gray-900 p-4 sm:p-6 lg:w-1/2 lg:border-r lg:p-12 dark:border-white/10"
		>
			<span class="corners-t text-gray-400"></span>
			<span class="corners-b z-10 text-gray-400 [--corner-offset:1px]"></span>

			<div
				aria-hidden="true"
				class="pointer-events-none absolute inset-0 right-0 left-0 z-0
  bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)]
  bg-size-[32px_32px] opacity-40
  [--grid-color:var(--color-gray-100)]
  dark:[--grid-color:var(--color-gray-950)]"
			></div>

			<div
				class="group relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-black/10 bg-gray-50 shadow-2xl dark:border-white/10 dark:bg-gray-950/40"
			>
				<div
					class="flex flex-row-reverse items-center gap-3 border-b border-black/10 px-4 py-2 sm:gap-4 sm:px-8 sm:py-3 dark:border-white/10"
				>
					<div class="flex gap-1.5 sm:gap-2" aria-hidden="true">
						<div class="h-2.5 w-2.5 rounded-full bg-red-400 sm:h-3 sm:w-3"></div>
						<div class="h-2.5 w-2.5 rounded-full bg-yellow-400 sm:h-3 sm:w-3"></div>
						<div class="h-2.5 w-2.5 rounded-full bg-green-400 sm:h-3 sm:w-3"></div>
					</div>

					<span
						class="font-mono text-[10px] tracking-wider text-black/40 sm:text-xs dark:text-white/40"
					>
						challenge_01.py
					</span>
				</div>

				<div class="relative flex min-h-75 bg-white sm:min-h-100 lg:min-h-110 dark:bg-gray-800">
					<Fill {successPlayer} {failPlayer} onNext={handleNext} step={sampleStep} bind:answer />
				</div>
			</div>
		</div>
	</div>
</section>

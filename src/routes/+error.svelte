<!-- src/routes/+error.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import Button from '$ui/common/Button.svelte';
	import Logo from '$ui/common/Logo.svelte';

	// Dynamic Arabic titles for common HTTP errors
	const errorTitles: Record<number, string> = {
		404: 'الصفحة غير موجودة',
		500: 'خطأ في الخادم',
		403: 'الوصول مرفوض',
		401: 'غير مصرح بالدخول'
	};

	const status = $derived(page.status);
	const title = $derived(errorTitles[status] ?? 'حدث خطأ ما');
	const message = $derived(
		page.error?.message ?? 'عفواً، حدث خطأ غير متوقع. فريقنا يعمل على إصلاحه.'
	);

	const goBack = () => {
		history.back();
	};
</script>

<!-- The dir="rtl" attribute is crucial for correct Arabic layout -->
<div
	dir="rtl"
	class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950"
>
	<!-- Subtle background gradient with a touch of green -->
	<div
		class="absolute inset-0 bg-gradient-to-br from-white via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950/20"
	></div>

	<!-- Decorative background shapes using the new green theme -->
	<div
		class="absolute start-0 top-0 h-96 w-96 -translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br from-green-200 to-teal-300 opacity-20 blur-3xl dark:from-green-700 dark:to-teal-900 dark:opacity-30"
		aria-hidden="true"
	></div>
	<div
		class="absolute end-0 bottom-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-br from-lime-200 to-emerald-300 opacity-20 blur-3xl dark:from-lime-700 dark:to-emerald-900 dark:opacity-30"
		aria-hidden="true"
	></div>

	<main class="relative z-10 w-full max-w-2xl text-center" role="alert" aria-live="assertive">
		<!-- The main card with glassmorphism effect and green accents -->
		<div
			class="relative overflow-hidden rounded-3xl border border-gray-200/50 bg-white/70 p-8 pt-0 shadow-2xl shadow-green-200/30 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-gray-800/70 dark:shadow-black/50"
		>
			<!-- The massive, stylized error code with a green gradient -->
			<h1
				class="bg-gradient-to-br from-green-500 to-teal-600 bg-clip-text text-[120px] font-black tracking-tighter text-transparent sm:text-[160px] lg:text-[200px]"
				aria-label={`رمز الخطأ ${status}`}
			>
				{status}
			</h1>

			<!-- Human-readable Arabic title -->
			<h2
				class="-mt-4 text-2xl font-bold tracking-tight text-gray-800 sm:-mt-8 sm:text-3xl dark:text-gray-100"
			>
				{title}
			</h2>

			<!-- Helpful Arabic message -->
			<p class="mx-auto mt-4 max-w-md text-gray-600 dark:text-gray-400">
				{message}
			</p>

			<!-- Action Buttons, laid out correctly for RTL -->
			<div class="mt-10 grid grid-cols-2 gap-4 sm:flex-row">
				<Button onclick={goBack} variant="ghost" startIcon="arrow-right" class="w-full sm:w-auto">
					الرجوع
				</Button>
				<Button href="/" startIcon="home" variant="ghost" class="w-full sm:w-auto"
					>الصفحة للرئيسية</Button
				>
			</div>
		</div>

		<!-- Subtle branding at the bottom -->
		<div class="mt-12">
			<a
				href="/"
				aria-label="الذهاب للصفحة الرئيسية"
				class="group inline-block transition-transform duration-200 hover:scale-110 hover:rotate-4 active:scale-100"
			>
				<Logo
					variant="withText"
					size="md"
					class="opacity-50 transition-opacity group-hover:opacity-100"
				/>
			</a>
		</div>
	</main>
</div>

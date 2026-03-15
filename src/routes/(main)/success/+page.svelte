<script lang="ts">
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import Footer from '$ui/shared/Footer.svelte';

	import { page } from '$app/state';
	import { redirect } from '@sveltejs/kit';

	$effect(() => {
		if (!page.url.searchParams.get('checkout_id')) {
			throw redirect(308, '/');
		}
	});
</script>

<svelte:head>
	<title>تم الاشتراك بنجاح! | أكود برو</title>
	<meta
		name="description"
		content="شكراً لاشتراكك في أكود برو. أنت الآن جاهز لبدء رحلتك التعليمية المتقدمة."
	/>
</svelte:head>

<div class="bg-page flex min-h-screen flex-col">
	<main class="flex-grow">
		<div class="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32 lg:px-8">
			<!-- Animated Success Icon -->
			<div class="animate-in fade-in zoom-in-75 mb-8 duration-500">
				<div
					class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
				>
					<Icon name="check" class="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
				</div>
			</div>

			<!-- Main Heading -->
			<h1 class="mb-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl dark:text-white">
				تهانينا! أصبحت من أعضاء برو
			</h1>

			<!-- Sub-heading -->
			<p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-200">
				تم تفعيل اشتراكك في أكود برو بنجاح. أنت الآن تملك وصولاً كاملاً لكل الأدوات والميزات التي
				تحتاجها لتصبح محترفاً.
			</p>
			<p class="mx-auto mt-5 text-sm text-gray-500 dark:text-gray-500">
				يمكنك وقف الاشتراك في صفحة الاعدادات
			</p>

			<!-- Call-to-Action Buttons -->
			<div class="mt-10 flex items-center justify-center gap-x-6">
				<Button href="/courses">ابدأ التعلم الآن</Button>
			</div>
		</div>
	</main>
	<Footer />
</div>

<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
</script>

<section class="dark:bg-gray-950">
	<div
		class="relative mx-auto max-w-7xl border-x border-black/10 px-6 py-24 sm:py-32 lg:px-8 dark:border-t dark:border-white/10"
	>
		<span class="corners-t text-gray-400"></span>
		<span class="corners-b text-gray-400 [--corner-offset:1px]"></span>

		<!-- Header -->
		<div class="relative z-10 mx-auto max-w-2xl text-center">
			<h2 class="text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
				لماذا منصة أكوود؟
			</h2>
			<p class="mt-4 text-lg text-gray-500 dark:text-gray-400">
				التعلم الحقيقي يبدأ بالممارسة والتطبيق المباشر.
			</p>
		</div>

		<!-- Features Grid -->
		<div class="relative z-10 mx-auto mt-20 max-w-lg sm:max-w-none">
			<div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
				<div class="flex flex-col items-start">
					<div class="text-primary-500 mb-5">
						<Icon name="puzzle" size={32} strokeWidth={1.5} />
					</div>
					<h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-50">دروس تفاعلية</h3>
					<p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
						اكتشف الأخطاء ورتب الأكواد في تمارين مصممة لترسيخ المفاهيم بعيداً عن التنظير.
					</p>
				</div>

				<div class="flex flex-col items-start">
					<div class="text-primary-500 mb-5">
						<Icon name="terminal" size={32} strokeWidth={1.5} />
					</div>
					<h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-50">بيئة متكاملة</h3>
					<p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
						اكتب، اختبر، وتأكد من صحة كودك مباشرة من متصفحك عبر نظام الفحص الآلي.
					</p>
				</div>

				<div class="flex flex-col items-start">
					<div class="text-primary-500 mb-5">
						<Icon name="check-lock" size={32} strokeWidth={1.5} />
					</div>
					<h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-50">مسارات واضحة</h3>
					<p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
						خطة مدروسة تأخذك من الصفر وحتى بناء مشاريع حقيقية لتجنب التشتت.
					</p>
				</div>

				<div class="flex flex-col items-start">
					<div class="text-primary-500 mb-5">
						<Icon name="book-open" size={32} strokeWidth={1.5} />
					</div>
					<h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-50">محتوى عربي</h3>
					<p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
						شروحات مبسطة مصممة خصيصاً لكسر حاجز اللغة نهائياً للمتعلم العربي.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

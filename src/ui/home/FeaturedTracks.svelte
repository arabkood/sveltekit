<script>
	import { i18n } from '$i18n/i18n';
	import Button from '$ui/common/Button.svelte';
</script>

<section id="tracks" class="dark:bg-gray-950">
	<div
		class="relative mx-auto max-w-7xl border-x border-t border-black/10 px-6 py-24 sm:py-32 lg:px-8 dark:border-white/10"
	>
		<span class="corners-t text-gray-400 [--corner-offset:1px]"></span>
		<span class="corners-b text-gray-400 [--corner-offset:1px]"></span>

		<!-- Header -->
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
				المسارات التعليمية
			</h2>
			<p class="mt-4 text-lg text-gray-500 dark:text-gray-400">
				اختر ما يناسب مستواك، سواء كنت تبدأ من الصفر أو تسعى لتطوير مهاراتك.
			</p>
		</div>

		<!-- Tracks Grid -->
		<div
			class="mx-auto mt-20 grid max-w-lg grid-cols-1 gap-8 sm:max-w-none md:grid-cols-2 lg:grid-cols-4"
		>
			<!-- Track 1 -->
			<a
				href="/signup"
				class="group hover:border-primary-500/20 relative flex flex-col border-2 border-transparent bg-gray-50 p-8 transition-colors duration-200 dark:bg-gray-800/20"
			>
				<span class="corners-t group-hover:text-primary-400 text-gray-400"></span>
				<span class="corners-b group-hover:text-primary-400 text-gray-400"></span>

				<div class="mb-6 flex items-center justify-between">
					<div class="flex h-12 w-12 items-center justify-center">
						<enhanced:img
							src="$assets/images/logos/python.png"
							alt="Python"
							class="h-10 w-10 object-contain"
						/>
					</div>
				</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-50">تحديات بايثون</h3>
				<p class="mb-8 grow text-sm leading-relaxed text-gray-500 dark:text-gray-400">
					تحديات متدرجة الصعوبة لصقل مهاراتك البرمجية عملياً.
				</p>
				<span class="text-primary-600 dark:text-primary-400 text-sm font-medium"
					>ابدأ التعلم &larr;</span
				>
			</a>

			<!-- Track 2 -->
			<a
				href="/signup"
				class="group hover:border-primary-500/20 relative flex flex-col border-2 border-transparent bg-gray-50 p-8 transition-colors duration-200 dark:bg-gray-800/20"
			>
				<span class="corners-t group-hover:text-primary-400 text-gray-400"></span>
				<span class="corners-b group-hover:text-primary-400 text-gray-400"></span>
				<div class="mb-6 flex items-center justify-between">
					<div class="flex h-12 w-12 items-center justify-center">
						<enhanced:img
							src="$assets/images/logos/python.png"
							alt="Python"
							class="h-10 w-10 object-contain"
						/>
					</div>
				</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-50">بايثون من الصفر</h3>
				<p class="mb-8 grow text-sm leading-relaxed text-gray-500 dark:text-gray-400">
					مسار متكامل لتعلم أساسيات البرمجة بأسهل لغة.
				</p>
				<span class="text-primary-600 dark:text-primary-400 text-sm font-medium"
					>ابدأ التعلم &larr;</span
				>
			</a>

			<!-- Track 3 -->
			<a
				href="/signup"
				class="group hover:border-primary-500/20 relative flex flex-col border-2 border-transparent bg-gray-50 p-8 transition-colors duration-200 dark:bg-gray-800/20"
			>
				<span class="corners-t group-hover:text-primary-400 text-gray-400"></span>
				<span class="corners-b group-hover:text-primary-400 text-gray-400"></span>
				<div class="mb-6 flex items-center justify-between">
					<div class="flex h-12 w-12 items-center justify-center">
						<enhanced:img
							src="$assets/images/logos/internet.png"
							alt="Internet"
							class="h-10 w-10 object-contain"
						/>
					</div>
				</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-50">كيف يعمل الإنترنت</h3>
				<p class="mb-8 grow text-sm leading-relaxed text-gray-500 dark:text-gray-400">
					اكتشف خبايا الشبكة العالمية ومفاهيمها بأسلوب مبسط.
				</p>
				<span class="text-primary-600 dark:text-primary-400 text-sm font-medium"
					>ابدأ التعلم &larr;</span
				>
			</a>

			<!-- Track 4 (WIP) -->
			<div
				class="flex cursor-not-allowed flex-col bg-gray-50 p-8 opacity-60 grayscale dark:bg-gray-800/20"
			>
				<span class="corners-t text-gray-400"></span>
				<span class="corners-b text-gray-400"></span>
				<div class="mb-6 flex items-center justify-between">
					<div class="flex h-12 w-12 items-center justify-center">
						<enhanced:img
							src="$assets/images/logos/javascript.png"
							alt="JavaScript"
							class="h-10 w-10 object-contain"
						/>
					</div>
					<span class="text-xs font-medium text-gray-400 dark:text-gray-500">قريباً</span>
				</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-50">أساسيات جافاسكريبت</h3>
				<p class="mb-8 grow text-sm leading-relaxed text-gray-500 dark:text-gray-400">
					تعلم لغة الويب الأساسية لبناء واجهات تفاعلية.
				</p>
				<span class="text-sm font-medium text-gray-400 dark:text-gray-500">قيد التطوير</span>
			</div>
		</div>

		<div class="mx-auto max-w-2xl text-center">
			<p class="mt-16 text-lg text-gray-500 dark:text-gray-400">
				ابدأ مجاناً، ثم قم بالترقية لفتح كامل إمكانياتك البرمجية.
			</p>
			<Button href="/signup" rounded variant="attention" size="lg" class="mt-6">
				{i18n.t('navigation.signup')}
			</Button>
		</div>
	</div>
</section>

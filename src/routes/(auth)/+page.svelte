<script>
	import { i18n } from '$i18n/i18n';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import Logo from '$ui/common/Logo.svelte';
	import Footer from '$ui/shared/Footer.svelte';
</script>

<svelte:head>
	<title>أكوود | أتقن البرمجة، سطراً بسطر</title>
	<meta
		name="description"
		content="منصة أكود هي طريقك لتعلم البرمجة باللغة العربية عبر دروس تفاعلية وتحديات عملية. ابدأ رحلتك البرمجية اليوم."
	/>
</svelte:head>

<div class="bg-white selection:bg-emerald-100">
	<!-- header -->
	<header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
		<div class="container mx-auto flex items-center justify-between px-6 py-4">
			<a
				href="/"
				aria-label="Go to homepage"
				class="group flex-shrink-0 rounded-lg p-1 transition-transform duration-200"
			>
				<Logo
					variant="withText"
					size="md"
					class="transition-opacity group-hover:opacity-80"
					color="var(--color-emerald-600)"
				/>
			</a>
			<nav class="hidden items-center gap-8 md:flex">
				<a
					href="#features"
					class="font-medium text-slate-600 transition-colors hover:text-emerald-600">الميزات</a
				>
				<a
					href="#how-it-works"
					class="font-medium text-slate-600 transition-colors hover:text-emerald-600">كيف نعمل</a
				>
				<a
					href="#tracks"
					class="font-medium text-slate-600 transition-colors hover:text-emerald-600">المسارات</a
				>
			</nav>
			<!-- Auth Buttons -->
			<div class="items-center gap-2 sm:flex">
				<Button href="/signin" variant="link-pill" size="sm" class="!text-slate-600">
					{i18n.t('navigation.signin')}
				</Button>
				<Button href="/signup" variant="attention" size="sm" rounded>ابدأ مجاناً</Button>
			</div>
		</div>
	</header>

	<main>
		<!-- Hero Section -->
		<section class="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
			<div class="relative container mx-auto px-6">
				<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
					<!-- Right Column: Content -->
					<div class="text-center lg:text-right">
						<div
							class="mb-6 inline-flex items-center space-x-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 rtl:space-x-reverse"
						>
							<div class="me-2 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"></div>
							<span>نسخة تجريبية - انضم مبكراً!</span>
						</div>

						<h1 class="mb-5 text-4xl leading-tight font-black text-slate-900 lg:text-6xl">
							تعلم البرمجة،
							<span
								class="bg-gradient-to-r from-emerald-600 to-teal-400 bg-clip-text text-transparent"
							>
								خطوة بخطوة
							</span>
						</h1>

						<p
							class="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-slate-600 lg:mx-0 lg:text-xl"
						>
							ودّع الدروس النظرية المملة. في أكوود، أنت لا تشاهد البرمجة فحسب، بل
							<strong class="font-bold text-emerald-600">تمارسها</strong>. تعلم بكتابة الكود وحل
							الألغاز البرمجية من اليوم الأول.
						</p>

						<div class="mb-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
							<a
								href="/signup"
								class="transform rounded-xl bg-emerald-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/30"
							>
								ابدأ رحلتك مجاناً
							</a>
						</div>

						<!-- Stats -->
						<div class="mx-auto grid max-w-sm grid-cols-3 gap-6 lg:mx-0">
							<div class="text-center">
								<div class="text-3xl font-bold text-emerald-600">50+</div>
								<div class="text-sm font-medium text-slate-500">تمرين تفاعلي</div>
							</div>
							<div class="border-x border-slate-200 text-center">
								<div class="text-3xl font-bold text-emerald-600">100%</div>
								<div class="text-sm font-medium text-slate-500">باللغة العربية</div>
							</div>
							<div class="text-center">
								<div class="text-3xl font-bold text-emerald-600">24/7</div>
								<div class="text-sm font-medium text-slate-500">متاح دائماً</div>
							</div>
						</div>
					</div>

					<!-- Left Column: Interactive Demo -->
					<div
						class="relative rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-2xl shadow-slate-300/30 backdrop-blur-md"
					>
						<!-- TODO: -->
					</div>
				</div>
			</div>
		</section>

		<!-- Features Section -->
		<section id="features" class="bg-gray-50 py-24">
			<div class="container mx-auto px-6">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-4xl font-bold text-gray-900">لماذا تختار منصة أكوود؟</h2>
					<p class="mx-auto max-w-2xl text-xl text-gray-600">
						نحن نؤمن أن أفضل طريقة للتعلم هي عبر الممارسة والتطبيق المباشر
					</p>
				</div>

				<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
					<!-- Feature 1 -->
					<div
						class="transform rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60"
					>
						<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
							<Icon name="puzzle" class="text-emerald-600" size={24} />
						</div>
						<h3 class="mb-3 text-xl font-bold text-gray-900">دروس تفاعلية فريدة</h3>
						<p class="leading-relaxed text-gray-600">
							املأ الفراغات، اكتشف الأخطاء، ورتب الأكواد. تمارين مصممة لترسيخ المفاهيم البرمجية في
							عقلك.
						</p>
					</div>

					<!-- Feature 2 -->
					<div
						class="transform rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60"
					>
						<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
							<Icon name="terminal" class="text-emerald-600" size={24} />
						</div>
						<h3 class="mb-3 text-xl font-bold text-gray-900">بيئة برمجية متكاملة</h3>
						<p class="leading-relaxed text-gray-600">
							اختبر حلولك للتحديات البرمجية مباشرةً في المتصفح واحصل على نتيجة فورية من نظام
							الاختبارات الآلي.
						</p>
					</div>

					<!-- Feature 3 -->
					<div
						class="transform rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60"
					>
						<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
							<Icon name="check-lock" class="text-emerald-600" size={24} />
						</div>
						<h3 class="mb-3 text-xl font-bold text-gray-900">مسارات تعليمية واضحة</h3>
						<p class="leading-relaxed text-gray-600">
							مسارات مصممة بعناية لتأخذك من الصفر إلى بناء المشاريع، خطوة بخطوة وبدون تشتيت.
						</p>
					</div>

					<!-- Feature 4 -->
					<div
						class="transform rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60"
					>
						<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
							<Icon name="book-open" class="text-emerald-600" size={24} />
						</div>
						<h3 class="mb-3 text-xl font-bold text-gray-900">محتوى عربي أصيل</h3>
						<p class="leading-relaxed text-gray-600">
							شروحات وأمثلة بأسلوب عربي واضح ومبسط، معدّة خصيصاً للمتعلم العربي لكسر حاجز اللغة.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- How It Works Section -->
		<section id="how-it-works" class="py-20 lg:py-24">
			<div class="container mx-auto px-6">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
						رحلتك تبدأ في 3 خطوات عملية
					</h2>
					<p class="mx-auto max-w-xl text-lg text-slate-600 lg:text-xl">
						نظام تعليمي مصمم لتبسيط البرمجة: ركّز على الكود، نتولى الباقي.
					</p>
				</div>
				<div class="relative grid gap-12 lg:grid-cols-3">
					<!-- Connector line for desktop -->
					<div class="absolute top-8 left-0 hidden h-0.5 w-full bg-slate-200 lg:block">
						<div class="m-auto h-0.5 w-4/6 bg-emerald-500"></div>
					</div>

					<!-- Step 1 -->
					<div class="relative text-center">
						<div
							class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white shadow-lg shadow-emerald-500/30"
						>
							1
						</div>
						<h3 class="mb-3 text-2xl font-bold text-slate-900">اختر مسارك</h3>
						<p class="text-lg leading-relaxed text-slate-600">
							ابدأ بأي مسار ترغب به، سواء بايثون أو غيره، واستكشف خياراتك.
						</p>
					</div>

					<!-- Step 2 -->
					<div class="relative text-center">
						<div
							class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white shadow-lg shadow-emerald-500/30"
						>
							2
						</div>
						<h3 class="mb-3 text-2xl font-bold text-slate-900">تعلم وطبق فوراً</h3>
						<p class="text-lg leading-relaxed text-slate-600">
							كل درس يعلمك مفهوم جديد ويضعك أمام تحدٍ تطبيقي مباشر.
						</p>
					</div>

					<!-- Step 3 -->
					<div class="relative text-center">
						<div
							class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white shadow-lg shadow-emerald-500/30"
						>
							3
						</div>
						<h3 class="mb-3 text-2xl font-bold text-slate-900">اختبر مهاراتك</h3>
						<p class="text-lg leading-relaxed text-slate-600">
							حل تحديات حقيقية لترسيخ ما تعلمته وكسب ثقة برمجية حقيقية.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Tracks Section -->
		<section id="tracks" class="bg-slate-50 py-20 lg:py-24">
			<div class="container mx-auto px-6">
				<!-- Section Header -->
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">اختر مسارك التعليمي</h2>
					<p class="mx-auto max-w-2xl text-lg text-slate-600 lg:text-xl">
						سواء كنت مبتدئًا تمامًا أو تسعى لصقل مهاراتك، لدينا المسار المناسب لك لمساعدتك على تحقيق
						أهدافك.
					</p>
				</div>

				<!-- Tracks Grid -->
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
					<!-- Track Card 1: Python (Ready) -->
					<a
						href="/courses/beginner@python"
						class="group relative flex h-full transform flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60"
					>
						<div
							class="absolute top-4 right-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 rtl:right-auto rtl:left-4"
						>
							متاح الآن
						</div>
						<div class="mb-5 flex h-16 w-16 items-center justify-center">
							<img
								src="/images/logos/python.png"
								alt="python logo"
								class="h-14 w-14 object-contain"
							/>
						</div>
						<h3 class="mb-3 text-xl font-bold text-slate-900">بايثون للمبتدئين</h3>
						<p class="mb-6 flex-grow leading-relaxed text-slate-600">
							انطلق في عالم البرمجة مع لغة بايثون السهلة والقوية. مسار مثالي لمن يبدأ من الصفر.
						</p>
						<div
							class="mt-auto w-full rounded-lg bg-emerald-500 py-2.5 text-center font-semibold text-white transition-colors duration-300 group-hover:bg-emerald-600"
						>
							ابدأ التعلم
						</div>
					</a>

					<!-- Track Card 2: How Internet Works (Ready) -->
					<a
						href="/courses/internet@web"
						class="group relative flex h-full transform flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60"
					>
						<div
							class="absolute top-4 right-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 rtl:right-auto rtl:left-4"
						>
							متاح الآن
						</div>
						<div class="mb-5 flex h-16 w-16 items-center justify-center">
							<img
								src="/images/logos/internet.png"
								alt="internet logo"
								class="h-14 w-14 object-contain"
							/>
						</div>
						<h3 class="mb-3 text-xl font-bold text-slate-900">كيف يعمل الإنترنت</h3>
						<p class="mb-6 flex-grow leading-relaxed text-slate-600">
							اكتشف السحر وراء الشبكة العالمية. من هو DNS إلى HTTP، ستفهم كل شيء بأسلوب مبسط.
						</p>
						<div
							class="mt-auto w-full rounded-lg bg-emerald-500 py-2.5 text-center font-semibold text-white transition-colors duration-300 group-hover:bg-emerald-600"
						>
							ابدأ التعلم
						</div>
					</a>

					<!-- Track Card 3: Practice Python (WIP) -->
					<div
						class="relative flex h-full cursor-not-allowed flex-col rounded-2xl border border-slate-200 bg-white p-8 opacity-70 grayscale-[50%]"
					>
						<div
							class="absolute top-4 right-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 rtl:right-auto rtl:left-4"
						>
							قريباً
						</div>
						<div class="mb-5 flex h-16 w-16 items-center justify-center">
							<img
								src="/images/logos/python.png"
								alt="python logo"
								class="h-14 w-14 object-contain"
							/>
						</div>
						<h3 class="mb-3 text-xl font-bold text-slate-900">تدريبات بايثون</h3>
						<p class="mb-6 flex-grow leading-relaxed text-slate-600">
							صقل مهاراتك في بايثون عبر حل مجموعة من التحديات البرمجية المتدرجة في الصعوبة.
						</p>
						<div
							class="mt-auto w-full rounded-lg bg-slate-200 py-2.5 text-center font-semibold text-slate-500"
						>
							قيد التطوير
						</div>
					</div>

					<!-- Track Card 4: JavaScript (WIP) -->
					<div
						class="relative flex h-full cursor-not-allowed flex-col rounded-2xl border border-slate-200 bg-white p-8 opacity-70 grayscale-[50%]"
					>
						<div
							class="absolute top-4 right-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 rtl:right-auto rtl:left-4"
						>
							قريباً
						</div>
						<div class="mb-5 flex h-16 w-16 items-center justify-center">
							<img
								src="/images/logos/javascript.png"
								alt="javascript logo"
								class="h-14 w-14 object-contain"
							/>
						</div>
						<h3 class="mb-3 text-xl font-bold text-slate-900">أساسيات جافاسكريبت</h3>
						<p class="mb-6 flex-grow leading-relaxed text-slate-600">
							تعلم لغة الويب الأساسية التي تمنح الحياة للمواقع التفاعلية والتطبيقات الحديثة.
						</p>
						<div
							class="mt-auto w-full rounded-lg bg-slate-200 py-2.5 text-center font-semibold text-slate-500"
						>
							قيد التطوير
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Pricing Teaser -->
		<section class="bg-white py-24">
			<div class="container mx-auto px-6">
				<div class="mx-auto max-w-4xl text-center">
					<h2 class="mb-4 text-4xl font-bold text-gray-900">انضم إلى ثورة التعلم البرمجي</h2>
					<p class="mb-8 text-xl text-gray-600">
						ابدأ مجاناً واستمر في رحلتك مع خطط مرنة ومناسبة لجميع المستويات
					</p>

					<div class="mx-auto mb-12 grid max-w-2xl gap-8 md:grid-cols-2">
						<!-- Free Plan -->
						<div class="rounded-2xl border-2 border-gray-200 bg-gray-50 p-8">
							<h3 class="mb-4 text-2xl font-bold text-gray-900">البداية المجانية</h3>
							<div class="mb-2 text-4xl font-bold text-gray-900">مجاناً</div>
							<p class="mb-6 text-gray-600">للتعرف على المنصة</p>
							<ul class="mb-8 space-y-3 text-right text-gray-900">
								<li class="flex items-center">
									<svg class="ml-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
									الوحدة الأولية من بايثون
								</li>
								<li class="flex items-center">
									<svg class="ml-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
									مسار كيف يعمل الإنترنت
								</li>
								<li class="flex items-center">
									<svg class="ml-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
									تمارين تفاعلية أساسية
								</li>
								<li class="flex items-center">
									<svg class="ml-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
									تتبع التقدم الأساسي
								</li>
							</ul>
							<a
								class="block w-full rounded-xl bg-gray-200 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-300"
								href="/signup"
							>
								ابدأ مجاناً
							</a>
						</div>

						<!-- Pro Plan -->
						<div
							class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white"
						>
							<!-- <div -->
							<!-- 	class="absolute top-4 left-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-yellow-900" -->
							<!-- > -->
							<!-- 	الأكثر شعبية -->
							<!-- </div> -->
							<h3 class="mb-4 text-2xl font-bold">العضوية المميزة</h3>
							<div class="mb-2 text-4xl font-bold">$10</div>
							<p class="mb-6 text-emerald-100">شهرياً</p>
							<ul class="mb-8 space-y-3 text-right">
								<li class="flex items-center">
									<svg
										class="ml-3 h-5 w-5 text-emerald-200"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
									جميع المسارات والوحدات
								</li>
								<li class="flex items-center">
									<svg
										class="ml-3 h-5 w-5 text-emerald-200"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
									تحديات برمجية متقدمة
								</li>
								<li class="flex items-center">
									<svg
										class="ml-3 h-5 w-5 text-emerald-200"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
									شهادات إتمام
								</li>
								<li class="flex items-center">
									<svg
										class="ml-3 h-5 w-5 text-emerald-200"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
									دعم فني مخصص
								</li>
							</ul>
							<button
								class="w-full rounded-xl bg-white py-3 font-bold text-emerald-600 transition-colors hover:bg-gray-50"
							>
								قريباً
							</button>
						</div>
					</div>

					<p class="text-sm text-gray-500">
						💡 نصيحة: ابدأ مجاناً لتجربة المنصة، ثم قم بالترقية عندما تصبح جاهزاً للمزيد
					</p>
				</div>
			</div>
		</section>

		<!-- Early Access CTA -->
		<section class="bg-gradient-to-br from-emerald-500 to-emerald-600 py-24 text-white">
			<div class="container mx-auto px-6 text-center">
				<div class="mx-auto max-w-3xl">
					<h2 class="mb-6 text-4xl font-bold lg:text-5xl">كن من أوائل المتعلمين في أكود</h2>
					<p class="mb-8 text-xl leading-relaxed text-emerald-100">
						انضم إلى نسختنا التجريبية واحصل على وصول مبكر للمحتوى الجديد. رأيك مهم لنا في بناء أفضل
						منصة تعليم برمجي عربية.
					</p>

					<div class="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/signup"
							class="transform rounded-xl bg-white px-10 py-4 text-lg font-bold text-emerald-600 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-50"
						>
							سجل مجاناً الآن
						</a>
						<a
							href="https://x.com/arabkood"
							target="_blank"
							class="rounded-xl border-2 border-white px-10 py-4 text-lg font-bold text-white transition-all duration-200 hover:bg-white hover:text-emerald-600"
						>
							تواصل معنا
						</a>
					</div>

					<!-- Social Proof -->
					<div class="flex flex-wrap items-center justify-center gap-8 text-emerald-100">
						<div class="flex items-center">
							<Icon name="check-circle" size={24} class="me-2" />
							مجاني 100%
						</div>
						<div class="flex items-center">
							<Icon name="check-lock" size={24} class="me-2" />
							لا توجد التزامات
						</div>
						<div class="flex items-center">
							<Icon name="target" size={24} class="me-2" />
							محتوى حصري
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Footer -->
		<Footer />
	</main>
</div>

<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import Logo from '$ui/common/Logo.svelte';
	import Fill from '$ui/lesson/fill/Fill.svelte';
	import Footer from '$ui/shared/Footer.svelte';
	import success_wav from '$assets/correct.wav';
	import fail_wav from '$assets/fail.wav';
	import { Sound } from '$utils/sound';
	import { browser } from '$app/environment';
	import Video from '$ui/common/Video.svelte';
	import { fade } from 'svelte/transition';
	import type { FillQuestion } from '$types/lesson';
	import Seo from '$ui/others/SEO.svelte';
	import { SITE } from '$config';

	let mobileMenuOpen = $state(false);
	const closeMenu = () => {
		mobileMenuOpen = false;
	};

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
		? new Sound([success_wav], {
				fadeInDuration: 0,
				volume: 0.5,
				preload: true
			})
		: undefined;
	const failPlayer = browser
		? new Sound([fail_wav], {
				fadeInDuration: 0,
				volume: 0.6,
				preload: true
			})
		: undefined;

	const handleNext = () => {
		document?.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
	};

	const faqs = [
		{
			question: 'هل أحتاج إلى أي خبرة برمجية سابقة؟',
			answer:
				'إطلاقاً! مساراتنا مصممة لتبدأ معك من الصفر. كل ما تحتاجه هو حاسوب، اتصال بالإنترنت، ورغبة حقيقية في التعلم.'
		},
		{
			question: 'ما الذي يجعل أكود مختلفة عن مشاهدة الفيديوهات؟',
			answer:
				'في أكود، أنت لا تشاهد فقط، بل تطبق. التعلم التفاعلي بكتابة الكود وحل التحديات يرسخ المعلومة بشكل أعمق ويمنحك ثقة حقيقية بمهاراتك.'
		},
		{
			question: 'هل الخطة المجانية كافية للبدء؟',
			answer:
				'بالتأكيد. الخطة المجانية تمنحك وصولاً لوحدات تمهيدية أساسية ومسار "كيف يعمل الإنترنت" بالكامل، وهي طريقة ممتازة لتجربة منصتنا والبدء في رحلتك البرمجية.'
		}
	];

	// SEO data
	const seoTitle = 'أكود | تعلم البرمجة بالممارسة لا بالتلقين';
	const seoDescription =
		'منصة أكود لتعلم البرمجة باللغة العربية عبر دروس تفاعلية وتحديات عملية. ابدأ رحلتك البرمجية مجاناً مع أكثر من 50 تمرين تفاعلي.';
	const seoKeywords =
		'تعلم البرمجة, بايثون, جافاسكريبت, كورسات برمجة عربية, تعليم تفاعلي, أكود, akood';

	// Homepage schema markup
	const homepageSchema = [
		// Organization schema
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: 'أكود - Akood',
			alternateName: ['أكود', 'Akood'],
			url: 'https://www.akood.com',
			logo: 'https://www.akood.com/images/logo.png',
			description: seoDescription,
			foundingDate: '2024',
			sameAs: ['https://x.com/akood_com', 'https://github.com/arabkood'],
			contactPoint: {
				'@type': 'ContactPoint',
				contactType: 'customer service',
				availableLanguage: 'Arabic'
			}
		},
		// Website schema
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'أكود - منصة تعلم البرمجة',
			url: 'https://www.akood.com',
			description: seoDescription,
			inLanguage: 'ar',
			potentialAction: {
				'@type': 'SearchAction',
				target: 'https://www.akood.com/courses?q={search_term_string}',
				'query-input': 'required name=search_term_string'
			}
		},
		// Course catalog
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: 'كورسات البرمجة المتاحة',
			description: 'مجموعة شاملة من كورسات البرمجة باللغة العربية',
			itemListElement: [
				{
					'@type': 'Course',
					position: 1,
					name: 'بايثون للمبتدئين',
					description: 'تعلم أساسيات البرمجة مع لغة بايثون',
					provider: {
						'@type': 'Organization',
						name: 'أكود - Akood'
					},
					educationalLevel: 'مبتدئ',
					url: 'https://www.akood.com/courses/python-beginner'
				},
				{
					'@type': 'Course',
					position: 2,
					name: 'تمارين بايثون',
					description:
						"هربت من دوامة الشروحات؟ حان وقت التطبيق الحقيقي! 100 تحدي عملي مصمم خصيصاً لتحويلك من 'أفهم الكود' إلى 'أكتب الكود بنفسي'.",
					provider: {
						'@type': 'Organization',
						name: 'أكود - Akood'
					},
					educationalLevel: 'مبتدئ',
					url: 'https://www.akood.com/courses/python-practice'
				},
				{
					'@type': 'Course',
					position: 3,
					name: 'كيف يعمل الإنترنت',
					description: 'فهم أساسيات الشبكة العالمية',
					provider: {
						'@type': 'Organization',
						name: 'أكود - Akood'
					},
					educationalLevel: 'مبتدئ',
					url: 'https://www.akood.com/courses/web-internet'
				}
			]
		}
	];
</script>

<Seo
	title={seoTitle}
	description={seoDescription}
	keywords={seoKeywords}
	schema={homepageSchema}
	lang="ar"
	image={SITE + '/default.jpg'}
/>

<svelte:body class:overflow-hidden={mobileMenuOpen} />

<div class="bg-white selection:bg-emerald-100">
	<header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
		<div class="container mx-auto flex items-center justify-between px-6 py-4">
			<a
				href="/"
				aria-label="Go to homepage"
				class="group z-50 flex-shrink-0 rounded-lg p-1 transition-transform duration-200"
			>
				<Logo
					variant="withText"
					size="md"
					class="transition-opacity group-hover:opacity-80"
					color="var(--color-emerald-600)"
				/>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center gap-8 md:flex">
				<a
					href="#features"
					class="font-medium text-slate-600 transition-colors hover:text-emerald-600">الميزات</a
				>
				<a
					href="#tracks"
					class="font-medium text-slate-600 transition-colors hover:text-emerald-600">المسارات</a
				>
				<a
					href="#pricing"
					class="font-medium text-slate-600 transition-colors hover:text-emerald-600">الأسعار</a
				>
			</nav>

			<!-- Desktop Buttons -->
			<div class="hidden items-center gap-2 md:flex">
				<Button href="/signin" variant="link-pill" size="sm" class="!text-slate-600">
					{i18n.t('navigation.signin')}
				</Button>
				<Button href="/signup" variant="attention" size="sm" rounded>ابدأ مجاناً</Button>
			</div>

			<!-- Mobile Menu Button (Hamburger) -->
			<div class="z-50 md:hidden">
				<button
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					class="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
					aria-label="Toggle menu"
					aria-expanded={mobileMenuOpen}
				>
					{#if mobileMenuOpen}
						<Icon name="x" size={24} />
					{:else}
						<Icon name="menu" size={24} />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Menu Panel -->
		{#if mobileMenuOpen}
			<div
				class="fixed inset-0 top-[73px] z-40 h-screen bg-white md:hidden"
				transition:fade={{ duration: 150 }}
			>
				<nav class="flex flex-col space-y-2 p-6 text-center">
					<a
						href="#features"
						onclick={closeMenu}
						class="block rounded-lg py-3 text-lg font-medium text-slate-700 transition-colors hover:bg-slate-50"
						>الميزات</a
					>
					<a
						href="#tracks"
						onclick={closeMenu}
						class="block rounded-lg py-3 text-lg font-medium text-slate-700 transition-colors hover:bg-slate-50"
						>المسارات</a
					>
					<a
						href="#pricing"
						onclick={closeMenu}
						class="block rounded-lg py-3 text-lg font-medium text-slate-700 transition-colors hover:bg-slate-50"
						>الأسعار</a
					>
				</nav>
				<div class="flex flex-col gap-4 border-t border-slate-200 px-6 pt-6">
					<Button href="/signin" variant="outline" size="md" class="w-full">
						{i18n.t('navigation.signin')}
					</Button>
					<Button href="/signup" variant="attention" size="md" rounded class="w-full"
						>ابدأ مجاناً</Button
					>
				</div>
			</div>
		{/if}
	</header>

	<main>
		<section class="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
			<div class="relative container mx-auto md:px-6">
				<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
					<div class="px-6 text-center md:px-0 lg:text-right">
						<div
							class="mb-6 inline-flex items-center space-x-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 rtl:space-x-reverse"
						>
							<div class="me-2 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"></div>
							<span>نسخة تجريبية - انضم مبكراً!</span>
						</div>

						<h1
							class="mb-5 text-3xl leading-tight font-black text-slate-900 sm:text-4xl lg:text-6xl"
						>
							تعلم البرمجة،
							<span
								class="bg-gradient-to-r from-emerald-600 to-teal-400 bg-clip-text text-transparent"
							>
								بالممارسة لا بالتلقين
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
								class="transform rounded-xl bg-emerald-500 px-6 py-3 text-base font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/30 sm:px-8 sm:py-4 sm:text-lg"
							>
								ابدأ رحلتك البرمجية مجاناً
							</a>
						</div>

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
								<div class="text-3xl font-bold text-emerald-600">100%</div>
								<div class="text-sm font-medium text-slate-500">محتوى عملي</div>
							</div>
						</div>
					</div>

					<div
						class="relative rounded-2xl border-slate-200 bg-white/70 py-4 shadow-slate-300/30 md:border md:p-4 md:shadow-2xl"
					>
						<div class="mb-3 text-center">
							<h2 class="text-lg font-bold text-slate-800">جرب بنفسك الآن!</h2>
							<p class="text-sm text-slate-500">اكتب الكود الصحيح لإكمال التحدي</p>
						</div>
						<div class="max-w-sm md:max-w-2xl">
							<Fill
								{successPlayer}
								{failPlayer}
								onNext={handleNext}
								step={sampleStep}
								bind:answer
							/>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="bg-slate-50 py-20 lg:py-24" id="features">
			<div class="container mx-auto px-6">
				<div class="mb-12 text-center">
					<h2 class="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
						شاهد كيف ستحل تحديات البرمجة الحقيقية
					</h2>
					<p class="mx-auto max-w-2xl text-lg text-slate-600 lg:text-xl">
						لا تكتفِ بالمشاهدة - اكتب، اختبر، وتأكد من صحة حلك. هذه هي تجربة التعلم في أكوود.
					</p>
				</div>

				<div class="mx-auto max-w-4xl">
					<div
						class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-2 shadow-2xl shadow-slate-900/10"
					>
						<div class="relative overflow-hidden rounded-xl bg-white shadow-lg">
							<Video
								width="1272px"
								height="855px"
								src="/video/akood-demo.mp4"
								poster="/video/akood-demo.png"
								class="w-full"
							/>
						</div>
					</div>
				</div>

				<div class="mt-16 grid gap-6 text-center md:grid-cols-3">
					<div class="flex flex-col items-center">
						<h3 class="mb-1 font-semibold text-slate-900">اختبارات آلية</h3>
						<p class="text-sm text-slate-600">تأكد من صحة حلك فوراً</p>
					</div>

					<div class="flex flex-col items-center">
						<h3 class="mb-1 font-semibold text-slate-900">نتائج فورية</h3>
						<p class="text-sm text-slate-600">احصل على ملاحظات مباشرة</p>
					</div>

					<div class="flex flex-col items-center">
						<h3 class="mb-1 font-semibold text-slate-900">مشاكل حقيقية</h3>
						<p class="text-sm text-slate-600">تحديات من الواقع العملي</p>
					</div>
				</div>
			</div>
		</section>

		<section class="bg-white py-24">
			<div class="container mx-auto px-6">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-4xl font-bold text-gray-900">لماذا تختار منصة أكوود؟</h2>
					<p class="mx-auto max-w-2xl text-xl text-gray-600">
						نؤمن أن أفضل طريقة للتعلم هي عبر الممارسة والتطبيق المباشر.
					</p>
				</div>

				<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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

		<section id="how-it-works" class="bg-gray-50 py-20 lg:py-24">
			<div class="container mx-auto px-6">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
						رحلتك لـ "أهلاً بالعالم" في 3 خطوات
					</h2>
					<p class="mx-auto max-w-xl text-lg text-slate-600 lg:text-xl">
						ركّز على الكود، ودعنا نتولى الباقي. نظام تعليمي مصمم لإزالة كل العوائق أمامك.
					</p>
				</div>
				<div class="relative grid gap-12 lg:grid-cols-3">
					<div class="absolute top-8 left-0 hidden h-0.5 w-full bg-slate-200 lg:block">
						<div class="m-auto h-0.5 w-4/6 bg-emerald-500"></div>
					</div>

					<div class="relative text-center">
						<div
							class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white shadow-lg shadow-emerald-500/30"
						>
							1
						</div>
						<h3 class="mb-3 text-2xl font-bold text-slate-900">اختر شغفك</h3>
						<p class="text-lg leading-relaxed text-slate-600">
							ابدأ بالمسار الذي يثير فضولك، سواء كان بايثون أو تطوير الويب.
						</p>
					</div>

					<div class="relative text-center">
						<div
							class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white shadow-lg shadow-emerald-500/30"
						>
							2
						</div>
						<h3 class="mb-3 text-2xl font-bold text-slate-900">تعلم بالممارسة</h3>
						<p class="text-lg leading-relaxed text-slate-600">
							كل درس يضعك أمام تحدٍ تطبيقي مباشر لترسيخ ما تعلمته للتو.
						</p>
					</div>

					<div class="relative text-center">
						<div
							class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white shadow-lg shadow-emerald-500/30"
						>
							3
						</div>
						<h3 class="mb-3 text-2xl font-bold text-slate-900">ابنِ ثقتك البرمجية</h3>
						<p class="text-lg leading-relaxed text-slate-600">
							حل تحديات من الواقع العملي واكتسب مهارات حقيقية تضاف لسيرتك الذاتية.
						</p>
					</div>
				</div>
			</div>
		</section>

		<section class="bg-white py-20 lg:py-24">
			<div class="container mx-auto px-6">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
						ماذا يقول المتعلمون الأوائل
					</h2>
					<p class="mx-auto max-w-xl text-lg text-slate-600 lg:text-xl">
						آراء من انضموا إلينا في النسخة التجريبية وساهموا في بناء أكود.
					</p>
				</div>
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					<div class="rounded-xl border border-slate-200 bg-slate-50 p-8">
						<p class="mb-6 text-slate-700">
							"أفضل منصة عربية جربتها على الإطلاق. التمارين التفاعلية تجعل التعلم ممتعًا وغير ممل.
							أخيرًا محتوى عربي ينافس المنصات العالمية."
						</p>
						<div class="flex items-center">
							<enhanced:img
								src="$assets/images/testimony/1.webp"
								alt="علياء"
								class="ml-4 h-12 w-12 rounded-full object-cover"
							/>
							<div>
								<p class="font-bold text-slate-900">علياء</p>
								<p class="text-sm text-slate-500">طالبة جامعية</p>
							</div>
						</div>
					</div>
					<div class="rounded-xl border border-slate-200 bg-slate-50 p-8">
						<p class="mb-6 text-slate-700">
							"كنت أخشى البدء في تعلم البرمجة بسبب اللغة الإنجليزية، لكن أكود كسرت هذا الحاجز
							تمامًا. الشرح واضح والمنصة سهلة الاستخدام جدًا."
						</p>
						<div class="flex items-center">
							<enhanced:img
								src="$assets/images/testimony/2.webp"
								alt="ماجد"
								class="ml-4 h-12 w-12 rounded-full object-cover"
							/>
							<div>
								<p class="font-bold text-slate-900">ماجد</p>
								<p class="text-sm text-slate-500">مصمم جرافيك</p>
							</div>
						</div>
					</div>
					<div class="rounded-xl border border-slate-200 bg-slate-50 p-8">
						<p class="mb-6 text-slate-700">
							"طريقة التعلّم عملية جدًا. بدلاً من ساعات من الشرح النظري، بدأت في كتابة الكود وحل
							المشاكل من أول يوم. أنصح بها بشدة."
						</p>
						<div class="flex items-center">
							<enhanced:img
								src="$assets/images/testimony/3.webp"
								alt="حسن"
								class="ml-4 h-12 w-12 rounded-full object-cover"
							/>
							<div>
								<p class="font-bold text-slate-900">حسن</p>
								<p class="text-sm text-slate-500">مستقل (Freelancer)</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section id="tracks" class="bg-slate-50 py-20 lg:py-24">
			<div class="container mx-auto px-6">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">اختر مسارك التعليمي</h2>
					<p class="mx-auto max-w-2xl text-lg text-slate-600 lg:text-xl">
						سواء كنت مبتدئًا تمامًا أو تسعى لصقل مهاراتك، لدينا المسار المناسب لك.
					</p>
				</div>

				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
					<a
						href="/signup"
						class="group relative flex h-full transform flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60"
					>
						<div
							class="absolute top-4 right-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 rtl:right-auto rtl:left-4"
						>
							مشهور
						</div>
						<div class="mb-5 flex h-16 w-16 items-center justify-center">
							<enhanced:img
								src="$assets/images/logos/python.png"
								alt="python logo"
								class="h-14 w-14 object-contain"
							/>
						</div>
						<h3 class="mb-3 text-xl font-bold text-slate-900">تدريبات بايثون</h3>
						<p class="mb-6 flex-grow leading-relaxed text-slate-600">
							لصقل مهاراتك في بايثون عبر حل مجموعة من التحديات البرمجية المتدرجة في الصعوبة.
						</p>
						<div
							class="mt-auto w-full rounded-lg bg-emerald-500 py-2.5 text-center font-semibold text-white transition-colors duration-300 group-hover:bg-emerald-600"
						>
							ابدأ التعلم
						</div>
					</a>

					<a
						href="/signup"
						class="group relative flex h-full transform flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60"
					>
						<div
							class="absolute top-4 right-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 rtl:right-auto rtl:left-4"
						>
							متاح الآن
						</div>
						<div class="mb-5 flex h-16 w-16 items-center justify-center">
							<enhanced:img
								src="$assets/images/logos/python.png"
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

					<a
						href="/signup"
						class="group relative flex h-full transform flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60"
					>
						<div
							class="absolute top-4 right-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 rtl:right-auto rtl:left-4"
						>
							متاح الآن
						</div>
						<div class="mb-5 flex h-16 w-16 items-center justify-center">
							<enhanced:img
								src="$assets/images/logos/internet.png"
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
							<enhanced:img
								src="$assets/images/logos/javascript.png"
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

		<section id="pricing" class="bg-white py-24">
			<div class="container mx-auto px-6">
				<div class="mx-auto max-w-4xl text-center">
					<h2 class="mb-4 text-4xl font-bold text-gray-900">خطط مرنة تناسب رحلتك</h2>
					<p class="mb-8 text-xl text-gray-600">
						ابدأ مجاناً، ثم قم بالترقية لفتح كامل إمكانياتك البرمجية.
					</p>

					<div class="mx-auto mb-12 grid max-w-2xl gap-8 md:grid-cols-2">
						<div class="rounded-2xl border-2 border-gray-200 bg-gray-50 p-8">
							<h3 class="mb-4 text-2xl font-bold text-gray-900">البداية المجانية</h3>
							<div class="mb-2 text-4xl font-bold text-gray-900">مجاناً</div>
							<p class="mb-6 text-gray-600">للأبد، لتجربة المنصة والبدء</p>
							<ul class="mb-8 space-y-3 text-right text-gray-900">
								<li class="flex items-center">
									<Icon name="check-circle" class="ml-3 text-green-500" size={20} />
									الوحدة الأولية من بايثون
								</li>
								<li class="flex items-center">
									<Icon name="check-circle" class="ml-3 text-green-500" size={20} />
									مسار كيف يعمل الإنترنت
								</li>
								<li class="flex items-center">
									<Icon name="check-circle" class="ml-3 text-green-500" size={20} />
									تمارين تفاعلية أساسية
								</li>
								<li class="flex items-center">
									<Icon name="check-circle" class="ml-3 text-green-500" size={20} />
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

						<div
							class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white shadow-2xl shadow-emerald-500/30"
						>
							<div
								class="absolute top-4 left-4 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-amber-900 rtl:right-4 rtl:left-auto"
							>
								الأكثر شعبية
							</div>
							<h3 class="mb-4 text-2xl font-bold">العضوية المميزة</h3>
							<div class="mb-2 text-4xl font-bold">$10 USD</div>
							<p class="mb-6 text-emerald-100">شهرياً</p>
							<ul class="mb-8 space-y-3 text-right">
								<li class="flex items-center">
									<Icon name="check-circle" class="ml-3 text-emerald-200" size={20} />
									<strong class="font-bold">كل شيء </strong> في الخطة المجانية
								</li>
								<li class="flex items-center">
									<Icon name="check-circle" class="ml-3 text-emerald-200" size={20} />
									وصول كامل لجميع المسارات
								</li>
								<li class="flex items-center">
									<Icon name="check-circle" class="ml-3 text-emerald-200" size={20} />
									تحديات برمجية متقدمة
								</li>
							</ul>
							<a
								class="block w-full rounded-xl bg-gray-200 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-300"
								href="/signup"
							>
								ابدأ مجاناً
							</a>
						</div>
					</div>

					<p class="text-sm text-gray-500">
						💡 نصيحة: ابدأ مجاناً لتجربة المنصة، ثم قم بالترقية عندما تصبح جاهزاً للمزيد.
					</p>
				</div>
			</div>
		</section>

		<section class="bg-slate-50 py-20 lg:py-24">
			<div class="container mx-auto px-6">
				<div class="mb-12 text-center">
					<h2 class="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">أسئلة شائعة</h2>
					<p class="mx-auto max-w-xl text-lg text-slate-600 lg:text-xl">
						هل لديك سؤال؟ لقد قمنا بالإجابة على أكثر الاستفسارات شيوعًا.
					</p>
				</div>
				<div class="mx-auto max-w-3xl space-y-4">
					{#each faqs as faq, i}
						<details
							class="group rounded-lg border border-slate-200 bg-white p-6 [&_summary::-webkit-details-marker]:hidden"
							open={i === 0}
						>
							<summary
								class="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900"
							>
								<h2 class="text-lg font-medium">{faq.question}</h2>
								<span class="relative h-5 w-5 shrink-0">
									<Icon
										name="plus"
										class="absolute inset-0 opacity-100 group-open:opacity-0"
										size={20}
									/>
									<Icon
										name="minus"
										class="absolute inset-0 opacity-0 group-open:opacity-100"
										size={20}
									/>
								</span>
							</summary>
							<p class="mt-4 leading-relaxed text-slate-600">{faq.answer}</p>
						</details>
					{/each}
				</div>
			</div>
		</section>

		<section class="bg-gradient-to-br from-emerald-500 to-emerald-600 py-24 text-white">
			<div class="container mx-auto px-6 text-center">
				<div class="mx-auto max-w-3xl">
					<h2 class="mb-6 text-4xl font-bold lg:text-5xl">جاهز لكتابة أول سطر كود؟</h2>
					<p class="mb-8 text-xl leading-relaxed text-emerald-100">
						انضم إلى نسختنا التجريبية وكن من أوائل من يساهمون في بناء أفضل منصة تعليم برمجي عربية.
						رأيك مهم لنا.
					</p>

					<div class="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/signup"
							class="transform rounded-xl bg-white px-10 py-4 text-lg font-bold text-emerald-600 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-50"
						>
							سجل مجاناً الآن
						</a>
					</div>

					<div class="flex flex-wrap items-center justify-center gap-8 text-emerald-100">
						<div class="flex items-center">
							<Icon name="check-circle" size={24} class="me-2" />
							مجاني 100% للبدء
						</div>
						<div class="flex items-center">
							<Icon name="check-lock" size={24} class="me-2" />
							لا حاجة لبطاقة بنكية
						</div>
						<div class="flex items-center">
							<Icon name="target" size={24} class="me-2" />
							وصول فوري للمحتوى
						</div>
					</div>
				</div>
			</div>
		</section>

		<Footer />
	</main>
</div>

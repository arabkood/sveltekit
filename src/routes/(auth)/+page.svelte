<script lang="ts">
	import Footer from '$ui/shared/Footer.svelte';
	import Seo from '$ui/others/SEO.svelte';
	import { SITE } from '$config';
	import Navbar from '$ui/shared/Navbar.svelte';
	import Hero from '$ui/home/Hero.svelte';
	import Demo from '$ui/home/Demo.svelte';
	import Features from '$ui/home/Features.svelte';
	import Testimonials from '$ui/home/Testimonials.svelte';
	import FeaturedTracks from '$ui/home/FeaturedTracks.svelte';
	import Faq from '$ui/home/Faq.svelte';
	import Reminder from '$ui/home/Reminder.svelte';

	let mobileMenuOpen = $state(false);

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
			url: 'https://akood.com',
			logo: 'https://akood.com/images/logo.png',
			description: seoDescription,
			foundingDate: '2024',
			sameAs: ['https://x.com/akood_com', 'https://github.com/arabkood'],
			contactPoint: {
				'@type': 'ContactPoint',
				contactType: 'customer service',
				availableLanguage: 'Arabic'
			},
			parentOrganization: {
				'@type': 'Organization',
				name: 'Lubab LTD',
				url: 'https://lubab.dev',
				founder: {
					'@type': 'Person',
					name: 'Lubab',
					jobTitle: 'Software Engineer',
					url: 'https://lubab.dev'
				}
			}
		},
		// Website schema
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'أكود - منصة تعلم البرمجة',
			url: 'https://akood.com',
			description: seoDescription,
			inLanguage: 'ar',
			potentialAction: {
				'@type': 'SearchAction',
				target: 'https://akood.com/courses?q={search_term_string}',
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
					url: 'https://akood.com/courses/python-beginner'
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
					url: 'https://akood.com/courses/python-practice'
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
					url: 'https://akood.com/courses/web-internet'
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

<div class="bg-gray-950 pt-16 selection:bg-emerald-100">
	<Navbar logoVariant="withText" />

	<main class="relative w-full border-t dark:border-white/10">
		<Hero />

		<Demo />

		<Features />

		<FeaturedTracks />

		<Testimonials />

		<Faq />

		<Reminder />

		<Footer />
	</main>
</div>

<style>
	:global(.lesson-box-shared-footer) {
		position: absolute !important;
	}

	:global(.lesson-box-shared-fill) {
		border: none;
	}
</style>

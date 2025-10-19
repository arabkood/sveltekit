<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SITE, SITE_NAME_AR, SITE_NAME_EN, SITE_NAME_FULL } from '$config';
	import { i18n } from '$i18n/i18n';
	import Seo from '$ui/others/SEO.svelte';
	import { toPublicUrl } from '$utils/s3-public-assets';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Get search query from URL
	const searchQuery = $derived(page.url.searchParams.get('q') || '');
	let searchInput = $state(searchQuery);

	// Filter courses and tracks based on search
	const filteredCourses = $derived(() => {
		if (!searchQuery.trim()) {
			return Object.values(data.courses);
		}

		const query = searchQuery.toLowerCase().trim();
		const courses = Object.values(data.courses);

		return courses
			.map((course) => ({
				...course,
				tracks: course.tracks.filter((track) => {
					const titleMatch = track.title.toLowerCase().includes(query);
					const topicMatch = course.topic.title.toLowerCase().includes(query);
					const blurbMatch = course.topic.blurb?.toLowerCase().includes(query);
					return titleMatch || topicMatch || blurbMatch;
				})
			}))
			.filter((course) => course.tracks.length > 0);
	});

	// Handle search submission
	function handleSearch(e: Event) {
		e.preventDefault();
		const query = searchInput.trim();
		if (query) {
			goto(`/courses?q=${encodeURIComponent(query)}`);
		} else {
			goto('/courses');
		}
	}

	// Clear search
	function clearSearch() {
		searchInput = '';
		goto('/courses');
	}

	// SEO data
	const seoTitle = `${SITE_NAME_AR} | تعلم البرمجة تفاعلياً بالممارسة العملية`;
	const seoDescription = `${SITE_NAME_AR} - منصة تعلم ذاتي تفاعلية للبرمجة. لا فيديوهات، بل تطبيق مباشر! حل التحديات البرمجية، اكتب الكود، واختبر نفسك من اليوم الأول. تعلم بايثون والويب بطريقة عملية 100%.`;
	const seoKeywords = `تعلم البرمجة التفاعلي, تمارين برمجة, تحديات كود, تعلم ذاتي, بايثون تفاعلي, برمجة عملية, ${SITE_NAME_AR}, ${SITE_NAME_EN}, تطبيق مباشر, بدون فيديوهات`;

	// Homepage schema markup
	const homepageSchema = [
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: SITE_NAME_FULL,
			alternateName: [SITE_NAME_AR, SITE_NAME_EN, SITE],
			url: SITE,
			logo: `${SITE}/images/logo.png`,
			description:
				'منصة تعلم ذاتي تفاعلية للبرمجة بدون فيديوهات - تعلم بالممارسة المباشرة والتطبيق العملي',
			foundingDate: '2024',
			sameAs: [
				'https://x.com/akood_com',
				'https://facebook.com/akood_com',
				'https://github.com/arabkood'
			],
			contactPoint: {
				'@type': 'ContactPoint',
				contactType: 'customer service',
				availableLanguage: 'Arabic'
			},
			makesOffer: {
				'@type': 'Offer',
				itemOffered: {
					'@type': 'Course',
					name: 'دورات البرمجة التفاعلية',
					description: 'تعلم البرمجة من خلال التطبيق المباشر والتحديات العملية'
				},
				availability: 'https://schema.org/InStock'
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: `${SITE_NAME_AR} - تعلم البرمجة تفاعلياً`,
			url: SITE,
			description: seoDescription,
			inLanguage: 'ar',
			audience: {
				'@type': 'Audience',
				audienceType: 'self-learners, programming beginners, coding students'
			},
			mainContentOfPage: {
				'@type': 'WebPageElement',
				name: 'Interactive Programming Exercises'
			},
			potentialAction: {
				'@type': 'SearchAction',
				target: `${SITE}/courses?q={search_term_string}`,
				'query-input': 'required name=search_term_string'
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: 'كورسات البرمجة التفاعلية',
			description: 'تعلم البرمجة من خلال التطبيق المباشر - بدون فيديوهات، فقط ممارسة عملية',
			itemListElement: [
				{
					'@type': 'Course',
					position: 1,
					name: 'بايثون للمبتدئين - تطبيق تفاعلي',
					description: 'تعلم بايثون من خلال كتابة الكود وحل التحديات البرمجية المباشرة',
					courseMode: 'online',
					educationalCredentialAwarded: 'Certificate of Completion',
					interactionType: 'hands-on practice',
					teaches: ['Python basics', 'Problem solving', 'Code writing'],
					provider: {
						'@type': 'Organization',
						name: SITE_NAME_FULL
					},
					educationalLevel: 'مبتدئ',
					url: `${SITE}/courses/beginner@python`
				},
				{
					'@type': 'Course',
					position: 2,
					name: 'كيف يعمل الإنترنت - استكشاف تفاعلي',
					description: 'اكتشف أسرار الإنترنت من خلال التجارب التفاعلية والأنشطة العملية',
					courseMode: 'online',
					educationalCredentialAwarded: 'Certificate of Completion',
					interactionType: 'interactive exploration',
					teaches: ['Internet protocols', 'DNS', 'HTTP', 'Web fundamentals'],
					provider: {
						'@type': 'Organization',
						name: SITE_NAME_FULL
					},
					educationalLevel: 'مبتدئ',
					url: `${SITE}/courses/internet@web`
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
/>

<div class="bg-page min-h-screen">
	<div class="mx-auto max-w-7xl p-6 lg:p-8">
		<!-- Header with Search -->
		<div class="bg-section mb-8 rounded-2xl p-6 shadow-sm backdrop-blur-xl">
			<div class="flex flex-col gap-4">
				<div>
					<h1 class="font-arabic text-3xl font-bold">
						{i18n.t('tracks.explore.title')}
					</h1>
					<p class="mt-2 opacity-60">{i18n.t('tracks.explore.description')}</p>
				</div>

				<!-- Search Form -->
				<form onsubmit={handleSearch} class="relative">
					<div class="relative">
						<input
							type="search"
							bind:value={searchInput}
							placeholder="ابحث عن الكورسات..."
							class="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-right text-gray-900 placeholder-gray-500 transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
							aria-label="البحث في الكورسات"
						/>
						<div class="absolute top-1/2 right-3 -translate-y-1/2">
							{#if searchInput}
								<button
									type="button"
									onclick={clearSearch}
									class="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
									aria-label="مسح البحث"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							{:else}
								<svg
									class="h-5 w-5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							{/if}
						</div>
					</div>
				</form>

				<!-- Search Results Info -->
				{#if searchQuery}
					<div class="text-sm text-gray-600 dark:text-gray-400">
						{#if filteredCourses().length > 0}
							تم العثور على {filteredCourses().reduce((acc, c) => acc + c.tracks.length, 0)} نتيجة لـ
							"<span class="font-semibold">{searchQuery}</span>"
						{:else}
							لا توجد نتائج لـ "<span class="font-semibold">{searchQuery}</span>"
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Courses List -->
		{#if filteredCourses().length === 0 && searchQuery}
			<div class="bg-section rounded-2xl p-12 text-center shadow-sm">
				<svg
					class="mx-auto h-16 w-16 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
					لم يتم العثور على نتائج
				</h3>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
					جرب كلمات مفتاحية مختلفة أو تصفح جميع الكورسات
				</p>
				<button
					type="button"
					onclick={clearSearch}
					class="bg-primary-600 hover:bg-primary-700 mt-4 rounded-lg px-6 py-2 text-sm font-semibold text-white transition-colors"
				>
					عرض جميع الكورسات
				</button>
			</div>
		{:else}
			{#each filteredCourses() as course}
				<div
					class="mb-8 border-b-1 border-gray-200 pt-8 pb-16 last:border-b-0 dark:border-gray-700"
				>
					<div class="mb-6 flex items-center sm:mb-8">
						{#if course.topic.logo}
							<img
								src={toPublicUrl(course.topic.logo)}
								alt="{course.topic.title} logo"
								class="me-8 h-16 w-16 object-contain sm:h-18 sm:w-18"
							/>
						{/if}
						<div class="flex-grow">
							<h2
								class="text-xl leading-tight font-bold text-gray-800 sm:text-2xl dark:text-gray-100"
							>
								{course.topic.title}
							</h2>
							<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{course.topic.blurb}</p>
						</div>
					</div>

					<div class="rounded-xl bg-gray-100/70 p-3 sm:p-4 dark:bg-gray-800/70">
						<div
							class="scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500 scrollbar-track-transparent scrollbar-thumb-rounded-full flex space-x-3 space-x-reverse overflow-x-auto px-4 py-6 sm:space-x-4"
						>
							{#each course.tracks as track}
								<svelte:element
									this={track.comingSoon ? 'div' : 'a'}
									href={track.comingSoon ? undefined : 'courses/' + track.slug}
									title={track.comingSoon
										? track.title + ' - ' + i18n.t('common.coming_soon')
										: track.title}
									class="group block h-[240px] w-[220px] flex-shrink-0 {track.comingSoon
										? 'cursor-not-allowed'
										: ''}"
								>
									<div
										class="relative flex h-full flex-col overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-500 ease-out {track.comingSoon
											? 'border-gray-200/40 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:border-gray-700/30 dark:from-gray-800/50 dark:to-gray-900/50'
											: 'border-gray-200/60 bg-gradient-to-br from-white to-gray-50/50 group-hover:-translate-y-2 group-hover:scale-[1.02] dark:border-gray-700/50 dark:from-gray-800 dark:to-gray-900/80'}"
									>
										{#if track.comingSoon}
											<div class="absolute top-3 left-3 z-10">
												<span
													class="inline-flex items-center gap-1 rounded-full border border-orange-200/50 bg-gradient-to-r from-orange-400 to-amber-500 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm"
												>
													<svg class="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
														<path
															fill-rule="evenodd"
															d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
															clip-rule="evenodd"
														/>
													</svg>
													{i18n.t('common.coming_soon')}
												</span>
											</div>
										{/if}

										{#if track.premiumOnly}
											<div class="absolute top-3 z-10 {track.comingSoon ? 'right-3' : 'left-3'}">
												<span
													class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm {track.comingSoon
														? 'border-white/10 bg-gradient-to-r from-purple-400/70 to-pink-400/70 opacity-60'
														: 'border-white/20 bg-gradient-to-r from-purple-500 to-pink-500'}"
												>
													<svg class="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
														<path
															d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
														/>
													</svg>
													{i18n.t('common.premium_only')}
												</span>
											</div>
										{/if}

										<div class="relative flex flex-1 items-center justify-center p-6">
											{#if track.logo}
												<div class="group/image relative">
													<img
														src={toPublicUrl(track.logo)}
														alt=""
														class="max-h-[140px] max-w-[140px] object-contain transition-all duration-500 {track.comingSoon
															? 'opacity-40 grayscale filter'
															: 'group-hover:scale-110 group-hover:brightness-110'}"
														height="140"
														width="140"
													/>
													{#if track.comingSoon}
														<div class="absolute inset-0 flex items-center justify-center">
															<div
																class="rounded-full bg-white/80 p-3 shadow-lg dark:bg-gray-800/80"
															>
																<svg
																	class="h-6 w-6 text-orange-500"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		stroke-width="2"
																		d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
																	/>
																</svg>
															</div>
														</div>
													{/if}
												</div>
											{/if}
										</div>

										<div class="px-4 pb-5">
											<h3
												class="text-center text-sm leading-tight font-semibold {track.comingSoon
													? 'text-gray-500 dark:text-gray-400'
													: 'group-hover:text-primary-600 dark:group-hover:text-primary-400 text-gray-900 transition-colors duration-300 dark:text-white'}"
											>
												{track.title}
											</h3>
											<div
												class="mx-auto mt-2 h-0.5 rounded-full {track.comingSoon
													? 'w-8 bg-gradient-to-r from-orange-400 to-amber-500 opacity-60'
													: 'from-primary-500 w-0 bg-gradient-to-r to-purple-500 transition-all duration-500 group-hover:w-12'}"
											></div>
										</div>
									</div>
								</svelte:element>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

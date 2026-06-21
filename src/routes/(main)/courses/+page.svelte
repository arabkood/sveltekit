<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SITE, SITE_NAME_AR, SITE_NAME_EN, SITE_NAME_FULL } from '$config';
	import { i18n } from '$i18n/i18n';
	import Seo from '$ui/others/SEO.svelte';
	import { toPublicUrl } from '$utils/s3-public-assets';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const searchQuery = $derived(page.url.searchParams.get('q') || '');
	let searchInput = $state(searchQuery);

	const filteredCourses = $derived(() => {
		if (!searchQuery.trim()) return Object.values(data.courses);
		const query = searchQuery.toLowerCase().trim();
		return Object.values(data.courses)
			.map((course) => ({
				...course,
				tracks: course.tracks.filter((track) => {
					return (
						track.title.toLowerCase().includes(query) ||
						course.topic.title.toLowerCase().includes(query) ||
						course.topic.blurb?.toLowerCase().includes(query)
					);
				})
			}))
			.filter((course) => course.tracks.length > 0);
	});

	function handleSearch(e: Event) {
		e.preventDefault();
		const query = searchInput.trim();
		if (query) goto(`/courses?q=${encodeURIComponent(query)}`);
		else goto('/courses');
	}

	function clearSearch() {
		searchInput = '';
		goto('/courses');
	}

	const seoTitle = `${SITE_NAME_AR} | تعلم البرمجة تفاعلياً بالممارسة العملية`;
	const seoDescription = `${SITE_NAME_AR} - منصة تعلم ذاتي تفاعلية للبرمجة. لا فيديوهات، بل تطبيق مباشر! حل التحديات البرمجية، اكتب الكود، واختبر نفسك من اليوم الأول. تعلم بايثون والويب بطريقة عملية 100%.`;
	const seoKeywords = `تعلم البرمجة التفاعلي, تمارين برمجة, تحديات كود, تعلم ذاتي, بايثون تفاعلي, برمجة عملية, ${SITE_NAME_AR}, ${SITE_NAME_EN}, تطبيق مباشر, بدون فيديوهات`;

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
			potentialAction: {
				'@type': 'SearchAction',
				target: `${SITE}/courses?q={search_term_string}`,
				'query-input': 'required name=search_term_string'
			}
		}
	];

	const totalResults = $derived(filteredCourses().reduce((acc, c) => acc + c.tracks.length, 0));
</script>

<Seo
	title={seoTitle}
	description={seoDescription}
	keywords={seoKeywords}
	schema={homepageSchema}
	lang="ar"
/>

<div class="bg-page min-h-screen">
	<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-10">
			<div class="mb-6">
				<h1 class="font-arabic text-3xl font-bold tracking-tight sm:text-4xl">
					{i18n.t('tracks.explore.title')}
				</h1>
				<p class="mt-2 text-base opacity-50">{i18n.t('tracks.explore.description')}</p>
			</div>

			<!-- Search -->
			<form onsubmit={handleSearch} class="relative max-w-xl">
				<input
					type="search"
					bind:value={searchInput}
					placeholder="ابحث عن الكورسات..."
					class="
						focus:border-primary-400 focus:ring-primary-400/20 dark:focus:border-primary-500 w-full rounded-xl
						border border-gray-200 bg-white
						py-3 ps-4 pe-12
						text-right
						text-gray-900 placeholder-gray-400
						transition-all duration-150 focus:ring-2
						focus:outline-none dark:border-gray-700 dark:bg-gray-800/80 dark:text-white
						dark:placeholder-gray-500
					"
					aria-label="البحث في الكورسات"
				/>
				<div class="absolute end-3.5 top-1/2 -translate-y-1/2">
					{#if searchInput}
						<button
							type="button"
							onclick={clearSearch}
							class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
							aria-label="مسح البحث"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
							class="h-4 w-4 text-gray-400"
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
			</form>

			{#if searchQuery}
				<p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
					{#if totalResults > 0}
						<span class="font-semibold text-gray-700 dark:text-gray-300">{totalResults}</span> نتيجة
						لـ "<span class="font-semibold text-gray-700 dark:text-gray-300">{searchQuery}</span>"
					{:else}
						لا توجد نتائج لـ "<span class="font-semibold">{searchQuery}</span>"
					{/if}
				</p>
			{/if}
		</div>

		<!-- Empty State -->
		{#if filteredCourses().length === 0 && searchQuery}
			<div
				class="flex flex-col items-center justify-center rounded-2xl border border-gray-200/60 bg-gray-50 py-20 text-center dark:border-gray-700/40 dark:bg-gray-800/40"
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
				>
					<svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h3 class="text-base font-semibold text-gray-900 dark:text-white">
					لم يتم العثور على نتائج
				</h3>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
					جرب كلمات مفتاحية مختلفة أو تصفح جميع الكورسات
				</p>
				<button
					type="button"
					onclick={clearSearch}
					class="bg-primary-600 hover:bg-primary-700 mt-6 rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors"
				>
					عرض جميع الكورسات
				</button>
			</div>
		{:else}
			<div class="space-y-14">
				{#each filteredCourses() as course}
					<section>
						<!-- Course Header -->
						<div class="mb-5 flex items-center gap-4">
							{#if course.topic.logo}
								<img
									src={toPublicUrl(course.topic.logo)}
									alt="{course.topic.title} logo"
									class="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
								/>
							{/if}
							<div>
								<h2 class="text-lg font-bold text-gray-900 sm:text-xl dark:text-gray-100">
									{course.topic.title}
								</h2>
								{#if course.topic.blurb}
									<p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
										{course.topic.blurb}
									</p>
								{/if}
							</div>
						</div>

						<!-- Tracks Scroll Container -->
						<div class="relative rounded-2xl bg-gray-100/60 p-3 dark:bg-gray-800/20">
							<div
								class="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent scrollbar-thumb-rounded-full flex gap-3 overflow-x-auto px-2 py-4"
							>
								{#each course.tracks as track}
									<svelte:element
										this={track.comingSoon ? 'div' : 'a'}
										href={track.comingSoon ? undefined : 'courses/' + track.slug}
										title={track.comingSoon
											? track.title + ' - ' + i18n.t('common.coming_soon')
											: track.title}
										class="group block h-[230px] w-[200px] shrink-0 {track.comingSoon
											? 'cursor-not-allowed'
											: 'cursor-pointer'}"
									>
										<div
											class="
												relative flex h-full flex-col overflow-hidden rounded-2xl border backdrop-blur-sm
												transition-all duration-300 ease-out
												{track.comingSoon
												? 'border-gray-200/40 bg-gradient-to-b from-gray-50 to-gray-100/60 dark:border-gray-700/30 dark:from-gray-800/50 dark:to-gray-900/50'
												: 'border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] group-hover:-translate-y-1.5 group-hover:border-gray-300/80 group-hover:shadow-[0_4px_8px_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.08)] dark:border-gray-700/50 dark:bg-gray-800 dark:group-hover:border-gray-600/60'}
											"
										>
											<!-- Badges -->
											{#if track.comingSoon}
												<div class="absolute start-3 top-3 z-10">
													<span
														class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm"
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
												<div class="absolute top-3 z-10 {track.comingSoon ? 'end-3' : 'start-3'}">
													<span
														class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold text-white shadow-sm {track.comingSoon
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

											<!-- Image -->
											<div class="relative flex flex-1 items-center justify-center p-6">
												{#if track.logo}
													<img
														src={toPublicUrl(track.logo)}
														alt=""
														class="max-h-[120px] max-w-[120px] object-contain transition-all duration-300 {track.comingSoon
															? 'opacity-35 grayscale'
															: 'group-hover:scale-105'}"
														height="120"
														width="120"
													/>
													{#if track.comingSoon}
														<div class="absolute inset-0 flex items-center justify-center">
															<div
																class="rounded-full bg-white/70 p-2.5 shadow-md dark:bg-gray-900/70"
															>
																<svg
																	class="h-5 w-5 text-orange-400"
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
												{/if}
											</div>

											<!-- Title -->
											<div class="px-4 pb-5 text-center">
												<h3
													class="text-sm leading-tight font-semibold tracking-[-0.01em] {track.comingSoon
														? 'text-gray-400 dark:text-gray-500'
														: 'group-hover:text-primary-600 dark:group-hover:text-primary-400 text-gray-800 transition-colors duration-200 dark:text-gray-200'}"
												>
													{track.title}
												</h3>
												<!-- Animated underline accent -->
												{#if !track.comingSoon}
													<div
														class="from-primary-500 mx-auto mt-2 h-0.5 w-0 rounded-full bg-gradient-to-r to-emerald-500 transition-all duration-300 group-hover:w-10"
													></div>
												{/if}
											</div>
										</div>
									</svelte:element>
								{/each}
							</div>
						</div>
					</section>
				{/each}
			</div>
		{/if}
	</div>
</div>

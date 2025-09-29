<script lang="ts">
	import { page } from '$app/state';
	import { SITE, SITE_NAME_AR, SITE_NAME_EN, SITE_NAME_FULL } from '$config';
	import { i18n } from '$i18n/i18n';
	import type { TranslationKey } from '$types/i18n';
	import Seo from '$ui/others/SEO.svelte';
	import Tab from '$ui/tabs/Tab.svelte';
	import TabList from '$ui/tabs/TabList.svelte';
	import TabPanel from '$ui/tabs/TabPanel.svelte';
	import Tabs from '$ui/tabs/Tabs.svelte';
	import { toPublicUrl } from '$utils/s3-public-assets';
	import type { LayoutServerData } from './$types';
	import Track from './Track.svelte';
	import TrackHeader from './TrackHeader.svelte';
	import TrackProgress from './TrackProgress.svelte';

	let { data }: { data: LayoutServerData } = $props();

	const nextItem = $derived.by(() => {
		if (!data.modules) return null;
		for (const module of data.modules) {
			for (const item of module.items) {
				if (!item.submission?.status || item.submission.status !== 'pass') {
					return { module, item };
				}
			}
		}
		return null;
	});

	const difficultyLevel = $derived.by(() => {
		const map: Record<string, 0 | 1 | 2 | 3 | 4> = {
			beginner: 1,
			intermediate: 2,
			advanced: 3,
			expert: 4
		};
		return map[data.track.difficulty?.toLowerCase() ?? ''] ?? 0;
	});

	const difficultyLabel = $derived.by(() => {
		const key = (data.track.difficulty ?? 'unknown').toLowerCase();
		const translationKey = `tracks.difficulty.${key}` as TranslationKey;
		const translated = i18n.t(translationKey);
		return translated !== translationKey ? translated : key;
	});

	// SEO setup
	const seoTitle = $derived(
		`${data.track.title} - كورس ${difficultyLabel} تفاعلي | ${SITE_NAME_AR}`
	);
	const seoDescription = $derived(
		data.track.blurb ||
			`تعلم ${data.track.title} بالممارسة العملية مع كورسنا ${difficultyLabel}. تطبيق مباشر وتحديات برمجية بدون فيديوهات.`
	);
	const seoImage = $derived(data.track.logo ? toPublicUrl(data.track.logo) : undefined);
	const seoKeywords = $derived(data.track.tags?.join(', '));

	// Simple schema - just the essentials
	const courseSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: data.track.title,
		description: seoDescription,
		image: seoImage,
		provider: {
			'@type': 'Organization',
			name: SITE_NAME_FULL,
			alternateName: [SITE_NAME_AR, SITE_NAME_EN, SITE],
			url: SITE
		},
		educationalLevel: difficultyLabel,
		url: `${page.url.origin}${page.url.pathname}`,
		inLanguage: 'ar'
	});
</script>

<Seo
	title={seoTitle}
	description={seoDescription}
	image={seoImage}
	keywords={seoKeywords}
	schema={courseSchema}
/>

<TrackHeader
	level={difficultyLabel}
	levelBars={difficultyLevel}
	category={data.track.tags || []}
	title={data.track.title}
	description={data.track.blurb ?? undefined}
	buttonHref={nextItem
		? `/courses/${data.track.slug}/${nextItem.item.slug}/${nextItem.item.type}`
		: undefined}
	buttonText={i18n.t('common.continue_learning')}
	imageSrc={data.track.logo ? toPublicUrl(data.track.logo) : undefined}
	imageAlt={data.track.title}
/>

<!-- Desktop -->
<div class="mx-auto hidden min-h-screen max-w-7xl grid-cols-[1fr_380px] lg:grid">
	<main class="mt-4 p-4">
		<h2 class="mb-6 text-xl font-bold text-slate-800 dark:text-white">
			{i18n.t('common.track_content')}
		</h2>
		<Track
			isPremium={data.user?.premiumActive}
			modules={data.modules}
			nextItem={nextItem?.item}
			track={data.track}
		/>
	</main>
	<aside class="mt-4 p-4">
		<h2 class="mb-6 text-xl font-bold text-slate-800 dark:text-white">
			{i18n.t('common.your_progress')}
		</h2>
		<TrackProgress modules={data.modules} />
	</aside>
</div>

<!-- Mobile -->
<div class="mx-auto min-h-screen max-w-7xl lg:hidden">
	<Tabs variant="default" size="lg">
		<TabList>
			<Tab index={0}>{i18n.t('common.track_content')}</Tab>
			<Tab index={1}>{i18n.t('common.your_progress')}</Tab>
		</TabList>
		<TabPanel index={0} transition="slide">
			<main class="p-4">
				<Track
					isPremium={data.user?.premiumActive}
					modules={data.modules}
					nextItem={nextItem?.item}
					track={data.track}
				/>
			</main>
		</TabPanel>
		<TabPanel index={1} transition="slide">
			<div class="p-4">
				<TrackProgress modules={data.modules} />
			</div>
		</TabPanel>
	</Tabs>
</div>

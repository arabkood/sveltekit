<script lang="ts">
	import type { PageData } from './$types';
	import { i18n } from '$i18n/i18n';
	import { page } from '$app/state';
	import { serializeSchema } from '$utils/json-ld';
	import Icon from '$ui/common/Icon.svelte';

	let { data }: { data: PageData } = $props();
	const { englishTerm, details } = data;

	const canonicalUrl = $derived(`${page.url.origin}${page.url.pathname}`);
	const pageTitle = $derived(`ما هو تعريف ${details.t} (${englishTerm})؟ | ${i18n.t('site.name')}`);
	const metaDescription = $derived(
		`شرح مفصل وتعريف للمصطلح البرمجي '${details.t}' (${englishTerm}): ${details.d.substring(0, 150)}...`
	);

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'DefinedTermSet',
		name: 'مسرد المصطلحات البرمجية',
		description: 'مرجع شامل للمصطلحات البرمجية الأساسية مع تعريفاتها باللغة العربية.',
		mainEntity: {
			'@type': 'DefinedTerm',
			name: englishTerm,
			alternateName: details.t,
			description: details.d,
			inDefinedTermSet: canonicalUrl.split('/').slice(0, -1).join('/') // URL of the main glossary
		}
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href={canonicalUrl} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html serializeSchema(schema)}
</svelte:head>

<div class="min-h-screen bg-white py-16 sm:py-24 dark:bg-gray-900">
	<div class="container mx-auto max-w-3xl px-4">
		<article>
			<div class="mb-4">
				<a
					href="/pages/glossary"
					class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
				>
					<Icon name="arrow-right" class="me-1 inline h-5 w-5" />
					العودة إلى المصطلحات</a
				>
			</div>
			<div dir="ltr">
				<h1
					class="text-primary-800 dark:text-primary-200 text-4xl font-extrabold tracking-tight capitalize sm:text-5xl"
				>
					{englishTerm}
				</h1>
			</div>
			<div class="mt-4 border-t border-slate-200 pt-6 dark:border-slate-700">
				<h2 class="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
					{details.t}
				</h2>
				<p class="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">{details.d}</p>
			</div>
		</article>
	</div>
</div>

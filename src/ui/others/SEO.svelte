<script lang="ts">
	import { page } from '$app/state';
	import { SITE } from '$config';

	interface SEOProps {
		title: string;
		description: string;
		image?: string;
		keywords?: string;
		schema?: object; // For structured data
		lang?: string; // Language code
	}

	let { title, description, image, keywords, schema, lang = 'ar' }: SEOProps = $props();

	const canonicalUrl = $derived(`${SITE}${page.url.pathname}`);
	const ogImage = $derived(image || `${SITE}/images/default.jpg`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if keywords}<meta name="keywords" content={keywords} />{/if}
	<!-- svelte-ignore hydration_attribute_changed -->
	<link rel="canonical" href={canonicalUrl} />

	<!-- Language and Direction -->
	<meta name="language" content={lang} />
	<meta name="content-language" content={lang} />

	<!-- Open Graph -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="ar_SA" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	<!-- Structured Data -->
	{#if schema}
		<!-- svelte-ignore hydration_html_changed -->
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/if}
</svelte:head>

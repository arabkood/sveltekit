<script lang="ts">
	import { SITE, SITE_NAME_FULL } from '$config';
	import Markdown from '$ui/common/Markdown.svelte';
	import Seo from '$ui/others/SEO.svelte';
	import Footer from '$ui/shared/Footer.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { post } = $derived(data);

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric'
		});
	}

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		image: post.coverImage || post.image,
		datePublished: post.date,
		dateModified: post.updated || post.date,
		author: {
			'@type': 'Person',
			name: post.author
		},
		publisher: {
			'@type': 'Organization',
			name: SITE_NAME_FULL,
			url: SITE
		}
	});
</script>

<Seo
	title={`${post.title} | مدونة أكود`}
	description={post.excerpt}
	image={post.coverImage || post.image}
	keywords={post.tags?.join(', ')}
	{schema}
	lang="ar"
/>

<!-- Cover Image -->
{#if post.coverImage || post.image}
	<div
		class="relative h-[400px] w-full overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600"
	>
		<img src={post.coverImage || post.image} alt={post.title} class="h-full w-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
	</div>
{/if}

<article class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- Header -->
	<header class="mb-12">
		<!-- Breadcrumb -->
		<nav class="mb-6 text-sm text-gray-500 dark:text-gray-400">
			<a href="/" class="hover:text-indigo-600 dark:hover:text-indigo-400">الرئيسية</a>
			<span class="mx-2">/</span>
			<a href="/blog" class="hover:text-indigo-600 dark:hover:text-indigo-400">المدونة</a>
			<span class="mx-2">/</span>
			<span class="text-gray-900 dark:text-white">{post.title}</span>
		</nav>

		<h1 class="mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl dark:text-white">
			{post.title}
		</h1>

		<!-- Meta Info -->
		<div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
			<span class="flex items-center gap-2">
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
				</svg>
				{post.author}
			</span>
			<span>•</span>
			<time datetime={post.date}>{formatDate(post.date)}</time>
			{#if post.readingTime}
				<span>•</span>
				<span>{post.readingTime} دقيقة قراءة</span>
			{/if}
		</div>

		<!-- Tags -->
		{#if post.tags && post.tags.length > 0}
			<div class="mt-6 flex flex-wrap gap-2">
				{#each post.tags as tag}
					<span
						class="rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-sm font-medium uppercase dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
					>
						{tag}
					</span>
				{/each}
			</div>
		{/if}
	</header>

	<!-- Content -->
	<div
		class="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-indigo-600 hover:prose-a:text-indigo-700 dark:prose-a:text-indigo-400 dark:hover:prose-a:text-indigo-300 max-w-none"
	>
		<Markdown markdown={post.content} evalPublicAssets={true} />
	</div>

	<!-- Updated Date -->
	{#if post.updated && post.updated !== post.date}
		<div
			class="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400"
		>
			آخر تحديث: {formatDate(post.updated)}
		</div>
	{/if}

	<!-- Post Navigation -->
	{#if data.previousPost || data.nextPost}
		<nav class="mt-16 border-gray-200 pt-4 dark:border-gray-800">
			<div class="grid gap-8 sm:grid-cols-2">
				{#if data.previousPost}
					<a
						href="/blog/{data.previousPost.slug}"
						class="group block rounded-lg border border-gray-200 p-6 transition-all hover:border-indigo-500 hover:shadow-md dark:border-gray-800 dark:hover:border-indigo-500"
					>
						<div
							class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
							<span>المقال السابق</span>
						</div>
						<h3
							class="font-bold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400"
						>
							{data.previousPost.title}
						</h3>
					</a>
				{/if}

				{#if data.nextPost}
					<a
						href="/blog/{data.nextPost.slug}"
						class="group block rounded-lg border border-gray-200 p-6 text-right transition-all hover:border-indigo-500 hover:shadow-md dark:border-gray-800 dark:hover:border-indigo-500"
					>
						<div
							class="mb-2 flex items-center justify-end gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
						>
							<span>المقال التالي</span>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</div>
						<h3
							class="font-bold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400"
						>
							{data.nextPost.title}
						</h3>
					</a>
				{/if}
			</div>
		</nav>
	{/if}
</article>

<Footer />

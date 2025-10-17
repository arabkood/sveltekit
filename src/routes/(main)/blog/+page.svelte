<script lang="ts">
	import { SITE } from '$config';
	import Seo from '$ui/others/SEO.svelte';
	import Footer from '$ui/shared/Footer.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { posts } = $derived(data);

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-SA', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric'
		});
	}

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: 'مدونة أكود',
		url: SITE + '/blog',
		description: 'مدونة أكود - مقالات متخصصة في تطوير الويب والبرمجة والتكنولوجيا'
	};
</script>

<Seo
	title="مدونة أكود | Akood Blog"
	description="مقالات متخصصة في تطوير الويب والبرمجة والتكنولوجيا"
	{schema}
	lang="ar"
/>

<!-- Hero -->
<div
	class="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-950"
>
	<div class="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
		<h1 class="mb-4 text-5xl font-bold text-white sm:text-6xl">مدونة أكود</h1>
		<p class="text-lg text-white/90">مقالات متخصصة في تطوير الويب والبرمجة والتكنولوجيا</p>
	</div>
</div>

<!-- Main -->
<div class="min-h-screen bg-gray-50 dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		{#if posts.length === 0}
			<div
				class="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="mb-4 text-6xl">📝</div>
				<p class="text-lg text-gray-600 dark:text-gray-400">لا توجد مقالات حالياً</p>
			</div>
		{:else}
			<!-- Featured Post -->
			<div class="mb-12">
				<a
					href="/blog/{posts[0].slug}"
					class="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl transition-shadow hover:shadow-2xl md:flex dark:border-gray-800 dark:bg-gray-900"
				>
					<div
						class="relative h-64 bg-gradient-to-br from-purple-500 to-indigo-600 md:h-auto md:w-1/2 dark:from-purple-700 dark:to-indigo-800"
					>
						{#if posts[0].image}
							<img src={posts[0].image} alt={posts[0].title} class="h-full w-full object-cover" />
						{:else}
							<div
								class="absolute inset-0 flex items-center justify-center text-9xl font-bold text-white/10"
							>
								{posts[0].title.charAt(0)}
							</div>
						{/if}
						<div class="absolute top-4 left-4 rounded-lg bg-orange-500 px-4 py-2">
							<span class="text-sm font-bold text-white">مميز</span>
						</div>
					</div>

					<div class="p-8 md:w-1/2">
						<div class="mb-3 text-sm text-gray-500 dark:text-gray-400">
							<time>{formatDate(posts[0].date)}</time>
							<span class="mx-2">•</span>
							<span>{posts[0].author}</span>
						</div>

						<h2
							class="mb-4 text-3xl font-bold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400"
						>
							{posts[0].title}
						</h2>

						<p class="mb-6 text-gray-600 dark:text-gray-400">
							{posts[0].excerpt}
						</p>

						<div class="flex flex-wrap gap-2">
							{#each posts[0].tags as tag}
								<span
									class="rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium uppercase dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
								>
									{tag}
								</span>
							{/each}
						</div>
					</div>
				</a>
			</div>

			<!-- Posts Grid -->
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each posts.slice(1) as post}
					<a
						href="/blog/{post.slug}"
						class="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900"
					>
						<div
							class="relative h-48 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 dark:from-cyan-600 dark:via-blue-700 dark:to-purple-800"
						>
							{#if post.coverImage}
								<img src={post.coverImage} alt={post.title} class="h-full w-full object-cover" />
							{:else}
								<div
									class="absolute inset-0 flex items-center justify-center text-7xl font-bold text-white/20"
								>
									{post.title.charAt(0)}
								</div>
							{/if}
						</div>

						<div class="p-6">
							<div class="mb-3 text-xs text-gray-500 dark:text-gray-400">
								<time>{formatDate(post.date)}</time>
								<span class="mx-2">•</span>
								<span>{post.author}</span>
							</div>

							<h3
								class="mb-3 text-xl font-bold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400"
							>
								{post.title}
							</h3>

							<p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
								{post.excerpt}
							</p>

							<div class="flex flex-wrap gap-2">
								{#each post.tags.slice(0, 2) as tag}
									<span
										class="rounded-md border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium uppercase dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
									>
										{tag}
									</span>
								{/each}
								{#if post.readingTime}
									<span class="mr-auto text-xs text-gray-500 dark:text-gray-400">
										{post.readingTime} دقيقة
									</span>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<Footer />

<script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { i18n } from '$i18n/i18n';
	import { serializeSchema } from '$utils/json-ld';
	import Icon from '$ui/common/Icon.svelte';
	import GlossaryItem from './GlossaryItem.svelte';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();

	let searchTerm = $state('');
	let searchInput: HTMLInputElement | undefined = $state();
	let activeSection = $state('');
	let showBackToTop = $state(false);

	const canonicalUrl = $derived(`${page.url.origin}${page.url.pathname}`);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeSection = entry.target.id.replace('letter-', '');
					}
				}
			},
			{ rootMargin: '-80px 0px -80% 0px' }
		);

		document.querySelectorAll('[id^="letter-"]').forEach((section) => {
			observer.observe(section);
		});

		const handleScroll = () => {
			showBackToTop = window.scrollY > 500;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', handleScroll);
		};
	});

	let filteredGlossary = $derived.by(() => {
		const lowerCaseSearch = searchTerm.toLowerCase().trim();
		if (!lowerCaseSearch) {
			return data.glossary;
		}

		const filtered: typeof data.glossary = {};
		for (const letter in data.glossary) {
			const matchingItems = data.glossary[letter].filter(
				([key, details]) =>
					key.toLowerCase().includes(lowerCaseSearch) ||
					details.t.toLowerCase().includes(lowerCaseSearch) ||
					details.d.toLowerCase().includes(lowerCaseSearch)
			);
			if (matchingItems.length > 0) {
				filtered[letter] = matchingItems;
			}
		}
		return filtered;
	});

	const alphabet = $derived(Object.keys(data.glossary));

	const totalTerms = $derived(
		Object.values(filteredGlossary).reduce((sum, items) => sum + items.length, 0)
	);

	const getResultsText = $derived.by(() => {
		const pr = new Intl.PluralRules('ar');
		const count = totalTerms;
		switch (pr.select(count)) {
			case 'zero':
				return 'لم يتم العثور على نتائج';
			case 'one':
				return 'تم العثور على نتيجة واحدة';
			case 'two':
				return 'تم العثور على نتيجتين';
			case 'few':
				return `تم العثور على ${count} نتائج`;
			case 'many':
				return `تم العثور على ${count} نتيجة`;
			default:
				return `تم العثور على ${count} نتيجة`;
		}
	});

	function scrollToSection(letter: string) {
		const element = document.getElementById(`letter-${letter}`);
		element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function clearSearch() {
		searchTerm = '';
		searchInput?.focus();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			clearSearch();
		}
		if ((event.metaKey || event.ctrlKey) && (event.key === 'k' || event.key === 'ك')) {
			event.preventDefault();
			searchInput?.focus();
		}
	}

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: Object.values(data.glossary)
			.flat()
			.map(([englishTerm, details]) => ({
				'@type': 'Question',
				name: `ما هو تعريف ${details.t} (${englishTerm})؟`,
				acceptedAnswer: {
					'@type': 'Answer',
					text: details.d
				}
			}))
	});
</script>

<svelte:head>
	<title>مسرد المصطلحات البرمجية | {i18n.t('site.name')}</title>
	<meta
		name="description"
		content="مرجع شامل للمصطلحات البرمجية الأساسية مع تعريفاتها باللغة العربية. مثالي للمطورين الجدد والمتعلمين."
	/>
	<link rel="canonical" href={canonicalUrl} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html serializeSchema(schema)}
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="min-h-screen bg-gray-50 font-sans text-gray-800 dark:bg-gray-900 dark:text-gray-200">
	<div class="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
		<header class="mb-12 text-center">
			<h1
				class="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100"
			>
				مصطلحات برمجية أساسية مترجمة
			</h1>
			<p class="mt-4 font-serif text-2xl text-gray-600 dark:text-gray-400">
				مرجع شامل للمطورين باللغة العربية
			</p>
			<p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
				يحتوي على {data.totalTerms} مصطلح • اضغط
				<kbd
					class="rounded border border-gray-300 bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
				>
					Ctrl+K
				</kbd>
				للبحث
			</p>

			<div class="mx-auto mt-8 max-w-lg">
				<div class="relative w-full">
					<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
						<Icon name="search" class="h-5 w-5 text-gray-400 dark:text-gray-500" />
					</div>
					<input
						bind:this={searchInput}
						type="search"
						bind:value={searchTerm}
						placeholder="ابحث عن مصطلح..."
						class="focus:border-primary-500 focus:ring-primary-500/50 w-full rounded-full border border-gray-300 bg-white py-3 pr-11 pl-10 text-lg text-gray-800 placeholder-gray-400 shadow-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
					/>
					{#if searchTerm}
						<button
							onclick={clearSearch}
							class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
							aria-label="مسح البحث"
						>
							<Icon name="x" class="h-5 w-5" />
						</button>
					{/if}
				</div>
				{#if searchTerm}
					<div class="mt-3" transition:fade={{ duration: 200 }}>
						<span
							class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
						>
							{getResultsText}
						</span>
					</div>
				{/if}
			</div>
		</header>

		<div class="sticky top-0 z-20 mb-10 bg-transparent py-3">
			<div
				class="flex flex-wrap justify-center gap-1.5 rounded-full border border-gray-200/75 bg-white/70 p-2 shadow-md backdrop-blur-md dark:border-gray-700/75 dark:bg-gray-800/70"
			>
				{#each alphabet as letter}
					<button
						onclick={() => scrollToSection(letter)}
						class="focus:ring-primary-500 grid h-9 w-9 place-items-center rounded-full font-bold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
						class:!bg-primary-600={activeSection === letter}
						class:!text-white={activeSection === letter}
						aria-label="اذهب إلى قسم {letter}"
						aria-current={activeSection === letter ? 'true' : 'false'}
					>
						{letter}
					</button>
				{/each}
			</div>
		</div>

		<main class="space-y-12">
			{#if Object.keys(filteredGlossary).length === 0}
				<div class="py-16 text-center" transition:fade={{ duration: 300 }}>
					<div
						class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700"
					>
						<Icon name="search-x" class="h-8 w-8 text-gray-500 dark:text-gray-400" />
					</div>
					<p class="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
						لم يتم العثور على مصطلحات مطابقة
					</p>
					<p class="mt-1 text-gray-500 dark:text-gray-400">جرّب البحث بكلمات أخرى.</p>
				</div>
			{:else}
				{#each Object.entries(filteredGlossary) as [letter, items] (letter)}
					<section>
						<h2
							id={'letter-' + letter}
							class="text-primary-700 dark:text-primary-400 mb-6 scroll-mt-24 border-b border-gray-200 pb-2 text-2xl font-bold dark:border-gray-700"
						>
							{letter}
						</h2>
						<div class="space-y-4">
							{#each items as [englishTerm, details] (englishTerm)}
								<GlossaryItem
									href={`/pages/glossary/${englishTerm.toLowerCase()}`}
									{englishTerm}
									{details}
									{searchTerm}
								/>
							{/each}
						</div>
					</section>
				{/each}
			{/if}
		</main>

		{#if showBackToTop}
			<div transition:fade={{ duration: 300 }}>
				<button
					onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
					class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 fixed bottom-6 left-6 z-30 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:outline-none"
					aria-label="العودة للأعلى"
				>
					<Icon name="arrow-up" class="h-6 w-6" />
				</button>
			</div>
		{/if}
	</div>
</div>

<script lang="ts">
	import Highlight from './Highlight.svelte';

	type Details = {
		t: string;
		d: string;
	};

	type Props = {
		englishTerm: string;
		details: Details;
		searchTerm: string;
		href: string;
	};
	let { englishTerm, details, searchTerm, href }: Props = $props();
</script>

<a
	{href}
	class="block rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
>
	<article class="p-6">
		<div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
			<div class="md:col-span-1" dir="ltr">
				<h3 class="text-primary-800 dark:text-primary-300 text-xl font-bold capitalize">
					<Highlight text={englishTerm} query={searchTerm} />
				</h3>
			</div>
			<div class="md:col-span-2">
				<h4 class="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100">
					<Highlight text={details.t} query={searchTerm} />
				</h4>
				<p class="mt-2 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
					<Highlight text={details.d} query={searchTerm} />
				</p>
			</div>
		</div>
	</article>
</a>

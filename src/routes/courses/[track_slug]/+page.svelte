<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import Icon from '$ui/common/Icon.svelte';
	import { toPublicUrl } from '$utils/s3-public-assets';
	import type { LayoutServerData } from './$types';

	let { data }: { data: LayoutServerData } = $props();
	const track = $derived(data?.track);
	const modules = $derived(data?.modules);

	function getDifficultyClass(difficulty?: string): string {
		const colors = {
			easy: 'text-green-800 dark:text-green-300',
			medium: 'text-yellow-800 dark:text-yellow-300',
			hard: 'text-red-900 dark:text-red-300'
		};
		return (
			colors[difficulty as keyof typeof colors] ||
			'text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700'
		);
	}
</script>

<main
	class="bg-page min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800"
>
	<div class="mx-auto max-w-7xl p-6 lg:p-8">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div
				class="sticky top-6 mb-auto flex flex-wrap gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-lg duration-300 ease-in-out md:col-span-1 dark:border-gray-700 dark:bg-gray-800"
			>
				{#if track.logo}
					<img src={toPublicUrl(track.logo)} alt="" class="h-24 w-24 object-contain" />
				{/if}

				<div>
					<h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">
						{track.title}
					</h3>

					<p class="mb-6 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
						{track.blurb}
					</p>

					<div class="flex items-center gap-4 text-sm">
						<div class="flex items-center text-gray-700 dark:text-gray-300">
							<Icon name="book" class="me-1" />
							<span>69 TEMPORARY</span>
						</div>
						{#if !track.premium_only}
							<span
								class="flex items-center rounded-full bg-purple-200/50 px-3 py-1 font-medium text-violet-700 dark:bg-purple-700/30 dark:text-purple-300"
							>
								<Icon name="star" class="me-1.5 h-4 w-4" />
								{i18n.t('common.premium_only')}
							</span>
						{/if}
					</div>
				</div>
			</div>

			<!-- /* Course Track */ -->
			<div class="flex flex-col md:col-span-2">
				<div class="flex flex-col items-center gap-16">
					{#each modules as module}
						<div class="w-full">
							<div
								class="bg-primary-100/50 border-primary-500/30 dark:bg-primary-700/30 dark:border-primary-500/50 mb-6 w-full rounded-xl border-2 border-b-4 p-1 text-center"
							>
								<span class="text-primary-700 dark:text-primary-300 text-sm font-bold">
									LEVEL {module.position}
								</span>
								<h3 class="text-md font-bold text-gray-900 dark:text-white">{module.title}</h3>
							</div>
							{#each module.items as item, index}
								<div class="relative w-full">
									<a
										href={`/courses/${track.slug}/${item.slug}/${item.type}`}
										class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
									>
										<div>
											<h4 class="text-md font-bold text-gray-900 dark:text-white">{item.title}</h4>
											<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.blurb}</p>
										</div>
										<div class="flex items-center gap-4 text-xs font-medium">
											<span class={getDifficultyClass(item.difficulty || undefined)}>
												{item.difficulty}
											</span>
											<span class="text-gray-700 dark:text-gray-300">{item.type}</span>
											<span
												class="rounded bg-gray-100 px-2 py-0.5 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
												>{item.base_xp} XP</span
											>
										</div>
									</a>
									{#if index < module.items.length - 1}
										<div class="flex justify-center">
											<div class="relative h-12 w-0.5 bg-gray-300 dark:bg-gray-600">
												<!-- <div class="absolute top-0 left-0 h-full w-full bg-green-400"></div> -->
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</main>

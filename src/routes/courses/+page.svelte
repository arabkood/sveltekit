<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import { toPublicUrl } from '$utils/s3-public-assets';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	const courses = $derived(Object.values(data.courses));
</script>

<div class="bg-page min-h-screen">
	<div class="mx-auto max-w-7xl p-6 lg:p-8">
		<!-- Header -->
		<div class="bg-section mb-8 rounded-2xl p-6 shadow-sm backdrop-blur-xl">
			<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h1 class="font-arabic text-3xl font-bold">
						{i18n.t('tracks.explore.title')}
					</h1>
					<p class="mt-2 opacity-60">{i18n.t('tracks.explore.description')}</p>
				</div>
			</div>
		</div>

		{#each courses as course}
			<div class="mb-8 border-b-1 border-gray-200 pt-8 pb-16 last:border-b-0 dark:border-gray-700">
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
							<a
								href={'courses/' + track.slug}
								title={track.title}
								class="group block h-full w-[160px] flex-shrink-0 sm:w-[180px]"
							>
								<div
									class="group-hover:border-primary-500 dark:group-hover:border-primary-500 mb-4 flex h-full flex-col items-center rounded-xl border-2 border-b-4 border-gray-200 bg-white p-3.5 text-center transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-gray-300/40 sm:p-4 dark:border-gray-700 dark:border-b-gray-600 dark:bg-gray-400 dark:group-hover:shadow-black/30"
								>
									<div class="relative">
										{#if track.logo}
											<img
												src={toPublicUrl(track.logo)}
												alt=""
												class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
												height="151"
												width="151"
											/>
										{/if}
										{#if track.premium_only}
											<span
												class="absolute start-0 top-0 rounded-full bg-purple-200 px-2.5 py-1 text-[10px] font-bold whitespace-nowrap text-purple-900 shadow-sm dark:bg-purple-700 dark:text-purple-100"
											>
												{i18n.t('common.premium_only')}
											</span>
										{/if}
									</div>
								</div>
								<p
									class="flex-grow text-center text-sm font-semibold text-gray-700 dark:text-gray-300"
								>
									{track.title}
								</p>
							</a>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

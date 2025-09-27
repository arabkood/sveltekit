<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import { toPublicUrl } from '$utils/s3-public-assets';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import type { AllCourses, UserTrack } from '$lib/server/db/repos/class';

	let {
		userTracks = [],
		courses,
		is_user_premium
	}: {
		userTracks: UserTrack[];
		courses: AllCourses;
		is_user_premium: boolean;
	} = $props();

	const merged = $derived(
		userTracks.map((v) => {
			return {
				...v,
				track: Object.values(courses)
					.map(({ topic, tracks }) => {
						const track = tracks.find((t) => t.id === v.trackId);
						if (track) {
							return { ...track, topic };
						}
						return undefined;
					})
					.filter(Boolean)[0]
			};
		})
	);
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			{i18n.t('dashboard.your_tracks')}
		</h2>
	</div>

	{#if userTracks.length > 0}
		<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
			{#each merged as { track, ...userTrack }}
				{@const isLocked = track?.premiumOnly && !is_user_premium}

				<a
					href={`/courses/${track?.slug}`}
					class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/10 dark:border-gray-700/60 dark:bg-gray-800 dark:ring-white/10"
					class:opacity-50={isLocked}
					class:cursor-not-allowed={isLocked}
				>
					{#if isLocked}
						<div
							class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/40 backdrop-blur-sm"
							aria-hidden="true"
						>
							<div class="rounded-full bg-white/10 p-3 backdrop-blur-sm">
								<Icon name="lock" class="h-6 w-6 text-white" />
							</div>
							<p class="mt-3 text-center text-sm font-semibold text-white">
								{i18n.t('common.premium_only')}
							</p>
						</div>
					{/if}

					<div class="relative flex flex-1 flex-col" class:inert={isLocked}>
						<!-- Large square image section -->
						<div class="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
							{#if track?.logo}
								<img
									src={toPublicUrl(track.logo)}
									class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
									alt={`${track.title} logo`}
									loading="lazy"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center">
									<Icon name="book-open" class="h-16 w-16 text-gray-400 dark:text-gray-500" />
								</div>
							{/if}

							<!-- Completion badge overlay -->
							{#if userTrack.completedAt}
								<div class="absolute top-3 right-3">
									<span
										class="text-md inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-3 py-1.5 font-medium text-white shadow-lg"
										title={userTrack.completedAt.toLocaleString()}
									>
										<Icon name="check-circle" size={24} />
										{i18n.t('common.completed')}
									</span>
								</div>
							{/if}

							<!-- Gradient overlay for better text readability -->
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
							></div>
						</div>

						<!-- Content section -->
						<div class="flex flex-1 flex-col p-5 pb-0">
							<!-- Title only -->
							<h3 class="mb-4 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
								{track?.title}
							</h3>

							<!-- Progress section -->
							<!-- <div class="mb-6 space-y-3"> -->
							<!-- 	<div class="flex items-center justify-between text-sm"> -->
							<!-- 		<span class="font-medium text-gray-700 dark:text-gray-300"> -->
							<!-- 			{userTrack.completedAt ? 'Completed' : 'Progress'} -->
							<!-- 		</span> -->
							<!-- 		<span class="text-gray-500 dark:text-gray-400">{progress}%</span> -->
							<!-- 	</div> -->
							<!-- 	<div class="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"> -->
							<!-- 		<div -->
							<!-- 			class="h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out" -->
							<!-- 			class:from-primary-500={!userTrack.completedAt} -->
							<!-- 			class:to-primary-600={!userTrack.completedAt} -->
							<!-- 			class:from-emerald-500={userTrack.completedAt} -->
							<!-- 			class:to-emerald-600={userTrack.completedAt} -->
							<!-- 			style="width: {progress}%" -->
							<!-- 		></div> -->
							<!-- 	</div> -->
							<!-- </div> -->
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div
			class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white p-16 text-center transition-colors duration-200 hover:border-gray-300 dark:border-gray-700 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900"
		>
			<div class="rounded-full bg-gray-100 p-4 dark:bg-gray-700">
				<Icon name="book-open" class="h-8 w-8 text-gray-400 dark:text-gray-500" />
			</div>
			<h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
				{i18n.t('dashboard.no_active_track')}
			</h3>
			<p class="mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
				{i18n.t('dashboard.start_track_prompt')}
			</p>
			<div class="mt-8">
				<Button href="/courses" startIcon="search" variant="attention">
					{i18n.t('dashboard.browse_tracks')}
				</Button>
			</div>
		</div>
	{/if}
</div>

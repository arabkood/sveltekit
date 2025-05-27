<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import type { SelectTrack } from '$lib/server/db/schema/class';
	import type { SelectUserTracks } from '$lib/server/db/schema/users';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';

	let {
		userTracks = []
	}: {
		userTracks?: {
			userTrack: SelectUserTracks;
			track: SelectTrack;
		}[];
	} = $props();
	console.debug(userTracks);

	const is_user_premium = false;
</script>

<div class="space-y-5">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			{i18n.t('dashboard.your_tracks')}
		</h2>
		<!-- <a href="/tracks" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
			{i18n.t('common.view_all')}
		</a> -->
	</div>

	{#if userTracks.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each userTracks as { userTrack, track }}
				{@const isLocked = track.premiumOnly && !is_user_premium}

				<div
					class="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 ease-in-out hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
					class:opacity-60={isLocked}
				>
					{#if isLocked}
						<div
							class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-gradient-to-t from-black/70 via-black/50 to-black/30 p-4 backdrop-blur-sm"
							aria-hidden="true"
						>
							<Icon name="lock" class="mb-2 h-7 w-7 text-white opacity-90" />
							<p class="text-center text-sm font-semibold text-white">
								{i18n.t('common.premium_only')}
							</p>
							<!-- Optional: Add a link/button to upgrade -->
							<!-- <button class="mt-3 rounded-full bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700">
								{i18n.t('common.upgrade')}
							</button> -->
						</div>
					{/if}

					<div class="flex flex-1 flex-col p-5" class:inert={isLocked}>
						<div class="mb-4 flex items-start justify-between gap-3">
							<div class="flex items-center gap-3">
								{#if track.logo}
									<img
										src={track.logo}
										class="h-8 w-8 flex-shrink-0 rounded-md object-contain"
										alt={`${track.title} logo`}
										loading="lazy"
									/>
								{/if}
								<h3 class="flex-grow text-base font-semibold text-gray-900 dark:text-white">
									{track.title}
								</h3>
							</div>
							{#if userTrack.completedAt}
								<span
									class="ms-auto flex-shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-green-800 dark:bg-green-900 dark:text-green-300"
									title={userTrack.completedAt.toLocaleString()}
								>
									{i18n.t('common.completed')}
								</span>
							{/if}
						</div>

						{#if track.description}
							<p class="mb-2 line-clamp-2 flex-grow text-sm text-gray-600 dark:text-gray-400">
								{track.description}
							</p>
						{/if}

						<!-- Placeholder for progress or action button -->
						<div class="mt-auto pt-4">
							<Button
								disabled={isLocked}
								href={`/track/${track.slug}`}
								endIcon="arrow-left"
								variant="secondary"
							>
								{userTrack.completedAt
									? i18n.t('tracks.review_track')
									: i18n.t('tracks.continue_track')}
							</Button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div
			class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-600 dark:bg-gray-800"
		>
			<Icon name="book-open" class="mx-auto h-12 w-12 text-gray-400" />
			<h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
				{i18n.t('dashboard.no_active_track')}
			</h3>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
				{i18n.t('dashboard.start_track_prompt')}
			</p>
			<div class="mt-6">
				<Button href="/courses" startIcon="search" variant="secondary">
					{i18n.t('dashboard.browse_tracks')}
				</Button>
			</div>
		</div>
	{/if}
</div>

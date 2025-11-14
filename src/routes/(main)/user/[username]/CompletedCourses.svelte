<script lang="ts">
	import type { UserTrack } from '$lib/server/db/repos/user';
	import { i18n } from '$i18n/i18n';
	import Icon from '$ui/common/Icon.svelte';
	import { toPublicUrl } from '$utils/s3-public-assets';

	let { tracks }: { tracks: UserTrack[] } = $props();

	// Format completion date
	const formatDate = (dateString: Date | string | null) => {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<div class="space-y-6">
	<!-- Section Header -->
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
			{i18n.t('dashboard.completed_tracks')}
		</h2>
		<span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
			{tracks.length}
		</span>
	</div>

	<!-- Completed Courses Grid -->
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
		{#each tracks as userTrack (userTrack.trackId)}
			{@const track = userTrack.track}
			<a
				href={`/courses/${track?.slug}`}
				class="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
			>
				<!-- Course Image -->
				<div class="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-800">
					{#if track?.logo}
						<img
							src={toPublicUrl(track.logo)}
							alt={track.title}
							class="h-full w-full object-contain p-4"
						/>
					{/if}

					<!-- Completion Badge -->
					<div class="absolute top-2 right-2 rounded-full bg-emerald-600 p-1.5">
						<Icon name="check-circle" size={14} class="text-white" />
					</div>
				</div>

				<!-- Course Info -->
				<div class="flex flex-1 flex-col gap-1 p-3">
					<h3 class="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
						{track?.title}
					</h3>
					<div class="mt-auto text-xs text-gray-500 dark:text-gray-400">
						{formatDate(userTrack.completedAt)}
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>

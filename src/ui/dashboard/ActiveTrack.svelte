<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import type { SelectUserTracks } from '$lib/server/db/schema/class';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';

	const { userTracks, handleContinueLearning } = $props<{
		userTracks: SelectUserTracks[];
		handleContinueLearning?: () => void;
	}>();

	const lastActiveTrack = $derived(userTracks[0] || null);
	const lastActiveTrackProgress = $derived(
		lastActiveTrack?.done_modules
			? Math.round((lastActiveTrack.done_modules * 100) / lastActiveTrack.total_modules)
			: 0
	);
	const isLastTrackCompleted = $derived(lastActiveTrackProgress === 100);
</script>

{#if lastActiveTrack}
	<div
		class="group from-primary-500 to-primary-700 rounded-2xl bg-gradient-to-br p-6 transition hover:shadow-lg"
	>
		<div class="mb-6 flex items-center justify-between">
			<div>
				<h3 class="text-xl font-semibold text-white">{lastActiveTrack.title}</h3>
				<p class="text-primary-100">
					{lastActiveTrack.done_modules} / {lastActiveTrack.total_modules}
					{i18n.t('common.modules')}
					{#if isLastTrackCompleted}
						<span class="ms-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
							{i18n.t('common.completed')}
						</span>
					{/if}
				</p>
			</div>
			<div class="relative">
				<div class="bg-primary-100 absolute inset-[-10px] rounded-full"></div>
				<div class="relative rounded-full p-2">
					<img
						src={lastActiveTrack.image}
						class="h-14 w-14 object-contain"
						alt={`${lastActiveTrack.title} logo`}
					/>
				</div>
			</div>
		</div>
		<div class="bg-primary-500 h-2 overflow-hidden rounded-full">
			<div
				class="h-full rounded-full bg-white transition"
				style="width: {lastActiveTrackProgress}%"
			></div>
		</div>
		{#if !isLastTrackCompleted}
			<button
				onclick={handleContinueLearning}
				class="text-primary-700 hover:bg-primary-50 mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold transition"
				disabled={isLastTrackCompleted}
			>
				<Icon name="arrow-right" class="h-5 w-5 rtl:hidden" />
				{isLastTrackCompleted ? i18n.t('common.completed') : i18n.t('dashboard.resume_learning')}
				<Icon name="arrow-left" class="h-5 w-5 ltr:hidden" />
			</button>
		{/if}
	</div>
{:else}
	<div class="rounded-2xl bg-white p-6 text-center dark:bg-emerald-700/50">
		<div class="mb-4 flex justify-center">
			<Icon name="book-open" class="text-primary-300 h-12 w-12" />
		</div>
		<h3 class="mb-2 text-xl font-semibold">{i18n.t('dashboard.no_active_track')}</h3>
		<p class="mb-4 opacity-60">{i18n.t('dashboard.start_track_prompt')}</p>
		<Button href="/explore-tracks" startIcon="plus" variant="secondary">
			{i18n.t('dashboard.browse_tracks')}
		</Button>
	</div>
{/if}

<script lang="ts">
	import { API_ENDPOINTS } from '$api/config';
	import { i18n } from '$i18n/i18n';
	import type { ApiError } from '$types/api';
	import type { TranslationKey } from '$types/i18n';
	import Icon from '$ui/common/Icon.svelte';
	import ModuleRow from './ModuleRow.svelte';
	import { cn } from '$utils/classnames';
	import type { LayoutProps } from './$types';
	import Button from '$ui/common/Button.svelte';
	import Spinner from '$ui/common/Spinner.svelte';
	import Progress from '$ui/common/Progress.svelte';

	let { data }: LayoutProps = $props();

	let startStatus = $state<null | 'idle' | 'loading' | 'success'>(null);

	const userTrack = $derived(
		data.userTracks?.find((ut) => ut.userTrack.trackId == data.track.id) || null
	);

	$effect(() => {
		if (userTrack) {
			startStatus = 'success';
		} else {
			startStatus = 'idle';
		}
	});

	// Track progress calculation
	const totalModules = $derived(
		data.sectionsWithModules.reduce((total, section) => total + section.modules.length, 0)
	);

	const completedModules = $derived(
		data.sectionsWithModules
			.map((v) => {
				return {
					...v,
					modules: v.modules.filter((b) => b.done)
				};
			})
			.reduce((total, section) => total + section.modules.length, 0)
	);

	function getDifficultyColor(difficulty: string): string {
		const colors = {
			novice: 'text-green-800 dark:text-green-300',
			beginner: 'text-cyan-800 dark:text-cyan-300',
			intermediate: 'text-indigo-800 dark:text-indigo-300',
			advanced: 'text-yellow-800 dark:text-yellow-300',
			expert: 'text-red-900 dark:text-red-300'
		};
		return colors[difficulty as keyof typeof colors] || 'text-gray-600 bg-gray-50';
	}

	async function handleStartTrack() {
		if (startStatus !== 'idle') return;
		startStatus = 'loading';
		const url = new URL(API_ENDPOINTS.tracks.start);
		url.search = new URLSearchParams({ id: data.track.id }).toString();
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include'
		});

		if (response.status !== 409) {
			if (!response.ok) {
				const error: ApiError = await response.json();
				alert(i18n.error(error.error));
				startStatus = 'idle';
				return;
			}
		}
		startStatus = 'success';
	}
</script>

<div class="bg-page min-h-screen">
	<div class="mx-auto max-w-7xl p-6 lg:p-8">
		<!-- Track Header -->
		<div class="bg-section mb-8 rounded-2xl p-6">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
				<!-- Track Image and Basic Info -->
				<div class="flex items-start gap-6">
					<div class="relative">
						<div class="absolute inset-[-10px] rounded-full"></div>
						<img
							src={data.track.logo}
							alt={data.track.title}
							class="relative h-24 w-24 rounded-xl object-contain"
						/>
					</div>
					<div class="flex-1">
						<h1 class="text-3xl font-bold">
							{data.track.title}
						</h1>
						<div class="mt-3 flex flex-wrap items-center gap-3">
							<span
								class={cn(
									'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
									getDifficultyColor(data.track.difficulty || '')
								)}
							>
								{i18n.t(`tracks.difficulty.${data.track.difficulty}` as TranslationKey)}
							</span>
							{#each data.track.programmingLanguages || [] as plang}
								<span class="inline-flex items-center text-sm">
									<Icon name="code" class="me-1 h-4 w-4" />
									{plang}
								</span>
							{/each}
							{#if data.track.premiumOnly}
								<span
									class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
								>
									<Icon name="star" class="me-1.5 h-4 w-4" />
									{i18n.t('common.premium')}
								</span>
							{/if}
						</div>
					</div>
				</div>
				<!-- Action Button -->
				<div class="my-auto ms-auto">
					{#if startStatus == 'loading' || startStatus === 'idle'}
						<Button
							onclick={handleStartTrack}
							variant="secondary"
							startIcon={startStatus === 'idle' ? 'play' : undefined}
							rounded={true}
							disabled={startStatus !== 'idle'}
						>
							{#if startStatus === 'loading'}
								<Spinner />
							{:else}
								{i18n.t('tracks.start_track')}
							{/if}
						</Button>
					{/if}
				</div>
			</div>
			{#if startStatus !== 'loading' && startStatus !== 'idle'}
				<!-- Progress Bar -->
				<div class="mt-5">
					<!-- <span class="text-sm"> -->
					<!-- 	{i18n.t('tracks.progress')} -->
					<!-- </span> -->
					<Progress max={totalModules} value={completedModules} labelType="value" />
				</div>
			{/if}

			<!-- Track Stats -->
			<!-- <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"> -->
			<!-- 	<div class="bg-inner rounded-xl p-4 text-center"> -->
			<!-- 		<div class="text-primary-600 text-2xl font-bold">{data.track.estimatedHours}</div> -->
			<!-- 		<div class="text-sm">{i18n.t('tracks.estimated_hours')}</div> -->
			<!-- 	</div> -->
			<!-- 	<div class="bg-inner rounded-xl p-4 text-center"> -->
			<!-- 		<div class="text-primary-600 text-2xl font-bold">{data.track.totalXp}</div> -->
			<!-- 		<div class="text-sm">{i18n.t('tracks.total_xp')}</div> -->
			<!-- 	</div> -->
			<!-- 	<div class="bg-inner rounded-xl p-4 text-center"> -->
			<!-- 		<div class="text-primary-600 text-2xl font-bold"> -->
			<!-- 			{completedModules}/{totalModules} -->
			<!-- 		</div> -->
			<!-- 		<div class="text-sm">{i18n.t('tracks.exercises_completed')}</div> -->
			<!-- 	</div> -->
			<!-- 	<div class="bg-inner rounded-xl p-4 text-center"> -->
			<!-- 		<div class="text-primary-600 text-2xl font-bold">{data.track.students}</div> -->
			<!-- 		<div class="text-sm">{i18n.t('tracks.enrolled_users')}</div> -->
			<!-- 	</div> -->
			<!-- </div> -->
		</div>

		<!-- Track Content -->
		<div class="grid gap-8 lg:grid-cols-12">
			<!-- Main Content -->
			<div class="space-y-6 lg:col-span-8">
				<!-- Sections -->
				{#each data.sectionsWithModules as section}
					<div class={'overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700'}>
						<!-- Section Header -->
						<div class="bg-section flex items-start justify-between px-6 py-4">
							<h3 class="font-semibold">
								{section.title}
							</h3>
							<!-- <p class="mt-2">{section.description}</p> -->
						</div>

						<!-- Modules List -->
						<ol>
							{#each section.modules as module}
								<ModuleRow trackSlug={data.track.slug} {module} />
							{/each}
						</ol>
					</div>
				{/each}
			</div>

			<!-- Sidebar -->
			<div class="lg:col-span-4">
				<div class="space-y-6">
					<!-- Prerequisites Card -->
					{#if data.track.requirements && data.track.requirements.length > 0}
						<div class="bg-section rounded-2xl p-6 shadow-sm">
							<h3 class="mb-4 text-lg font-semibold">
								{i18n.t('tracks.prerequisites')}
							</h3>
							<ul class="space-y-3">
								{#each data.track.requirements as dependency}
									<li class="flex items-start gap-3">
										<Icon name="check-circle" class="h-5 w-5 text-green-500" />
										<span class="">{dependency}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<!-- What You'll Learn Card -->
					{#if data.track.outcomes && data.track.outcomes.length > 0}
						<div class="bg-section rounded-2xl p-6 shadow-sm">
							<h3 class="mb-4 text-lg font-semibold">
								{i18n.t('tracks.what_you_learn')}
							</h3>
							<ul class="space-y-3">
								{#each data.track.outcomes as outcome}
									<li class="flex items-start gap-3">
										<Icon name="target" class="text-primary-500 h-5 w-5" />
										<span class="">{outcome}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<!-- Tags Card -->
					{#if data.track.tags && data.track.tags.length > 0}
						<div class="bg-section rounded-2xl p-6 shadow-sm">
							<h3 class="mb-4 text-lg font-semibold">
								{i18n.t('tracks.tags')}
							</h3>
							<div class="flex flex-wrap gap-2">
								{#each data.track.tags as tag}
									<span class="bg-inner rounded-full px-3 py-1 text-sm">
										{tag}
									</span>
								{/each}
							</div>
						</div>
					{/if}
					<!-- Community Stats -->
					<!-- <div class="bg-modal rounded-2xl p-6"> -->
					<!-- 	<div class="mb-6"> -->
					<!-- 		<span -->
					<!-- 			class="mb-4 inline-flex items-center rounded-full bg-primary-50 px-4 py-1 text-sm text-primary-700" -->
					<!-- 		> -->
					<!-- 			<Icon name="users" class="me-2 h-4 w-4" /> -->
					<!-- 			{i18n.t('tracks.community')} -->
					<!-- 		</span> -->
					<!-- 		<h3 class="mb-2 text-xl font-bold"> -->
					<!-- 			{i18n.t('tracks.join_discussion')} -->
					<!-- 		</h3> -->
					<!-- 		<p class="text-sm"> -->
					<!-- 			{i18n.t('tracks.join_discussion_desc')} -->
					<!-- 		</p> -->
					<!-- 	</div> -->
					<!-- 	<button -->
					<!-- 		class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100" -->
					<!-- 	> -->
					<!-- 		<Icon name="message-circle" class="h-5 w-5" /> -->
					<!-- 		{i18n.t('tracks.view_discussions')} -->
					<!-- 	</button> -->
					<!-- </div> -->
				</div>
			</div>
		</div>
	</div>
</div>

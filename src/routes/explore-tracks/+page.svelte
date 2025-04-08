<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import type { TranslationKey } from '$types/i18n';
	import Icon from '$ui/common/Icon.svelte';
	import Input from '$ui/common/Input.svelte';
	import Select from '$ui/common/Select.svelte';
	import { cn } from '$utils/classnames';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let tracks_unordered = data.tracks || [];

	// Filters and Search
	let searchQuery = $state('');
	let selectedDifficulty = $state<string>('all');
	let selectedLanguage = $state<string>('all');
	let view = $state<'grid' | 'list'>('grid');

	// states
	const difficulties = ['novice', 'beginner', 'intermediate', 'advanced', 'expert'];
	const languages = $derived([
		...new Set(tracks_unordered.map((t) => t.programmingLanguages).flat())
	]);

	const filteredTracks = $derived(
		tracks_unordered.filter((track) => {
			const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesDifficulty =
				selectedDifficulty === 'all' || track.difficulty === selectedDifficulty;
			const matchesLanguage =
				selectedLanguage === 'all' || track.programmingLanguages?.includes(selectedLanguage);
			return matchesSearch && matchesDifficulty && matchesLanguage;
		})
	);

	function clearFilters() {
		searchQuery = '';
		selectedDifficulty = 'all';
		selectedLanguage = 'all';
	}

	function getDifficultyColor(difficulty: string): string {
		const colors = {
			novice: 'text-green-600 bg-green-100',
			beginner: 'text-cyan-600 bg-cyan-200',
			intermediate: 'text-indigo-600 bg-indigo-300',
			advanced: 'text-yellow-600 bg-yellow-200',
			expert: 'text-red-600 bg-red-400'
		};
		return colors[difficulty as keyof typeof colors] || 'text-gray-600 bg-gray-50';
	}
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
				<div class="flex items-center gap-4">
					<button
						class={cn(
							'rounded-lg p-2 transition',
							view === 'grid' ? 'bg-clickable-primary pointer-events-none' : 'bg-clickable'
						)}
						onclick={() => (view = 'grid')}
					>
						<Icon name="grid" class="h-5 w-5" />
					</button>
					<button
						class={cn(
							'rounded-lg p-2 transition',
							view === 'list' ? 'bg-clickable-primary pointer-events-none' : 'bg-clickable'
						)}
						onclick={() => (view = 'list')}
					>
						<Icon name="list" class="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>

		<!-- Filters -->
		<div class="bg-section mb-8 rounded-2xl p-6 shadow-sm">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
				<div class="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
					<!-- Search -->
					<div class="w-full lg:w-2/5">
						<Input
							icon="search"
							type="text"
							name="search"
							placeholder={i18n.t('tracks.explore.search_placeholder')}
							value={searchQuery}
							onchange={(e: InputEvent) => (searchQuery = (e.target as HTMLInputElement).value)}
						/>
					</div>

					<!-- Difficulty Filter -->
					<div class="w-full lg:w-1/5">
						<Select
							options={['all', ...difficulties].map((d) => ({
								value: d,
								label: i18n.t(`tracks.difficulty.${d}` as TranslationKey)
							}))}
							placeholder={i18n.t('tracks.explore.all_difficulties')}
							bind:value={selectedDifficulty}
						/>
					</div>

					<!-- Language Filter -->
					<div class="w-full lg:w-1/5">
						<Select
							options={[
								{
									label: i18n.t('tracks.explore.all_languages'),
									value: 'all'
								},
								...languages.map((l) => ({
									value: l!,
									label: l!
								}))
							]}
							placeholder={i18n.t('tracks.explore.all_languages')}
							bind:value={selectedLanguage}
						/>
					</div>
				</div>

				<!-- Clear Filters -->
				<button onclick={clearFilters} class="inline-flex items-center gap-2 text-sm">
					<Icon name="filter-x" class="h-4 w-4" />
					{i18n.t('common.clear_filters')}
				</button>
			</div>
		</div>

		<!-- Track List -->
		{#if filteredTracks.length === 0}
			<div class="bg-section rounded-2xl p-8 text-center">
				<Icon name="search-x" class="mx-auto mb-4 h-12 w-12 " />
				<h3 class="mb-2 text-lg font-semibold">{i18n.t('tracks.explore.no_results')}</h3>
				<p class="mb-4 opacity-60">{i18n.t('tracks.explore.try_different_filters')}</p>
				<button
					onclick={clearFilters}
					class="bg-primary-600 hover:bg-primary-700 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition"
				>
					<Icon name="filter-x" class="h-5 w-5" />
					{i18n.t('common.clear_filters')}
				</button>
			</div>
		{:else}
			<div
				class={cn('grid gap-6', view === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')}
			>
				{#each filteredTracks as track}
					<!-- Track Card -->
					<a
						href={`/track/${track.slug}`}
						class={cn(
							'bg-section group relative overflow-hidden rounded-2xl p-6 text-start shadow-sm transition hover:shadow-md',
							track.premiumOnly ? 'cursor-not-allowed opacity-70' : ''
						)}
					>
						{#if track.premiumOnly}
							<div
								class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
							>
								<div class="text-center">
									<Icon name="lock" class="mx-auto mb-2 h-6 w-6 text-white" />
									<p class="text-sm text-white">{i18n.t('common.premium_only')}</p>
								</div>
							</div>
						{/if}

						<div class={cn('flex', view === 'list' ? 'gap-6' : 'flex-col gap-4')}>
							<div class={cn(view === 'list' ? 'w-24' : 'relative mb-2')}>
								<img
									src={track.logo}
									alt={track.title}
									class={cn(
										'rounded-xl object-contain',
										view === 'list' ? 'h-24 w-24' : 'h-16 w-16'
									)}
								/>
								{#if track.premiumOnly}
									<span
										class={cn(
											'absolute   rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700',
											view === 'list' ? 'end-2 top-2' : 'end-0 -top-2'
										)}
									>
										{i18n.t('common.premium')}
									</span>
								{/if}
							</div>

							<div class="flex-1">
								<h3 class="mb-2 font-semibold">{track.title}</h3>

								<div class="mb-4 flex flex-wrap items-center gap-2">
									<span
										class={cn(
											'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
											getDifficultyColor(track.difficulty || '')
										)}
									>
										{i18n.t(`tracks.difficulty.${track.difficulty}` as TranslationKey)}
									</span>
									{#each track.programmingLanguages || [] as plang}
										<span class="inline-flex items-center text-sm">
											<Icon name="code" class="me-1 h-4 w-4" />
											{plang}
										</span>
									{/each}
								</div>

								<div class="grid grid-cols-3 gap-2 text-center text-sm">
									<div class="bg-inner rounded-lg p-2">
										<div class="font-semibold">{track.totalModules}</div>
										<div>{i18n.t('tracks.modules')}</div>
									</div>
									<div class="bg-inner rounded-lg p-2">
										<div class="font-semibold">{track.totalXp}</div>
										<div>{i18n.t('tracks.xp')}</div>
									</div>
									<div class="bg-inner rounded-lg p-2">
										<div class="font-semibold">{track.students}</div>
										<div>{i18n.t('tracks.learners')}</div>
									</div>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import type { ItemWithSubmission, ModuleWithItems, Track } from '$lib/server/db/repos/class';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import { getDraftItem } from './[item_slug]/draftStorage';

	const {
		track,
		modules,
		nextItem,
		isPremium = false
	}: {
		isPremium?: boolean;
		track: Track;
		modules: ModuleWithItems[];
		nextItem?: ItemWithSubmission;
	} = $props();
</script>

{#each modules as module}
	{@const moduleCompleted = module.items.filter(
		(item) => item.submission?.status === 'pass'
	).length}
	{@const moduleTotal = module.items.length}
	{@const moduleProgress = moduleTotal > 0 ? (moduleCompleted / moduleTotal) * 100 : 0}
	{@const radius = 20}
	{@const circumference = 2 * Math.PI * radius}
	{@const offset = circumference - (moduleProgress / 100) * circumference}
	<details class="group mb-4 w-full max-w-full" open={module.id === nextItem?.moduleId}>
		<summary
			class="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl bg-gray-100 p-3 transition-colors duration-200 group-open:mb-8 hover:bg-gray-200 sm:gap-4 sm:p-4 dark:bg-gray-800/50 dark:hover:bg-gray-700"
		>
			<div class="flex min-w-0 items-center gap-3 sm:gap-4">
				<div class="relative h-10 w-10 flex-shrink-0 sm:h-12 sm:w-12">
					<svg class="h-full w-full -rotate-90" viewBox="0 0 44 44">
						<circle
							class="stroke-gray-200 dark:stroke-gray-700"
							cx="22"
							cy="22"
							r={radius}
							stroke-width="4"
							fill="transparent"
						/>
						<circle
							class="stroke-lime-500 transition-all duration-500"
							cx="22"
							cy="22"
							r={radius}
							stroke-width="4"
							fill="transparent"
							stroke-linecap="round"
							stroke-dasharray={circumference}
							stroke-dashoffset={offset}
						/>
					</svg>
					<span
						class="font-hacker absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700 sm:text-base dark:text-gray-200"
					>
						{module.position}
					</span>
				</div>
				<h2 class="text-lg font-bold text-gray-800 sm:text-xl dark:text-white">
					{module.title}
				</h2>
			</div>
			<Icon
				name="chevron-down"
				class="h-6 w-6 flex-shrink-0 text-gray-500 transition-transform duration-300 group-open:rotate-180"
			/>
		</summary>

		{#each module.items as item, index}
			{@const isNextItem = nextItem && nextItem.slug === item.slug}
			{@const draft = getDraftItem(item.id)}
			<div class="relative w-full">
				{#if item.premiumOnly && !isPremium && !item.submission}
					<!-- Locked Item -->
					<a
						href={'/pricing'}
						class="mb-2 flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl p-3 opacity-60 transition-opacity hover:opacity-100 sm:gap-4 sm:p-4"
					>
						<div class="flex min-w-0 items-center gap-3 sm:gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700"
							>
								<Icon name="lock" class="h-5 w-5 text-gray-600 dark:text-gray-300" />
							</div>
							<div class="min-w-0">
								<h3 class="flex items-center gap-2 font-bold text-gray-800 dark:text-white">
									{item.title}
									{#if item.type === 'code'}
										<span
											class="ml-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold tracking-wider text-amber-800 uppercase dark:bg-amber-900/70 dark:text-amber-300"
										>
											{i18n.t('dashboard.challenge')}
										</span>
									{/if}
									<Icon name="star" size={16} class="flex-shrink-0 text-amber-400" />
								</h3>
							</div>
						</div>

						<div class="flex-shrink-0">
							<div
								class="pointer-events-none rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg sm:px-4 sm:text-sm"
							>
								{i18n.t('common.upgrade')}
							</div>
						</div>
					</a>
				{:else}
					<!-- Unlocked Item -->
					<a
						href={`/courses/${track.slug}/${item.slug}/${item.type}`}
						class={'mb-2 flex w-full items-center justify-between gap-3 rounded-xl p-3 hover:bg-gray-500/10 sm:gap-4 sm:p-4 ' +
							(isNextItem ? 'border-primary-500/50 border' : 'opacity-70')}
					>
						<div class="flex min-w-0 items-center gap-3 sm:gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full {item.type ===
								'code'
									? 'bg-amber-500/10 dark:bg-amber-500/20'
									: 'bg-gray-200 dark:bg-gray-700'}"
							>
								<Icon
									name={item.type === 'lesson' ? 'book-open' : 'code'}
									class="h-5 w-5 {item.type === 'code'
										? 'text-amber-600 dark:text-amber-400'
										: 'text-gray-600 dark:text-gray-300'}"
								/>
							</div>
							<div class="min-w-0">
								<h3 class="flex items-center gap-2 font-bold text-gray-800 dark:text-white">
									{item.title}

									{#if item.type === 'code'}
										<span
											class="ml-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold tracking-wider text-amber-800 uppercase dark:bg-amber-900/70 dark:text-amber-300"
										>
											{i18n.t('dashboard.challenge')}
										</span>
									{/if}
									{#if item.premiumOnly}
										<Icon name="star" size={16} class="flex-shrink-0 text-amber-400" />
									{/if}
								</h3>
								<!-- Add draft indicator here -->
								{#if draft && !item.submission}
									<div class="mt-1.5 flex items-center gap-2">
										<div
											class="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
										>
											<div
												class="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
												style="width: {Math.round(
													Math.min(((draft.csi + 1) / draft.tt) * 100, 95)
												)}%"
											></div>
										</div>
										<span class="text-xs font-semibold text-amber-600 dark:text-amber-400">
											{Math.round(Math.min(((draft.csi + 1) / draft.tt) * 100, 99))}%
										</span>
									</div>
								{/if}
							</div>
						</div>
						<div class="flex-shrink-0">
							{#if item.submission?.status === 'pass'}
								<Button variant="boring" rounded={true} size="md" class="!h-9 w-30 text-lg">
									{i18n.t('common.done')}
								</Button>
							{:else}
								<Button
									variant={isNextItem ? 'continue' : 'boring'}
									rounded={true}
									size="md"
									dir="ltr"
									class="font-hacker !h-10 w-30 text-lg font-bold"
								>
									{item.baseXp}<span class="align-text-top font-mono text-xs">XP</span>
								</Button>
							{/if}
						</div>
					</a>
				{/if}
			</div>
		{/each}
	</details>
{/each}

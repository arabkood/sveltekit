<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import type { ItemWithSubmission, ModuleWithItems } from '$lib/server/db/helpers/class';
	import type { Track } from '$lib/server/db/schema/class';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';

	const {
		track,
		modules,
		nextItem
	}: { track: Track; modules: ModuleWithItems[]; nextItem?: ItemWithSubmission } = $props();

	const isPremium = false;
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
	<details class="group mb-4 w-full max-w-full" open={module.id === nextItem?.module_id}>
		<summary
			class="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl bg-slate-100 p-3 transition-colors duration-200 group-open:mb-8 hover:bg-slate-200 sm:gap-4 sm:p-4 dark:bg-slate-800/50 dark:hover:bg-slate-700"
		>
			<div class="flex min-w-0 items-center gap-3 sm:gap-4">
				<!-- Smaller circle and font on mobile, larger on sm+ -->
				<div class="relative h-10 w-10 flex-shrink-0 sm:h-12 sm:w-12">
					<svg class="h-full w-full -rotate-90" viewBox="0 0 44 44">
						<circle
							class="stroke-slate-200 dark:stroke-slate-700"
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
						class="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 sm:text-sm dark:text-slate-200"
					>
						{module.position}
					</span>
				</div>
				<h2 class="text-lg font-bold text-slate-800 sm:text-xl dark:text-white">
					{module.title}
				</h2>
			</div>
			<Icon
				name="chevron-down"
				class="h-6 w-6 flex-shrink-0 text-slate-500 transition-transform duration-300 group-open:rotate-180"
			/>
		</summary>

		{#each module.items as item, index}
			{@const isNextItem = nextItem && nextItem.slug === item.slug}
			<div class="relative w-full">
				{#if item.premium_only && !isPremium && !item.submission}
					<!-- Locked Item -->
					<a
						href={'/pricing'}
						class="mb-2 flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl p-3 opacity-60 transition-opacity hover:opacity-100 sm:gap-4 sm:p-4"
					>
						<div class="flex min-w-0 items-center gap-3 sm:gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700"
							>
								<Icon name="lock" class="h-5 w-5 text-slate-600 dark:text-slate-300" />
							</div>
							<div class="min-w-0">
								<h3 class="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
									{item.title}
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
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700"
							>
								<Icon
									name={item.type === 'lesson' ? 'book-open' : 'code'}
									class="h-5 w-5 text-slate-600 dark:text-slate-300"
								/>
							</div>
							<div class="min-w-0">
								<h3 class="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
									{item.title}
									{#if item.premium_only}
										<Icon name="star" size={16} class="flex-shrink-0 text-amber-400" />
									{/if}
								</h3>
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
									class="!h-10 w-30 font-mono text-lg font-bold tracking-wide"
								>
									+{item.base_xp}XP
								</Button>
							{/if}
						</div>
					</a>
				{/if}
			</div>
		{/each}
	</details>
{/each}

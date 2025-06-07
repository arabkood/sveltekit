<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import Icon from '$ui/common/Icon.svelte';
	import { toPublicUrl } from '$utils/s3-public-assets';
	import type { LayoutServerData } from './$types';

	let { data }: { data: LayoutServerData } = $props();
	const track = $derived(data?.track);
	const modules = $derived(data?.modules);

	function getDifficultyClass(difficulty?: string): string {
		const difficulties: Record<string, string> = {
			easy: 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300',
			medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300',
			hard: 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300'
		};
		return (
			(difficulties[difficulty?.toLowerCase() || ''] ||
				'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300') +
			' px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
		);
	}

	function getStatusIcon(status?: string): string {
		switch (status) {
			case 'pass':
				return 'check-circle';
			case 'fail':
				return 'x-circle';
			case 'wait':
				return 'clock';
			default:
				return '';
		}
	}

	function getStatusClass(status?: string): string {
		switch (status) {
			case 'pass':
				return 'text-green-600 dark:text-green-400';
			case 'fail':
				return 'text-red-600 dark:text-red-400';
			case 'wait':
				return 'text-yellow-600 dark:text-yellow-400';
			default:
				return 'text-gray-400 dark:text-gray-500';
		}
	}

	function getItemClass(status?: string): string {
		const baseClass =
			'block w-full cursor-pointer justify-between rounded-lg border p-4 shadow-sm transition-all hover:shadow-md';

		switch (status) {
			case 'pass':
				return (
					baseClass + ' border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
				);
			case 'fail':
				return baseClass + ' border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20';
			case 'wait':
				return (
					baseClass + ' border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20'
				);
			default:
				return baseClass + ' border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800';
		}
	}
</script>

<main
	class="bg-page min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800"
>
	<div class="mx-auto max-w-7xl p-6 lg:p-8">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div
				class="sticky top-6 mb-auto flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-lg duration-300 ease-in-out md:col-span-1 dark:border-gray-700 dark:bg-gray-800"
			>
				{#if track.logo}
					<img
						src={toPublicUrl(track.logo)}
						alt="{track.title || 'Track'} logo"
						class="h-24 w-24 rounded-md object-contain"
					/>
				{/if}

				<div class="flex flex-col">
					<h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
						{track.title}
					</h3>

					<p class="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
						{track.blurb}
					</p>

					<div class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
						{#if track.premium_only}
							<span
								class="flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-sm font-medium text-purple-700 dark:bg-purple-700/30 dark:text-purple-300"
							>
								<Icon name="star" class="me-1 h-4 w-4" />
								{i18n.t('common.premium_only')}
							</span>
						{/if}
					</div>
				</div>
			</div>

			<div class="flex flex-col md:col-span-2">
				<div class="flex flex-col gap-12">
					{#each modules as module}
						<div class="w-full">
							<div
								class="bg-primary-100/50 border-primary-500/30 dark:bg-primary-700/30 dark:border-primary-500/50 mb-6 w-full rounded-xl border-2 border-b-4 p-3 text-center"
							>
								<span
									class="text-primary-700 dark:text-primary-300 text-xs font-bold tracking-wider uppercase"
								>
									LEVEL {module.position}
								</span>
								<h3 class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
									{module.title}
								</h3>
							</div>
							{#each module.items as item, index}
								<div class="relative w-full">
									<a
										href={`/courses/${track.slug}/${item.slug}/${item.type}`}
										class={getItemClass(item.submission?.status)}
									>
										<div class="flex w-full items-center gap-3">
											{#if item.submission?.status}
												<div class="flex-shrink-0">
													<Icon
														name={getStatusIcon(item.submission.status)}
														class="h-5 w-5 {getStatusClass(item.submission.status)}"
													/>
												</div>
											{/if}
											<h4 class="text-md grow font-semibold text-gray-900 dark:text-white">
												{item.title}
											</h4>
											<span class={getDifficultyClass(item.difficulty || undefined)}>
												{item.difficulty || 'N/A'}
											</span>
											<span class="text-xs font-medium text-gray-500 capitalize dark:text-gray-400"
												>{item.type}</span
											>
											<span
												class="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-nowrap text-gray-700 dark:bg-gray-700 dark:text-gray-200"
												>{item.base_xp} XP</span
											>
										</div>
										{#if item.blurb}
											<p class="mt-4 text-sm text-gray-600 dark:text-gray-400">{item.blurb}</p>
										{/if}
									</a>
									{#if index < module.items.length - 1}
										<div class="flex justify-center">
											<div class="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
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

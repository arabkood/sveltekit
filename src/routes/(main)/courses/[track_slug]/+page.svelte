<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import { toPublicUrl } from '$utils/s3-public-assets';
	import { onMount } from 'svelte';
	import type { LayoutServerData } from './$types';

	let { data }: { data: LayoutServerData } = $props();
	const track = $derived(data?.track);
	const modules = $derived(data?.modules);

	let nextItemElement: HTMLElement | undefined = $state();

	onMount(() => {
		setTimeout(() => {
			if (nextItemElement) {
				const rect = nextItemElement.getBoundingClientRect();
				const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

				if (!isVisible) {
					nextItemElement.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
				}
			}
		}, 100);
	});

	function getDifficultyClass(difficulty?: string): string {
		const difficulties: Record<string, string> = {
			easy: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/50',
			medium:
				'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50',
			hard: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700/50'
		};
		return (
			(difficulties[difficulty?.toLowerCase() || ''] ||
				'bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700/50') +
			' px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-sm'
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
				return 'circle';
		}
	}

	function getStatusClass(status?: string): string {
		switch (status) {
			case 'pass':
				return 'text-emerald-500 dark:text-emerald-400';
			case 'fail':
				return 'text-rose-500 dark:text-rose-400';
			case 'wait':
				return 'text-amber-500 dark:text-amber-400 animate-pulse';
			default:
				return 'text-slate-400 dark:text-slate-600';
		}
	}

	function getItemClass(status?: string, isNext?: boolean): string {
		const baseClass =
			'group block w-full cursor-pointer justify-between rounded-2xl border-2 p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-[0.98]';

		// HICK'S LAW: Make the next item unmistakably the primary choice
		if (isNext) {
			return (
				baseClass +
				' border-blue-400 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:border-blue-500/70 dark:from-blue-900/40 dark:via-indigo-900/20 dark:to-purple-900/20 hover:border-blue-500 dark:hover:border-blue-400 ring-4 ring-blue-200/60 dark:ring-blue-500/30 animate-gentle-pulse shadow-blue-200/50 dark:shadow-blue-900/30'
			);
		}

		// VISUAL HIERARCHY: Completed items are muted to reduce distraction
		switch (status) {
			case 'pass':
				return (
					baseClass +
					' border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 dark:border-emerald-700/50 dark:from-emerald-900/20 dark:to-green-900/10 hover:border-emerald-200 dark:hover:border-emerald-600/70 opacity-70 hover:opacity-85'
				);
			case 'fail':
				return (
					baseClass +
					' border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50 dark:border-rose-700/50 dark:from-rose-900/20 dark:to-pink-900/10 hover:border-rose-200 dark:hover:border-rose-600/70 opacity-70 hover:opacity-85'
				);
			case 'wait':
				return (
					baseClass +
					' border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 dark:border-amber-700/50 dark:from-amber-900/20 dark:to-orange-900/10 hover:border-amber-200 dark:hover:border-amber-600/70 opacity-75 hover:opacity-90'
				);
			default:
				return (
					baseClass +
					' border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-gradient-to-br hover:from-slate-50 hover:to-gray-50 dark:hover:from-slate-900/10 dark:hover:to-gray-900/5 opacity-60 hover:opacity-80'
				);
		}
	}

	function getProgressPercentage(): number {
		if (!modules) return 0;
		const totalItems = modules.reduce((acc, module) => acc + module.items.length, 0);
		const completedItems = modules.reduce(
			(acc, module) =>
				acc + module.items.filter((item) => item.submission?.status === 'pass').length,
			0
		);
		return Math.round((completedItems / totalItems) * 100);
	}

	function getNextItem() {
		if (!modules) return null;
		for (const module of modules) {
			for (const item of module.items) {
				if (!item.submission?.status || item.submission.status !== 'pass') {
					return { module, item };
				}
			}
		}
		return null;
	}

	// EMOTIONAL DESIGN: Progress-based motivational messaging
	function getMotivationalMessage(progress: number): string {
		if (progress === 0) return 'هل أنت مستعد لبدء رحلتك التعليمية؟ 🚀';
		if (progress < 25) return 'بداية رائعة! استمر في هذا الزخم! 💪';
		if (progress < 50) return 'أحرزت تقدمًا ممتازًا! 🔥';
		if (progress < 75) return 'أوشكت على الوصول! أنت رائع! ⭐';
		if (progress < 100) return 'قريب جدًا من الإتقان! دفعة أخيرة! 🎯';
		return 'أنهيت المسار! أنت لا يمكن إيقافك! 🏆';
	}

	const progressPercentage = $derived(getProgressPercentage());
	const nextItem = $derived(getNextItem());
	const motivationalMessage = $derived(getMotivationalMessage(progressPercentage));
</script>

<main
	class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
>
	<div class="mx-auto max-w-7xl">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<div
				class="sticky top-6 mb-auto flex flex-col gap-6 rounded-3xl border border-white/80 bg-white/95 p-8 shadow-xl backdrop-blur-sm duration-300 ease-in-out lg:col-span-1 dark:border-slate-700/50 dark:bg-slate-800/95 dark:shadow-slate-900/30"
			>
				{#if progressPercentage > 0}
					<div
						class="mb-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-lime-50 p-4 dark:border-emerald-800/50 dark:from-emerald-900/30 dark:to-lime-900/30"
					>
						<p class="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
							{motivationalMessage}
						</p>
					</div>
				{/if}

				{#if progressPercentage > 0}
					<div class="mb-2">
						<div class="mb-2 flex items-center justify-between text-sm font-semibold">
							<span class="text-slate-700 dark:text-slate-300"
								>{i18n.t('common.your_progress')}</span
							>
							<span class="text-emerald-600 dark:text-emerald-400">{progressPercentage}%</span>
						</div>

						<div
							class="relative h-4 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-700"
						>
							<div
								class="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-500 shadow-inner transition-all duration-700 ease-out"
								style="width: {progressPercentage}%"
							></div>
						</div>
					</div>
				{/if}

				{#if track.premium_only}
					<div class="flex flex-wrap items-center justify-center gap-4 text-sm">
						<span
							class="flex items-center rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm dark:border-purple-700/50 dark:from-purple-900/30 dark:to-indigo-900/30 dark:text-purple-300"
						>
							<Icon name="star" class="me-2 h-4 w-4" />
							{i18n.t('common.premium_only')}
						</span>
					</div>
				{/if}

				{#if track.logo}
					<div class="flex justify-center">
						<img
							src={toPublicUrl(track.logo)}
							alt="{track.title || 'Track'} logo"
							class="h-32 w-32 rounded-3xl object-contain transition-all duration-300 hover:scale-105 dark:ring-slate-700/50"
						/>
					</div>
				{/if}

				<div class="flex flex-col text-center">
					<h1 class="mb-2 text-2xl font-bold text-slate-800 dark:text-white">
						{track.title}
					</h1>

					<p class="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
						{track.blurb}
					</p>
				</div>
			</div>

			<div class="flex flex-col lg:col-span-2">
				<div class="flex flex-col gap-16">
					{#if progressPercentage === 100}
						<div
							class="rounded-3xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 p-10 text-center shadow-xl dark:border-emerald-700/50 dark:from-emerald-900/30 dark:via-blue-900/30 dark:to-purple-900/30"
						>
							<div class="animate-bounce-slow mb-6 text-8xl">🎉</div>
							<h3 class="mb-4 text-4xl font-bold text-emerald-700 dark:text-emerald-300">
								عمل رائع، أنجزت الكثير!
							</h3>
							<p class="mb-6 text-xl text-emerald-600 dark:text-emerald-400">
								انتهيت من هذا المسار بنجاح — جهدك واضح، وتستحق كل التقدير. خُطوة مهمة في طريقك، تابع
								بثقة.
							</p>
							<Button variant="attention" endIcon="arrow-left" size={'lg'} href={`/courses`}>
								{i18n.t('common.find_other_tracks')}
							</Button>
						</div>
					{/if}

					{#each modules as module}
						<div class="w-full">
							<div
								class="mb-10 w-full rounded-3xl border border-lime-200 bg-gradient-to-r from-lime-600 via-lime-500 to-lime-600 p-8 text-center shadow-lg dark:border-slate-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
							>
								<div class="mb-4 flex items-center justify-center gap-4">
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-slate-100 to-lime-100 text-lg font-bold text-emerald-700 shadow-lg ring-4 ring-white/30 dark:from-lime-600 dark:to-emerald-600 dark:text-white"
									>
										{module.position}
									</div>

									<h2 class="text-2xl font-bold text-white drop-shadow-sm">
										{module.title}
									</h2>
								</div>
								{#if module.items}
									{@const moduleCompleted = module.items.filter(
										(item) => item.submission?.status === 'pass'
									).length}
									{@const moduleTotal = module.items.length}
									{@const moduleProgress = (moduleCompleted / moduleTotal) * 100}
									<div class="flex items-center justify-center gap-4">
										<div
											class="h-3 w-32 overflow-hidden rounded-full border border-white/30 bg-white/20"
										>
											<div
												class="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-inner transition-all duration-500 dark:from-emerald-400 dark:to-lime-400"
												style="width: {moduleProgress}%"
											></div>
										</div>
										<span
											class="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-sm font-bold text-white dark:text-slate-100"
											>{moduleCompleted}/{moduleTotal}</span
										>
									</div>
								{/if}
							</div>

							{#each module.items as item, index}
								{@const isNextItem = nextItem && nextItem.item.slug === item.slug}
								<div class="relative w-full">
									<a
										bind:this={
											() => nextItemElement,
											(v) => {
												if (isNextItem) {
													nextItemElement = v;
												}
											}
										}
										href={`/courses/${track.slug}/${item.slug}/${item.type}`}
										class={getItemClass(item.submission?.status, isNextItem || undefined)}
									>
										<div class="flex w-full items-center gap-6">
											<div
												class={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 transition-colors duration-200 dark:bg-slate-700/50 
          ${isNextItem ? 'bg-blue-100 ring-4 ring-blue-200 dark:bg-blue-900/50 dark:ring-blue-800' : ''}`}
											>
												<Icon
													name={item.type === 'lesson' ? 'book-open' : 'code'}
													class="h-7 w-7 {getStatusClass(
														item.submission?.status
													)} transition-all duration-200 group-hover:scale-110"
												/>
												{#if item.submission?.status === 'pass'}
													<div
														class="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800"
													>
														<Icon name="check" class="h-3 w-3 text-white" />
													</div>
												{/if}
											</div>

											<div class="min-w-0 grow">
												<h3
													class="mb-2 text-xl font-bold text-slate-800 transition-colors duration-200 group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400 {isNextItem
														? 'text-blue-700 dark:text-blue-300'
														: ''}"
												>
													{item.title}
												</h3>
												{#if item.blurb}
													<p
														class="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
													>
														{item.blurb}
													</p>
												{/if}
											</div>

											{#if isNextItem}
												<div
													class="animate-gentle-pulse absolute top-3 -right-3 flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg"
												>
													<span>{i18n.t('common.next')}</span>
													<Icon name="arrow-left" class="h-4 w-4" />
												</div>
											{/if}

											<div class="flex flex-col items-end gap-3">
												<span
													class={`${getDifficultyClass(item.difficulty || undefined)} 
														min-w-[48px] rounded-full px-3 py-1.5 text-center
														text-xs font-semibold
														shadow-sm
														transition-colors duration-200 ease-in-out`}
												>
													{item.difficulty || 'N/A'}
												</span>
												<span
													class={`min-w-[48px] rounded-full border px-3 py-1.5 text-center text-xs font-semibold text-nowrap shadow-sm transition-transform duration-700 ease-in-out
    ${
			!item.submission?.xp_reward
				? 'border-slate-300 bg-gradient-to-r from-slate-100 to-gray-100 text-slate-600 dark:border-slate-600 dark:from-slate-800/50 dark:to-slate-700/50 dark:text-slate-400'
				: 'border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 text-blue-700 dark:border-blue-700/50 dark:from-blue-900/30 dark:to-violet-900/30 dark:text-blue-300'
		}`}
												>
													{!item.submission?.xp_reward
														? `${item.base_xp} XP`
														: item.submission?.xp_reward >= item.base_xp
															? `${item.submission?.xp_reward} XP`
															: `${item.submission?.xp_reward}/${item.base_xp} XP`}
												</span>
											</div>
										</div>
									</a>

									{#if index < module.items.length - 1}
										<div class="flex justify-center py-4">
											<div
												class="h-10 w-1 rounded-full bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 dark:from-slate-600 dark:via-slate-700 dark:to-slate-600"
											></div>
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

<style>
	@keyframes gentle-pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.02);
		}
	}

	@keyframes bounce-slow {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	.animate-gentle-pulse {
		animation: gentle-pulse 3s infinite;
	}

	.animate-bounce-slow {
		animation: bounce-slow 2s infinite;
	}
</style>

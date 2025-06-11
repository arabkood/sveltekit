<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import { cn } from '$utils/classnames';
	import { useXp } from '$utils/xp';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import { fly } from 'svelte/transition';

	let { totalXp }: { totalXp: number } = $props();

	const themes = {
		legendary: {
			bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20',
			border: 'border-purple-200/50 dark:border-fuchsia-700/50',
			hoverBorder: 'hover:border-purple-300 dark:hover:border-fuchsia-500',
			text: 'text-fuchsia-800 dark:text-fuchsia-300',
			icon: 'text-fuchsia-600 dark:text-purple-300',
			progress: 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-600',
			glow: 'shadow-fuchsia-200/50 dark:shadow-purple-900/30',
			hoverGlow: 'hover:shadow-fuchsia-300/60 dark:hover:shadow-fuchsia-800/40',
			accent: 'from-violet-400 to-fuchsia-500'
		},
		warrior: {
			bg: 'bg-gradient-to-br from-rose-50 to-red-100 dark:from-rose-900/20 dark:to-red-900/20',
			border: 'border-rose-200/50 dark:border-red-700/50',
			hoverBorder: 'hover:border-rose-300 dark:hover:border-red-500',
			text: 'text-red-700 dark:text-rose-300',
			icon: 'text-rose-600 dark:text-red-400',
			progress: 'bg-gradient-to-r from-rose-500 via-red-500 to-pink-600',
			glow: 'shadow-rose-200/50 dark:shadow-red-900/30',
			hoverGlow: 'hover:shadow-rose-300/60 dark:hover:shadow-red-800/40',
			accent: 'from-rose-400 to-red-500'
		},
		expert: {
			bg: 'bg-gradient-to-br from-cyan-50 to-indigo-50 dark:from-cyan-900/20 dark:to-indigo-900/20',
			border: 'border-cyan-200/50 dark:border-indigo-700/50',
			hoverBorder: 'hover:border-cyan-300 dark:hover:border-indigo-500',
			text: 'text-indigo-700 dark:text-cyan-300',
			icon: 'text-cyan-600 dark:text-blue-400',
			progress: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600',
			glow: 'shadow-cyan-200/50 dark:shadow-blue-900/30',
			hoverGlow: 'hover:shadow-cyan-300/60 dark:hover:shadow-blue-800/40',
			accent: 'from-cyan-400 to-indigo-500'
		},
		advanced: {
			bg: 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20',
			border: 'border-green-200/50 dark:border-teal-700/50',
			hoverBorder: 'hover:border-green-300 dark:hover:border-teal-500',
			text: 'text-green-700 dark:text-teal-300',
			icon: 'text-green-600 dark:text-emerald-400',
			progress: 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600',
			glow: 'shadow-green-200/50 dark:shadow-emerald-900/30',
			hoverGlow: 'hover:shadow-green-300/60 dark:hover:shadow-teal-800/40',
			accent: 'from-green-400 to-emerald-500'
		},
		rising: {
			bg: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
			border: 'border-yellow-200/50 dark:border-amber-700/50',
			hoverBorder: 'hover:border-yellow-300 dark:hover:border-orange-500',
			text: 'text-yellow-700 dark:text-amber-300',
			icon: 'text-yellow-600 dark:text-orange-400',
			progress: 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600',
			glow: 'shadow-yellow-200/50 dark:shadow-orange-900/30',
			hoverGlow: 'hover:shadow-yellow-300/60 dark:hover:shadow-orange-800/40',
			accent: 'from-yellow-400 to-orange-500'
		},
		beginner: {
			bg: 'bg-gradient-to-br from-slate-50 to-zinc-50 dark:from-slate-900/20 dark:to-zinc-900/20',
			border: 'border-slate-200/50 dark:border-zinc-700/50',
			hoverBorder: 'hover:border-slate-300 dark:hover:border-zinc-500',
			text: 'text-slate-700 dark:text-zinc-300',
			icon: 'text-slate-600 dark:text-gray-400',
			progress: 'bg-gradient-to-r from-slate-500 via-gray-500 to-zinc-600',
			glow: 'shadow-slate-200/50 dark:shadow-zinc-900/30',
			hoverGlow: 'hover:shadow-slate-300/60 dark:hover:shadow-zinc-800/40',
			accent: 'from-slate-400 to-zinc-500'
		}
	};

	const RANKS = [
		{
			minLevel: 100,
			title: 'أسطورة عظمى',
			color:
				'dark:from-violet-500 dark:via-purple-500 dark:to-fuchsia-600 from-violet-600 via-purple-600 to-fuchsia-700 dark:text-violet-200 text-violet-100',
			glow: 'dark:shadow-violet-400/40 shadow-violet-500/60',
			bgColor:
				'dark:bg-gradient-to-br dark:from-violet-500/20 dark:to-fuchsia-500/20 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15',
			icon: '👑',
			theme: 'legendary'
		},
		{
			minLevel: 50,
			title: 'محارب أسطوري',
			color:
				'dark:from-rose-500 dark:via-red-500 dark:to-pink-600 from-rose-600 via-red-600 to-pink-700 dark:text-rose-200 text-rose-100',
			glow: 'dark:shadow-rose-400/40 shadow-rose-500/60',
			bgColor:
				'dark:bg-gradient-to-br dark:from-rose-500/20 dark:to-red-500/20 bg-gradient-to-br from-rose-500/15 to-red-500/15',
			icon: '⚔️',
			theme: 'warrior'
		},
		{
			minLevel: 25,
			title: 'خبير ماهر',
			color:
				'dark:from-cyan-500 dark:via-blue-500 dark:to-indigo-600 from-cyan-600 via-blue-600 to-indigo-700 dark:text-cyan-200 text-cyan-100',
			glow: 'dark:shadow-blue-400/40 shadow-blue-500/60',
			bgColor:
				'dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-blue-500/20 bg-gradient-to-br from-cyan-500/15 to-blue-500/15',
			icon: '🎯',
			theme: 'expert'
		},
		{
			minLevel: 10,
			title: 'محترف متقدم',
			color:
				'dark:from-green-500 dark:via-emerald-500 dark:to-teal-600 from-green-600 via-emerald-600 to-teal-700 dark:text-green-200 text-green-100',
			glow: 'dark:shadow-green-400/40 shadow-green-500/60',
			bgColor:
				'dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-500/20 bg-gradient-to-br from-green-500/15 to-emerald-500/15',
			icon: '🚀',
			theme: 'advanced'
		},
		{
			minLevel: 5,
			title: 'نجم صاعد',
			color:
				'dark:from-yellow-500 dark:via-amber-500 dark:to-orange-600 from-yellow-600 via-amber-600 to-orange-700 dark:text-yellow-200 text-yellow-100',
			glow: 'dark:shadow-yellow-400/40 shadow-yellow-500/60',
			bgColor:
				'dark:bg-gradient-to-br dark:from-yellow-500/20 dark:to-amber-500/20 bg-gradient-to-br from-yellow-500/15 to-amber-500/15',
			icon: '⭐',
			theme: 'rising'
		},
		{
			minLevel: 0,
			title: 'مبتدئ واعد',
			color:
				'dark:from-slate-500 dark:via-gray-500 dark:to-zinc-600 from-slate-600 via-gray-600 to-zinc-700 dark:text-slate-200 text-slate-100',
			glow: 'dark:shadow-slate-400/40 shadow-slate-500/60',
			bgColor:
				'dark:bg-gradient-to-br dark:from-slate-500/20 dark:to-gray-500/20 bg-gradient-to-br from-slate-500/15 to-gray-500/15',
			icon: '🌱',
			theme: 'beginner'
		}
	];

	// const theme = {
	// 	bg: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
	// 	border: 'border-gray-200/50 dark:border-slate-700/50',
	// 	text: 'text-gray-700 dark:text-slate-300',
	// 	icon: 'text-gray-600 dark:text-slate-400',
	// 	progress: 'bg-gradient-to-r from-slate-500 via-gray-500 to-slate-600',
	// 	glow: 'shadow-gray-200/50 dark:shadow-slate-900/30',
	// 	hoverGlow: 'hover:shadow-gray-300/60 dark:hover:shadow-slate-800/40',
	// 	accent: 'from-gray-400 to-slate-500'
	// };

	const xp = $derived(useXp(totalXp));

	const currentRank = $derived.by(() => {
		return RANKS.find((rank) => xp.currentLevel >= rank.minLevel) || RANKS[RANKS.length - 1];
	});

	const theme = $derived(themes[currentRank.theme as keyof typeof themes]);

	let progressAnimated = $state(false);
	let displayXp = new Spring(0, { stiffness: 0.1, damping: 0.8 });
	let progressWidth = new Spring(0, { stiffness: 0.1, damping: 0.6 });

	onMount(() => {
		setTimeout(() => {
			displayXp.set(totalXp);
			progressWidth.set(xp.progressPercent);
			progressAnimated = true;
		}, 400);
	});
</script>

<div
	class={cn(
		'group relative overflow-hidden rounded-2xl border p-6 shadow-lg backdrop-blur-sm transition-all duration-500',
		theme.bg,
		theme.border,
		theme.glow,
		theme.hoverGlow,
		theme.hoverBorder,
		'hover:-translate-y-1 hover:scale-[1.02]'
	)}
>
	<div class="absolute inset-0 opacity-5">
		<svg class="h-full w-full" viewBox="0 0 100 100">
			<defs>
				<pattern id="grid-xp" width="10" height="10" patternUnits="userSpaceOnUse">
					<path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#grid-xp)" class={theme.text} />
		</svg>
	</div>

	<div
		class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br {theme.accent} opacity-10 blur-xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-20"
	></div>
	<div
		class="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-gradient-to-tr {theme.accent} opacity-5 blur-2xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-15"
	></div>

	<div class="relative flex items-start gap-4">
		<div
			class={cn(
				'relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300',
				theme.bg,
				'shadow-lg ring-1 ring-white/20',
				'group-hover:scale-110 group-hover:rotate-3'
			)}
		>
			<div
				class="absolute inset-0 rounded-xl bg-gradient-to-br {theme.accent} opacity-20 blur transition-all duration-300 group-hover:opacity-40"
			></div>

			<span class={cn('text-center text-lg transition-all duration-300', theme.icon)}
				>{currentRank.icon}</span
			>
		</div>

		<div class="min-w-0 flex-1">
			<p
				class={cn(
					'text-sm font-medium transition-all duration-300',
					theme.text,
					'opacity-70 group-hover:opacity-90'
				)}
			>
				{i18n.t('dashboard.xp')}
			</p>

			<div class="mt-1 overflow-hidden">
				<p
					class={cn(
						'text-3xl font-bold transition-all duration-500',
						theme.text,
						'bg-gradient-to-r bg-clip-text',
						theme.accent
					)}
				>
					{Math.floor(displayXp.current).toLocaleString()} XP
				</p>
			</div>

			<div class="mt-4 space-y-3" in:fly={{ y: 20, duration: 600, delay: 800 }}>
				<div
					class={cn(
						'relative overflow-hidden rounded-lg p-3 backdrop-blur-sm',
						currentRank.bgColor,
						theme.text
					)}
				>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<span class="text-lg">{currentRank.icon}</span>
							<div>
								<div class={cn('text-sm font-bold')}>
									{currentRank.title}
								</div>
								<span class={cn('text-xs font-bold tracking-wide uppercase opacity-70')}>
									Level {xp.currentLevel}
								</span>
							</div>
						</div>
						<div
							class={cn(
								'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold shadow-sm',
								currentRank.bgColor
							)}
						>
							{xp.currentLevel}
						</div>
					</div>
				</div>

				<div class="space-y-2">
					<div class="flex items-center justify-between text-xs">
						<span class={cn('font-medium', theme.text, 'opacity-60')}>
							{xp.xpLeftForNextLevel.toLocaleString()} XP to go
						</span>
						<span class={cn('font-bold', theme.text)}>
							{Math.floor(progressWidth.current)}%
						</span>
					</div>

					<div class="relative h-2 overflow-hidden rounded-full bg-white/30 dark:bg-gray-800/50">
						<div
							class={cn(
								'relative h-full rounded-full transition-all duration-1000',
								theme.progress
							)}
							style="width: {progressAnimated ? progressWidth.current : 0}%"
						></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

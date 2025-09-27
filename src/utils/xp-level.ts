import type { IconPngName } from '$ui/common/IconPng.svelte';

// The RankTheme interface remains the same.
export interface RankTheme {
	bg: string;
	border: string;
	hoverBorder: string;
	text: string;
	progress: string;
	glow: string;
	hoverGlow: string;
	accent: string;
}

export interface Rank {
	minLevel: number;
	icon: IconPngName;
	theme: RankTheme;
	name: string;
}

// NO MORE createTheme function. We define everything directly.
export const RANKS: Rank[] = [
	{
		minLevel: 90,
		name: 'الحكيم', // The Wise One
		icon: 'level_badges_9',
		theme: {
			bg: 'bg-gradient-to-br from-violet-50 via-purple-50 to-amber-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-amber-900/20',
			border: 'border-violet-300/50 dark:border-amber-700/50',
			hoverBorder: 'hover:border-violet-400 dark:hover:border-amber-500',
			text: 'text-violet-800 dark:text-violet-300',
			progress: 'bg-gradient-to-r from-violet-500 via-purple-500 to-amber-500',
			glow: 'shadow-violet-300/60 dark:shadow-amber-900/40',
			hoverGlow: 'hover:shadow-violet-400/70 dark:hover:shadow-amber-800/50',
			accent: 'from-violet-600 via-purple-500 to-amber-500'
		}
	},
	{
		minLevel: 80,
		name: 'العالِم', // The Scholar
		icon: 'level_badges_8',
		theme: {
			bg: 'bg-gradient-to-br from-purple-50 via-cyan-50 to-yellow-50 dark:from-purple-900/20 dark:via-cyan-900/20 dark:to-yellow-900/20',
			border: 'border-purple-300/50 dark:border-yellow-700/50',
			hoverBorder: 'hover:border-purple-400 dark:hover:border-yellow-500',
			text: 'text-purple-800 dark:text-purple-300',
			progress: 'bg-gradient-to-r from-purple-500 via-cyan-500 to-yellow-500',
			glow: 'shadow-purple-300/60 dark:shadow-yellow-900/40',
			hoverGlow: 'hover:shadow-purple-400/70 dark:hover:shadow-yellow-800/50',
			accent: 'from-purple-600 via-cyan-500 to-yellow-500'
		}
	},
	{
		minLevel: 70,
		name: 'الأستاذ', // The Master/Professor
		icon: 'level_badges_7',
		theme: {
			bg: 'bg-gradient-to-br from-purple-50 to-yellow-50 dark:from-purple-900/20 dark:to-yellow-900/20',
			border: 'border-purple-300/50 dark:border-yellow-700/50',
			hoverBorder: 'hover:border-purple-400 dark:hover:border-yellow-500',
			text: 'text-purple-800 dark:text-purple-300',
			progress: 'bg-gradient-to-r from-purple-500 to-yellow-500',
			glow: 'shadow-purple-300/60 dark:shadow-yellow-900/40',
			hoverGlow: 'hover:shadow-purple-400/70 dark:hover:shadow-yellow-800/50',
			accent: 'from-purple-600 to-yellow-500'
		}
	},
	{
		minLevel: 60,
		name: 'المهندس', // The Engineer
		icon: 'level_badges_6',
		theme: {
			bg: 'bg-gradient-to-br from-purple-50 to-red-50 dark:from-purple-900/20 dark:to-red-900/20',
			border: 'border-purple-300/50 dark:border-red-700/50',
			hoverBorder: 'hover:border-purple-400 dark:hover:border-red-500',
			text: 'text-purple-800 dark:text-purple-300',
			progress: 'bg-gradient-to-r from-purple-500 to-red-500',
			glow: 'shadow-purple-300/60 dark:shadow-red-900/40',
			hoverGlow: 'hover:shadow-purple-400/70 dark:hover:shadow-red-800/50',
			accent: 'from-purple-600 to-red-500'
		}
	},
	{
		minLevel: 50,
		name: 'الباحث', // The Researcher
		icon: 'level_badges_5',
		theme: {
			bg: 'bg-gradient-to-br from-slate-50 to-red-50 dark:from-slate-900/20 dark:to-red-900/20',
			border: 'border-slate-300/50 dark:border-red-700/50',
			hoverBorder: 'hover:border-slate-400 dark:hover:border-red-500',
			text: 'text-slate-800 dark:text-slate-300',
			progress: 'bg-gradient-to-r from-slate-500 to-red-500',
			glow: 'shadow-slate-300/60 dark:shadow-red-900/40',
			hoverGlow: 'hover:shadow-slate-400/70 dark:hover:shadow-red-800/50',
			accent: 'from-slate-600 to-red-500'
		}
	},
	// ... and so on for the rest of the ranks. I've completed them all for you below.
	{
		minLevel: 40,
		name: 'المطور', // The Developer
		icon: 'level_badges_4',
		theme: {
			bg: 'bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20',
			border: 'border-blue-300/50 dark:border-slate-700/50',
			hoverBorder: 'hover:border-blue-400 dark:hover:border-slate-500',
			text: 'text-blue-800 dark:text-blue-300',
			progress: 'bg-gradient-to-r from-blue-500 to-slate-500',
			glow: 'shadow-blue-300/60 dark:shadow-slate-900/40',
			hoverGlow: 'hover:shadow-blue-400/70 dark:hover:shadow-slate-800/50',
			accent: 'from-blue-600 to-slate-500'
		}
	},
	{
		minLevel: 30,
		name: 'المبرمج', // The Programmer
		icon: 'level_badges_3',
		theme: {
			bg: 'bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-900/20 dark:to-teal-900/20',
			border: 'border-slate-300/50 dark:border-teal-700/50',
			hoverBorder: 'hover:border-slate-400 dark:hover:border-teal-500',
			text: 'text-slate-800 dark:text-slate-300',
			progress: 'bg-gradient-to-r from-slate-500 to-teal-500',
			glow: 'shadow-slate-300/60 dark:shadow-teal-900/40',
			hoverGlow: 'hover:shadow-slate-400/70 dark:hover:shadow-teal-800/50',
			accent: 'from-slate-600 to-teal-500'
		}
	},
	{
		minLevel: 20,
		name: 'الطالب', // The Student/Seeker
		icon: 'level_badges_2',
		theme: {
			bg: 'bg-gradient-to-br from-gray-50 to-yellow-50 dark:from-gray-900/20 dark:to-yellow-900/20',
			border: 'border-gray-300/50 dark:border-yellow-700/50',
			hoverBorder: 'hover:border-gray-400 dark:hover:border-yellow-500',
			text: 'text-gray-800 dark:text-gray-300',
			progress: 'bg-gradient-to-r from-gray-500 to-yellow-500',
			glow: 'shadow-gray-300/60 dark:shadow-yellow-900/40',
			hoverGlow: 'hover:shadow-gray-400/70 dark:hover:shadow-yellow-800/50',
			accent: 'from-gray-600 to-yellow-500'
		}
	},
	{
		minLevel: 10,
		name: 'المتدرب', // The Trainee
		icon: 'level_badges_1',
		theme: {
			bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
			border: 'border-yellow-300/50 dark:border-amber-700/50',
			hoverBorder: 'hover:border-yellow-400 dark:hover:border-amber-500',
			text: 'text-yellow-800 dark:text-yellow-300',
			progress: 'bg-gradient-to-r from-yellow-500 to-amber-500',
			glow: 'shadow-yellow-300/60 dark:shadow-amber-900/40',
			hoverGlow: 'hover:shadow-yellow-400/70 dark:hover:shadow-amber-800/50',
			accent: 'from-yellow-600 to-amber-500'
		}
	},
	{
		minLevel: 0,
		name: 'المبتدئ', // The Beginner
		icon: 'level_badges_0',
		theme: {
			bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
			border: 'border-amber-300/50 dark:border-orange-700/50',
			hoverBorder: 'hover:border-amber-400 dark:hover:border-orange-500',
			text: 'text-amber-800 dark:text-amber-300',
			progress: 'bg-gradient-to-r from-amber-500 to-orange-500',
			glow: 'shadow-amber-300/60 dark:shadow-orange-900/40',
			hoverGlow: 'hover:shadow-amber-400/70 dark:hover:shadow-orange-800/50',
			accent: 'from-amber-600 to-orange-500'
		}
	}
];

export const getRankForLevel = (level: number): Rank => {
	return RANKS.find((rank) => level >= rank.minLevel) ?? RANKS[RANKS.length - 1];
};

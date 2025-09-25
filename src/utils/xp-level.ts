import type { IconPngName } from "$ui/common/IconPng.svelte";

// Same RankTheme interface as before.
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

// A more flexible theme generator that accepts an array of colors.
const createTheme = (colors: string[]): RankTheme => {
  // Use the first color as the primary and the last as the secondary for consistency.
  const primary = colors[0];
  const secondary = colors[colors.length - 1];

  let progressGradient = '';
  let accentGradient = '';
  let bgGradient = '';

  // Dynamically create gradient classes based on the number of colors.
  switch (colors.length) {
    case 1:
      progressGradient = `bg-${primary}-500`;
      accentGradient = `from-${primary}-500 to-${primary}-500`;
      bgGradient = `bg-${primary}-50 dark:bg-${primary}-900/20`;
      break;
    case 2:
      progressGradient = `bg-gradient-to-r from-${colors[0]}-500 to-${colors[1]}-500`;
      accentGradient = `from-${colors[0]}-600 to-${colors[1]}-500`;
      bgGradient = `bg-gradient-to-br from-${colors[0]}-50 to-${colors[1]}-50 dark:from-${colors[0]}-900/20 dark:to-${colors[1]}-900/20`;
      break;
    case 3:
    default: // Fallback for 3+ colors
      progressGradient = `bg-gradient-to-r from-${colors[0]}-500 via-${colors[1]}-500 to-${colors[2]}-500`;
      accentGradient = `from-${colors[0]}-600 via-${colors[1]}-500 to-${colors[2]}-500`;
      bgGradient = `bg-gradient-to-br from-${colors[0]}-50 via-${colors[1]}-50 to-${colors[2]}-50 dark:from-${colors[0]}-900/20 via-${colors[1]}-900/20 dark:to-${colors[2]}-900/20`;
      break;
  }

  return {
    bg: bgGradient,
    border: `border-${primary}-300/50 dark:border-${secondary}-700/50`,
    hoverBorder: `hover:border-${primary}-400 dark:hover:border-${secondary}-500`,
    text: `text-${primary}-800 dark:text-${primary}-300`,
    progress: progressGradient,
    glow: `shadow-${primary}-300/60 dark:shadow-${secondary}-900/40`,
    hoverGlow: `hover:shadow-${primary}-400/70 dark:hover:shadow-${secondary}-800/50`,
    accent: accentGradient
  };
};

export interface Rank {
  minLevel: number;
  icon: IconPngName;
  theme: RankTheme;
  name: string;
}

// Now we can define themes with 2 or 3 colors easily.
export const RANKS: Rank[] = [
  {
    minLevel: 90,
    name: 'الحكيم', // Al-Hakeem (The Wise One)
    icon: 'level_badges_9',
    theme: createTheme(['violet', 'purple', 'amber'])
  },
  {
    minLevel: 80,
    name: 'العالِم', // Al-Aalim (The Scholar)
    icon: 'level_badges_8',
    theme: createTheme(['purple', 'cyan', 'yellow'])
  },
  {
    minLevel: 70,
    name: 'الأستاذ', // Al-Ustaz (The Master/Professor)
    icon: 'level_badges_7',
    theme: createTheme(['purple', 'yellow'])
  },
  {
    minLevel: 60,
    name: 'المهندس', // Al-Muhandis (The Engineer)
    icon: 'level_badges_6',
    theme: createTheme(['purple', 'red'])
  },
  {
    minLevel: 50,
    name: 'الباحث', // Al-Bahith (The Researcher)
    icon: 'level_badges_5',
    theme: createTheme(['slate', 'red'])
  },
  {
    minLevel: 40,
    name: 'المطور', // Al-Mutawwir (The Developer)
    icon: 'level_badges_4',
    theme: createTheme(['blue', 'slate'])
  },
  {
    minLevel: 30,
    name: 'المبرمج', // Al-Mubarmij (The Programmer)
    icon: 'level_badges_3',
    theme: createTheme(['slate', 'teal'])
  },
  {
    minLevel: 20,
    name: 'الطالب', // Al-Talib (The Student/Seeker)
    icon: 'level_badges_2',
    theme: createTheme(['gray', 'yellow'])
  },
  {
    minLevel: 10,
    name: 'المتدرب', // Al-Mutadarrib (The Trainee)
    icon: 'level_badges_1',
    theme: createTheme(['yellow', 'amber'])
  },
  {
    minLevel: 0,
    name: 'المبتدئ', // Al-Mubtadi' (The Beginner)
    icon: 'level_badges_0',
    theme: createTheme(['amber', 'orange'])
  }
];

export const getRankForLevel = (level: number): Rank => {
  return RANKS.find((rank) => level >= rank.minLevel) ?? RANKS[RANKS.length - 1];
};

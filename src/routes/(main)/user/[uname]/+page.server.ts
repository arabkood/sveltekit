import type { PageServerLoad } from './$types';
import type { UserProfileData, Contribution } from '$types/user';

export const load: PageServerLoad = async () => {
  const userProfile: UserProfileData = {
    profile: {
      name: 'Alex Doe',
      handle: '@alex_the_coder',
      bio: 'Full-stack developer & lifelong learner. Turning coffee into clean code since 2020. Currently mastering Rust and advanced algorithms.',
      avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      isOnline: true
    },
    stats: {
      xp: 12840,
      problems: 215,
      league: 'Gold II',
      streak: 78
    },
    // Generate 365 days of random contribution data
    contributions: Array.from({ length: 365 }, () => ({
      level: Math.floor(Math.random() * 5) as Contribution['level']
    })),
    skills: [
      { name: 'JavaScript', level: 90, color: 'blue' },
      { name: 'Python', level: 85, color: 'green' },
      { name: 'React', level: 88, color: 'cyan' },
      { name: 'Node.js', level: 82, color: 'emerald' },
      { name: 'Rust', level: 45, color: 'red' },
      { name: 'TypeScript', level: 78, color: 'blue' }
    ],
    activities: [
      { type: 'solved', title: 'Solved "Two Sum"', subtitle: 'Difficulty: Easy', timeAgo: '2 hours ago', icon: '✓' },
      { type: 'solved', title: 'Solved "Binary Tree Inorder"', subtitle: 'Difficulty: Medium', timeAgo: '5 hours ago', icon: '✓' },
      { type: 'streak', title: 'Maintained 78-day streak', timeAgo: '1 day ago', icon: '🔥' },
      { type: 'achievement', title: 'Earned "Rust Explorer" badge', timeAgo: '2 days ago', icon: '🏆' }
    ],
    achievements: [
      { name: 'Hot Streak', description: '75+ Days', icon: '🔥' },
      { name: 'Problem Solver', description: '200+ Solved', icon: '🧩' },
      { name: 'Code Warrior', description: 'Gold League', icon: '⚔️' },
      { name: 'Night Owl', description: 'Late Night Coder', icon: '🦉' },
      { name: 'Speed Demon', description: 'Fast Solutions', icon: '⚡' },
      { name: 'Rust Explorer', description: 'Learning Rust', icon: '🦀' }
    ],
    community: {
      followers: 1204,
      following: 89,
      joinDate: 'Mar 15, 2020'
    },
    learningTracks: [
      { name: 'Advanced Rust', progress: 7, total: 12, color: 'red' },
      { name: 'System Design', progress: 4, total: 8, color: 'purple' },
      { name: 'Algorithms', progress: 12, total: 15, color: 'blue' }
    ]
  };

  return { userProfile };
};

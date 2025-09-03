// For the main user card
export type ProfileInfo = {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  isOnline: boolean;
};

// For the stats bar in the header
export type ProfileStats = {
  xp: number;
  problems: number;
  league: string;
  streak: number;
};

// For the contribution graph squares
export type Contribution = {
  level: 0 | 1 | 2 | 3 | 4;
};

// For the skills list
export type Skill = {
  name: string;
  level: number;
  color: string;
};

// For the recent activity feed
export type Activity = {
  type: 'solved' | 'streak' | 'achievement';
  icon: string;
  timeAgo: string;
  title: string;
  subtitle?: string;
};

// For the achievement badges
export type Achievement = {
  name: string;
  description: string;
  icon: string;
};

// For the followers/following section
export type CommunityStats = {
  followers: number;
  following: number;
  joinDate: string;
};

// For the learning tracks section
export type LearningTrack = {
  name: string;
  progress: number;
  total: number;
  color: string;
};

// This defines the complete data structure for our page
export interface UserProfileData {
  profile: ProfileInfo;
  stats: ProfileStats;
  contributions: Contribution[];
  skills: Skill[];
  activities: Activity[];
  achievements: Achievement[];
  community: CommunityStats;
  learningTracks: LearningTrack[];
}

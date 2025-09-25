// Configuration for psychological optimization
const LEVEL_MODIFIER = 0.08;
const EARLY_GAME_BOOST = 1.5; // Makes early levels faster
const MILESTONE_LEVELS = [5, 10, 25, 50, 100]; // Special milestone levels
const NEAR_LEVELUP_THRESHOLD = 0.85; // 85% progress triggers "almost there" state

/**
 * Converts XP into a level using a psychologically optimized growth curve.
 * Uses a hybrid approach: faster early progression, then standard square root.
 */
function convertXpToLevel(xp: number): number {
  const safeXp = Math.max(xp, 0);

  // Early game boost: first 1000 XP gets accelerated progression
  if (safeXp <= 1000) {
    return Math.floor(LEVEL_MODIFIER * EARLY_GAME_BOOST * Math.sqrt(safeXp));
  }

  // Standard progression after early game
  const earlyLevels = Math.floor(LEVEL_MODIFIER * EARLY_GAME_BOOST * Math.sqrt(1000));
  const remainingXp = safeXp - 1000;
  const additionalLevels = Math.floor(LEVEL_MODIFIER * Math.sqrt(remainingXp));

  return earlyLevels + additionalLevels;
}

/**
 * Converts a level into the total XP required to reach it.
 * Accounts for the early game boost in calculations.
 */
function convertLevelToXp(level: number): number {
  const safeLevel = Math.max(level, 0);

  if (safeLevel === 0) return 0;

  // Calculate early game threshold level
  const earlyGameMaxLevel = Math.floor(LEVEL_MODIFIER * EARLY_GAME_BOOST * Math.sqrt(1000));

  if (safeLevel <= earlyGameMaxLevel) {
    // Level is in early game range
    return Math.pow(safeLevel / (LEVEL_MODIFIER * EARLY_GAME_BOOST), 2);
  }

  // Level is beyond early game
  const earlyGameXp = 1000;
  const additionalLevels = safeLevel - earlyGameMaxLevel;
  const additionalXp = Math.pow(additionalLevels / LEVEL_MODIFIER, 2);

  return earlyGameXp + additionalXp;
}

/**
 * Determines if a level is a milestone level that deserves special recognition.
 */
function isMilestoneLevel(level: number): boolean {
  return MILESTONE_LEVELS.includes(level) || level % 100 === 0;
}

/**
 * Calculates a streak multiplier based on consecutive level-ups.
 * This encourages sustained engagement.
 */
function calculateStreakMultiplier(recentLevelUps: number): number {
  if (recentLevelUps >= 5) return 1.5;
  if (recentLevelUps >= 3) return 1.25;
  if (recentLevelUps >= 2) return 1.1;
  return 1.0;
}

/**
 * Computes XP and level progress details with psychological insights.
 */
function useXp(xp: number) {
  const safeXp = Math.max(xp, 0);
  const currentLevel = convertXpToLevel(safeXp);
  const nextLevel = currentLevel + 1;
  const xpForCurrentLevel = convertLevelToXp(currentLevel);
  const xpForNextLevel = convertLevelToXp(nextLevel);
  const xpIntoCurrentLevel = safeXp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const xpLeftForNextLevel = xpForNextLevel - safeXp;

  const progressPercent =
    xpNeededForNextLevel === 0
      ? 0
      : Number(((xpIntoCurrentLevel * 100) / xpNeededForNextLevel).toFixed(1));

  // Psychological insights
  const isNearLevelUp = progressPercent >= NEAR_LEVELUP_THRESHOLD * 100;
  const isMilestone = isMilestoneLevel(nextLevel);
  const isInEarlyGame = safeXp <= 1000;

  // Next level XP requirement (for showing "you need X more XP")
  const xpGainNeededForNextLevel = Math.ceil(xpLeftForNextLevel);

  // Estimate XP gains needed based on typical session
  const estimatedXpPerAction = 10; // Adjust based on your game
  const actionsNeededForNextLevel = Math.ceil(xpGainNeededForNextLevel / estimatedXpPerAction);

  return {
    // Core progression data
    currentLevel,
    nextLevel,
    totalXp: safeXp,
    xpForCurrentLevel,
    xpForNextLevel,
    xpIntoCurrentLevel,
    xpNeededForNextLevel,
    xpLeftForNextLevel: xpGainNeededForNextLevel,
    progressPercent,

    // Psychological insights
    isNearLevelUp,
    isMilestone,
    isNextLevelMilestone: isMilestoneLevel(nextLevel),
    isInEarlyGame,
    actionsNeededForNextLevel,

    // Motivational messages
    motivationalState: getMotivationalState(progressPercent, isNearLevelUp, isMilestone)
  };
}

/**
 * Determines the current motivational state for UI feedback.
 */
function getMotivationalState(
  progressPercent: number,
  isNearLevelUp: boolean,
  isMilestone: boolean
): string {
  if (isNearLevelUp && isMilestone) return 'milestone_close';
  if (isNearLevelUp) return 'almost_there';
  if (progressPercent >= 50) return 'halfway_plus';
  if (progressPercent >= 25) return 'making_progress';
  return 'getting_started';
}

/**
 * Generates a visual progress bar representation.
 */
function generateProgressBar(progressPercent: number, length: number = 20): string {
  const filled = Math.floor((progressPercent / 100) * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Gets contextual messages to display based on progress state.
 */
function getProgressMessages(progressData: ReturnType<typeof useXp>): {
  primary: string;
  secondary: string;
  actionPrompt?: string;
} {
  const { progressPercent, isNearLevelUp, actionsNeededForNextLevel, nextLevel, isMilestone } =
    progressData;

  if (isNearLevelUp && isMilestone) {
    return {
      primary: `🎯 Milestone Level ${nextLevel} is within reach!`,
      secondary: `Only ${progressData.xpLeftForNextLevel} XP to go`,
      actionPrompt: `Complete ${actionsNeededForNextLevel} more actions to unlock rewards!`
    };
  }

  if (isNearLevelUp) {
    return {
      primary: `🔥 Almost there! Level ${nextLevel} incoming`,
      secondary: `${progressData.xpLeftForNextLevel} XP remaining`,
      actionPrompt: `Just ${actionsNeededForNextLevel} more actions!`
    };
  }

  if (progressPercent >= 50) {
    return {
      primary: `🚀 Making great progress!`,
      secondary: `${progressPercent.toFixed(0)}% to Level ${nextLevel}`
    };
  }

  return {
    primary: `📈 Level ${progressData.currentLevel}`,
    secondary: `${progressPercent.toFixed(0)}% progress to next level`
  };
}

export {
  convertXpToLevel,
  convertLevelToXp,
  useXp,
  isMilestoneLevel,
  calculateStreakMultiplier,
  getProgressMessages,
  MILESTONE_LEVELS,
  NEAR_LEVELUP_THRESHOLD,
  generateProgressBar
};

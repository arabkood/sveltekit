const LEVEL_MODIFIER = 0.2;

function convertXpToLevel(xp: number): number {
	return Math.floor(LEVEL_MODIFIER * Math.sqrt(xp));
}

function convertLevelToXp(level: number): number {
	return Math.pow(level / LEVEL_MODIFIER, 2);
}

function useXp(xp: number) {
	const level = convertXpToLevel(xp);

	const prevXp = convertLevelToXp(level - 1);
	const nextXp = convertLevelToXp(level + 1);

	const xpMod = xp - prevXp;
	const nextXpMod = nextXp - prevXp;

	const progress = ((xpMod * 100) / nextXpMod).toFixed(3);

	return {
		progressUntilNext: progress,
		level: level,
		prevLevel: level - 1,
		nextLevel: level + 1,
		prevXp,
		nextXp,
		xp,
		xpMod,
		nextXpMod
	};
}

export { convertXpToLevel, convertLevelToXp, useXp };

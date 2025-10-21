import type { LessonStep } from "$types/lesson";

const weights = {
	markdown: 1,
	fill: 5,
	quiz: 4,
	order: 5,
	bug: 3,
}

export function distributeXP(steps: LessonStep[], totalXP: number): number[] {
	const stepWeights = steps.map(step =>
		typeof step === 'string' ? weights.markdown : weights[step.type as keyof typeof weights]
	);

	const totalWeight = stepWeights.reduce((sum, w) => sum + w, 0);

	// Distribute proportionally and round
	const xpPerStep = stepWeights.map(w =>
		Math.floor((w / totalWeight) * totalXP)
	);

	// Handle rounding remainder - add to final step
	const distributed = xpPerStep.reduce((sum, xp) => sum + xp, 0);
	xpPerStep[xpPerStep.length - 1] += (totalXP - distributed);

	return xpPerStep;
}

import { userRepository } from '../db/repos/user';
import { rateLimiter, changeAccountLimiter, changeAccountSuccessLimiter } from '../ratelimit';

export class UserRateLimitError extends Error {
	constructor(public errorKey: string, public retryAfterSecs: number) {
		super(errorKey);
		this.name = 'UserRateLimitError';
	}
}

export class UserValidationError extends Error {
	constructor(public errorKey: string) {
		super(errorKey);
		this.name = 'UserValidationError';
	}
}

export class UserService {
	static async changeUsername(userId: string, currentUsername: string, newUsername: string, ipAddress: string, userAgent: string) {
		if (currentUsername === newUsername) {
			return true;
		}

		const limit = await rateLimiter.safeConsume(changeAccountLimiter, userId);
		if (!limit.success) {
			throw new UserRateLimitError('rateLimit.changeAccount', limit.retryAfterSecs);
		}

		// Check success limiter before touching the DB (don't consume yet)
		const successLimiterState = await changeAccountSuccessLimiter.get(userId).catch(() => null);
		const remainingPoints = successLimiterState === null
			? changeAccountSuccessLimiter.points
			: successLimiterState.remainingPoints;
		
		if (remainingPoints <= 0) {
			const retryAfterSecs = Math.ceil((successLimiterState?.msBeforeNext ?? 3600000) / 1000);
			throw new UserRateLimitError('rateLimit.changeAccount', retryAfterSecs);
		}

		try {
			await userRepository.updateUsernameAndLogAudit(userId, newUsername, ipAddress, userAgent);
		} catch (error: any) {
			if (error.code === '23505' || error.constraint) {
				throw new UserValidationError('validation.username.exists');
			}
			throw error;
		}

		// Consume the success point only after a real username change
		await rateLimiter.safeConsume(changeAccountSuccessLimiter, userId);

		return true;
	}
}

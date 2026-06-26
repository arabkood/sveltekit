import { RateLimiterRedis } from 'rate-limiter-flexible';
import { valkey } from './valkey';

// A wrapper to handle the fail-open logic so ValKey outages don't break auth
type ConsumeResult = { success: true } | { success: false; retryAfterSecs: number };

async function safeConsume(limiter: RateLimiterRedis, key: string, points = 1): Promise<ConsumeResult> {
	try {
		await limiter.consume(key, points);
		return { success: true };
	} catch (rejRes: any) {
		// rate-limiter-flexible throws an object with remainingPoints, msBeforeNext, etc. on rate limit
		if (rejRes instanceof Error) {
			// This is a true connection/redis error, fail-open
			console.error('RateLimiterRedis connection error (Failing Open):', rejRes);
			return { success: true };
		}
		// It's a rate limit rejection
		const retryAfterSecs = Math.ceil((rejRes.msBeforeNext || 0) / 1000) || 1;
		return { success: false, retryAfterSecs };
	}
}

async function safeReset(limiter: RateLimiterRedis, key: string): Promise<void> {
	try {
		await limiter.delete(key);
	} catch (err) {
		console.error('RateLimiterRedis delete error:', err);
	}
}

export const rateLimiter = {
	consume: safeConsume,
	reset: safeReset
};

// Sign In
export const signinIpLimiter = new RateLimiterRedis({
	storeClient: valkey,
	keyPrefix: 'rl:signin:ip',
	points: 10,
	duration: 15 * 60 // 15 minutes
});

export const signinEmailLimiter = new RateLimiterRedis({
	storeClient: valkey,
	keyPrefix: 'rl:signin:email',
	points: 5,
	duration: 15 * 60 // 15 minutes
});

// Sign Up
export const signupIpLimiter = new RateLimiterRedis({
	storeClient: valkey,
	keyPrefix: 'rl:signup:ip',
	points: 20,
	duration: 60 * 60 // 1 hour
});

// Verify Email (OTP Submission)
export const verifyOtpLimiter = new RateLimiterRedis({
	storeClient: valkey,
	keyPrefix: 'rl:verify:otp',
	points: 5,
	duration: 15 * 60 // 15 minutes
});

// Verify Email (Resend)
export const resendOtpLimiter = new RateLimiterRedis({
	storeClient: valkey,
	keyPrefix: 'rl:verify:resend',
	points: 3,
	duration: 15 * 60 // 15 minutes
});

// Forgot Password
export const forgotPasswordIpLimiter = new RateLimiterRedis({
	storeClient: valkey,
	keyPrefix: 'rl:forgot:ip',
	points: 3,
	duration: 60 * 60 // 1 hour
});

export const forgotPasswordEmailLimiter = new RateLimiterRedis({
	storeClient: valkey,
	keyPrefix: 'rl:forgot:email',
	points: 3,
	duration: 60 * 60 // 1 hour
});

// Reset Password
export const resetPasswordIpLimiter = new RateLimiterRedis({
	storeClient: valkey,
	keyPrefix: 'rl:reset:ip',
	points: 5,
	duration: 15 * 60 // 15 minutes
});

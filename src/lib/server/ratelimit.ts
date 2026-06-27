import { RateLimiterRedis } from 'rate-limiter-flexible';
import { valkey } from './valkey';

type ConsumeResult = { success: true } | { success: false; retryAfterSecs: number };

// A wrapper to handle the fail-open logic so ValKey outages don't break auth
async function safeConsume(
	limiter: RateLimiterRedis,
	key: string,
	points = 1
): Promise<ConsumeResult> {
	try {
		await limiter.consume(key, points);
		return { success: true };
	} catch (rejRes: any) {
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

async function reset(limiter: RateLimiterRedis, key: string): Promise<void> {
	try {
		await limiter.delete(key);
	} catch (err) {
		console.error('RateLimiterRedis delete error:', err);
	}
}

export const rateLimiter = {
	safeConsume: safeConsume,
	reset: reset
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

export const signupEmailLimiter = new RateLimiterRedis({
	storeClient: valkey,
	keyPrefix: 'rl:signup:email',
	points: 3,
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

// Settings - Change Password (per user, brute-force protection)
export const changePasswordLimiter = new RateLimiterRedis({
	storeClient: valkey,
	keyPrefix: 'rl:settings:password',
	points: 5,
	duration: 15 * 60 // 15 minutes
});

// Settings - Change Account attempts (per user)
export const changeAccountLimiter = new RateLimiterRedis({
	storeClient: valkey,
	keyPrefix: 'rl:settings:account',
	points: 10,
	duration: 60 * 60 // 1 hour
});

// Settings - Change Account success (per user, 1 username change per hour)
export const changeAccountSuccessLimiter = new RateLimiterRedis({
	storeClient: valkey,
	keyPrefix: 'rl:settings:account:success',
	points: 1,
	duration: 60 * 60 // 1 hour
});

import { userRepository } from '../db/repos/user';
import { hashPassword, verifyPassword } from '../auth/password';
import {
	createEmailVerificationToken,
	createPasswordResetToken,
	validateOneTimeToken,
	deleteOneTimeToken,
	getTokenRecord
} from '../auth/tokens';
import { sendEmailVerification, sendPasswordReset } from '../auth/email';
import {
	rateLimiter,
	signupIpLimiter,
	signupEmailLimiter,
	signinIpLimiter,
	signinEmailLimiter,
	forgotPasswordIpLimiter,
	forgotPasswordEmailLimiter,
	resetPasswordIpLimiter,
	verifyOtpLimiter,
	resendOtpLimiter,
	changePasswordLimiter
} from '../ratelimit';
import crypto from 'crypto';

export class AuthRateLimitError extends Error {
	constructor(public errorKey: string, public retryAfterSecs: number) {
		super(errorKey);
		this.name = 'AuthRateLimitError';
	}
}

export class AuthValidationError extends Error {
	constructor(public errorKey: string) {
		super(errorKey);
		this.name = 'AuthValidationError';
	}
}

export class AuthService {
	static async signup(email: string, username: string, passwordPlain: string, ipAddress: string, userAgent: string) {
		const ipLimitCheck = await rateLimiter.safeConsume(signupIpLimiter, ipAddress, 1);
		if (!ipLimitCheck.success) {
			throw new AuthRateLimitError('rateLimit.signup', ipLimitCheck.retryAfterSecs);
		}

		const emailLower = email.toLowerCase().trim();
		const usernameLower = username.toLowerCase().trim();

		const emailLimitCheck = await rateLimiter.safeConsume(signupEmailLimiter, emailLower);
		if (!emailLimitCheck.success) {
			throw new AuthRateLimitError('rateLimit.signup', emailLimitCheck.retryAfterSecs);
		}

		const takenField = await userRepository.checkEmailOrUsernameTaken(emailLower, usernameLower);
		if (takenField) {
			throw new AuthValidationError(`validation.${takenField}.exists`);
		}

		const encryptedPassword = await hashPassword(passwordPlain);
		const id = crypto.randomUUID();

		try {
			await userRepository.createUserWithStatsAndAudit(
				{
					id,
					email: emailLower,
					username: usernameLower,
					encryptedPassword,
					role: 'user',
					emailVerified: false
				},
				ipAddress,
				userAgent
			);
		} catch (err: any) {
			if (err?.code === '23505' || err?.constraint) {
				throw new AuthValidationError('validation.email.exists');
			}
			throw err;
		}

		const token = await createEmailVerificationToken(id);
		await sendEmailVerification(emailLower, usernameLower, token);

		return id;
	}

	static async signin(identifier: string, passwordPlain: string, ipAddress: string, userAgent: string) {
		const ipLimit = await rateLimiter.safeConsume(signinIpLimiter, ipAddress);
		if (!ipLimit.success) {
			throw new AuthRateLimitError('rateLimit.signin', ipLimit.retryAfterSecs);
		}

		const identifierLower = identifier.toLowerCase().trim();
		const emailLimit = await rateLimiter.safeConsume(signinEmailLimiter, identifierLower);
		if (!emailLimit.success) {
			throw new AuthRateLimitError('rateLimit.signin', emailLimit.retryAfterSecs);
		}

		const user = await userRepository.findByEmailOrUsername(identifierLower);

		if (!user) {
			await hashPassword(passwordPlain); // prevent timing attacks
			throw new AuthValidationError('signin.invalidCredentials');
		}

		const isValid = await verifyPassword(passwordPlain, user.encryptedPassword);

		if (!isValid) {
			throw new AuthValidationError('signin.invalidCredentials');
		}

		await rateLimiter.reset(signinEmailLimiter, identifierLower);

		await userRepository.logAudit(user.id, 'signin', ipAddress, userAgent);

		return {
			id: user.id,
			emailVerified: user.emailVerified
		};
	}

	static async requestPasswordReset(email: string, ipAddress: string, siteOrigin: string) {
		const ipLimit = await rateLimiter.safeConsume(forgotPasswordIpLimiter, ipAddress);
		if (!ipLimit.success) {
			throw new AuthRateLimitError('rateLimit.forgotPassword', ipLimit.retryAfterSecs);
		}

		const emailLower = email.toLowerCase().trim();
		const emailLimit = await rateLimiter.safeConsume(forgotPasswordEmailLimiter, emailLower);
		if (!emailLimit.success) {
			throw new AuthRateLimitError('rateLimit.forgotPassword', emailLimit.retryAfterSecs);
		}

		const user = await userRepository.findByEmailOrUsername(emailLower);
		if (!user) {
			return true; // prevent timing attacks
		}

		const token = await createPasswordResetToken(user.id);
		await sendPasswordReset(user.email, user.username || '', token, siteOrigin);

		return true;
	}

	static async resetPassword(token: string, newPasswordPlain: string, ipAddress: string, userAgent: string) {
		const ipLimit = await rateLimiter.safeConsume(resetPasswordIpLimiter, ipAddress);
		if (!ipLimit.success) {
			throw new AuthRateLimitError('rateLimit.resetPassword', ipLimit.retryAfterSecs);
		}

		const tokenRecord = await getTokenRecord(token, 'password_recovery');

		if (!tokenRecord) {
			throw new AuthValidationError('invalid_token');
		}

		const userId = tokenRecord.userId;
		const isValid = await validateOneTimeToken(userId, 'password_recovery', token);

		if (!isValid) {
			throw new AuthValidationError('invalid_token');
		}

		const encryptedPassword = await hashPassword(newPasswordPlain);

		await userRepository.updatePasswordAndInvalidateSessions(userId, encryptedPassword, ipAddress, userAgent, 'password_change');
		await deleteOneTimeToken(userId, 'password_recovery');

		return true;
	}

	static async verifyEmail(userId: string, code: string) {
		const limitCheck = await rateLimiter.safeConsume(verifyOtpLimiter, userId, 0);
		if (!limitCheck.success) {
			await deleteOneTimeToken(userId, 'email_confirmation');
			throw new AuthRateLimitError('rateLimit.verifyEmailLocked', limitCheck.retryAfterSecs);
		}

		const isValid = await validateOneTimeToken(userId, 'email_confirmation', code);

		if (!isValid) {
			const consume = await rateLimiter.safeConsume(verifyOtpLimiter, userId, 1);
			if (!consume.success) {
				await deleteOneTimeToken(userId, 'email_confirmation');
				throw new AuthRateLimitError('rateLimit.verifyEmailLocked', consume.retryAfterSecs);
			}
			throw new AuthValidationError('invalid_code');
		}

		await userRepository.markEmailVerified(userId);
		await deleteOneTimeToken(userId, 'email_confirmation');

		return true;
	}

	static async resendVerificationEmail(userId: string, email: string, username: string) {
		const limit = await rateLimiter.safeConsume(resendOtpLimiter, userId);
		if (!limit.success) {
			throw new AuthRateLimitError('rateLimit.resendEmail', limit.retryAfterSecs);
		}

		const token = await createEmailVerificationToken(userId);
		await sendEmailVerification(email, username, token);

		return true;
	}

	static async changePassword(userId: string, currentPasswordPlain: string, newPasswordPlain: string, ipAddress: string, userAgent: string) {
		const limit = await rateLimiter.safeConsume(changePasswordLimiter, userId);
		if (!limit.success) {
			throw new AuthRateLimitError('rateLimit.changePassword', limit.retryAfterSecs);
		}

		const user = await userRepository.findById(userId);

		if (!user) {
			throw new AuthValidationError('unauthorized');
		}

		const isValid = await verifyPassword(currentPasswordPlain, user.encryptedPassword);

		if (!isValid) {
			throw new AuthValidationError('validation.password.wrongCurrent');
		}

		const encryptedPassword = await hashPassword(newPasswordPlain);

		await userRepository.updatePasswordAndInvalidateSessions(userId, encryptedPassword, ipAddress, userAgent, 'password_change');

		return true;
	}
}

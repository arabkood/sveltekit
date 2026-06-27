import nodemailer from 'nodemailer';
import { privateEnv } from '$secrets';
import { dev } from '$app/environment';
import { getVerificationEmailHtml, getPasswordResetEmailHtml } from './emailTemplates';

export const transporter = nodemailer.createTransport({
	host: privateEnv.SMTP_HOST,
	port: parseInt(privateEnv.SMTP_PORT || '465'),
	secure: privateEnv.SMTP_PORT === '465', 
	auth: {
		user: privateEnv.SMTP_USER,
		pass: privateEnv.SMTP_PASS
	}
});

export async function sendEmailVerification(to: string, username: string, code: string) {
	if (dev) {
		console.log('\n📧 --- DEV MODE EMAIL ---');
		console.log(`To: ${to}`);
		console.log(`Subject: Verify your email address`);
		console.log(`Code: ${code}`);
		console.log('--------------------------\n');
		return;
	}

	if (!privateEnv.SMTP_HOST) {
		console.warn('SMTP not configured, skipping email verification send. Code:', code);
		return;
	}

	const from = `"${privateEnv.SMTP_FROM_NAME}" <${privateEnv.SMTP_FROM_EMAIL}>`;
	const mailOptions = {
		from,
		to,
		subject: 'تأكيد عنوان البريد الإلكتروني',
		html: getVerificationEmailHtml(username, code)
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error('Error sending verification email', error);
	}
}

export async function sendPasswordReset(to: string, username: string, code: string, baseUrl: string) {
	if (dev) {
		console.log('\n📧 --- DEV MODE EMAIL ---');
		console.log(`To: ${to}`);
		console.log(`Subject: Reset your password`);
		console.log(`Code: ${code}`);
		console.log(`Link: ${baseUrl}/reset-password/${code}`);
		console.log('--------------------------\n');
		return;
	}

	if (!privateEnv.SMTP_HOST) {
		console.warn('SMTP not configured, skipping password reset send. Code:', code);
		return;
	}

	const from = `"${privateEnv.SMTP_FROM_NAME}" <${privateEnv.SMTP_FROM_EMAIL}>`;
	const mailOptions = {
		from,
		to,
		subject: 'إعادة تعيين كلمة المرور',
		html: getPasswordResetEmailHtml(username, code, baseUrl)
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error('Error sending password reset email', error);
	}
}

import nodemailer from 'nodemailer';
import { privateEnv } from '$secrets';
import { dev } from '$app/environment';

export const transporter = nodemailer.createTransport({
	host: privateEnv.SMTP_HOST,
	port: parseInt(privateEnv.SMTP_PORT || '465'),
	secure: privateEnv.SMTP_PORT === '465', 
	auth: {
		user: privateEnv.SMTP_USER,
		pass: privateEnv.SMTP_PASS
	}
});

export async function sendEmailVerification(to: string, code: string) {
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
		subject: 'Verify your email address',
		html: `<p>Your email verification code is: <strong>${code}</strong></p>`
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error('Error sending verification email', error);
	}
}

export async function sendPasswordReset(to: string, code: string) {
	if (dev) {
		console.log('\n📧 --- DEV MODE EMAIL ---');
		console.log(`To: ${to}`);
		console.log(`Subject: Reset your password`);
		console.log(`Code: ${code}`);
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
		subject: 'Reset your password',
		html: `<p>Your password reset code is: <strong>${code}</strong></p>`
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error('Error sending password reset email', error);
	}
}

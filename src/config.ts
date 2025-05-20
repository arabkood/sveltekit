import {
	PUBLIC_AWS_REGION,
	PUBLIC_AWS_S3_PUBLIC_BUCKET_NAME,
	PUBLIC_APP_ENV
} from '$env/static/public';

export const APP_ENV = PUBLIC_APP_ENV || 'dev';
export const isLocal = APP_ENV === 'local';

export const AWS_REGION = PUBLIC_AWS_REGION!;

export const S3_PUBLIC_BUCKET_NAME = PUBLIC_AWS_S3_PUBLIC_BUCKET_NAME!;

export const auth = {
	authStateCookieName: 'arabkood_auth_state',
	sessionCookieName: 'arabkood_session_token'
};

// Ensure required environment variables are set
if (!AWS_REGION || !S3_PUBLIC_BUCKET_NAME) {
	throw new Error(
		'Missing PUBLIC_AWS_REGION or PUBLIC_S3_PUBLIC_BUCKET_NAME in environment variables. These should be set by your CDK infrastructure.'
	);
}

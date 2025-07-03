import { env } from '$env/dynamic/public';
import { PUBLIC_APP_ENV } from '$env/static/public';

export const APP_ENV = PUBLIC_APP_ENV || 'dev';
export const isLocal = APP_ENV === 'local';

export const S3_PUBLIC_BUCKET_NAME = env.PUBLIC_AWS_S3_PUBLIC_BUCKET_NAME!;

export const ARABKOOD_API_BASE_URL =
	env.PUBLIC_ARABKOOD_API_BASE_URL || 'https://alpha.akood.com/api/v1';

export const auth = {
	authStateCookieName: 'arabkood_auth_state',
	sessionCookieName: 'arabkood_session_token'
};

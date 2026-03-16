import { z } from 'zod';
import { env } from '$env/dynamic/public';

const schema = z.object({
	PUBLIC_APP_ENV: z.enum(['local', 'dev', 'staging', 'production']).default('dev'),

	PUBLIC_S3_PATH: z.string().default('https://akood.com/s3'),
	PUBLIC_SESSION_COOKIE_NAME: z.string().optional().default('akood_session_token'),
	PUBLIC_API_PATH: z.url().default('https://akood.com/api/v1'),

	PUBLIC_SITE_NAME_EN: z.string().optional().default('Akood'),
	PUBLIC_SITE_NAME_AR: z.string().optional().default('أكود'),
	PUBLIC_SITE_NAME_FULL: z.string().optional().default('أكود - Akood'),
	PUBLIC_SITE: z.string().optional().default('https://akood.com')
});

const parsed = schema.safeParse(env);
if (!parsed.success) {
	console.error('❌ Invalid public environment variables:');
	console.error(z.treeifyError(parsed.error).errors);
	throw new Error('Invalid environment configuration');
}

export const publicEnv = parsed.data;

// App env
export const APP_ENV = publicEnv.PUBLIC_APP_ENV;

// Site Metadata
export const SITE_NAME_EN = publicEnv.PUBLIC_SITE_NAME_EN;
export const SITE_NAME_AR = publicEnv.PUBLIC_SITE_NAME_AR;
export const SITE_NAME_FULL = publicEnv.PUBLIC_SITE_NAME_FULL;
export const SITE = publicEnv.PUBLIC_SITE;

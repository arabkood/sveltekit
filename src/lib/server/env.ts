import { z } from 'zod';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

const schema = z.object({
	DATABASE_URL: z.url(),
	STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
	STRIPE_WEBHOOK_SECRET: z.string(),
	S3_ENDPOINT: z.string().min(1),
	S3_REGION: z.string().min(1),
	S3_ACCESS_KEY_ID: z.string().min(1),
	S3_SECRET_ACCESS_KEY: z.string().min(1),
	S3_PV_BUCKET_NAME: z.string().min(1),
	S3_BLOG_BUCKET_NAME: z.string().min(1)
});

const skipValidation = building || process.env.SKIP_ENV_VALIDATION === 'true';

const e = skipValidation
	? (env as unknown as z.infer<typeof schema>)
	: (() => {
			const parsed = schema.safeParse(env);

			if (!parsed.success) {
				console.error('❌ Invalid private environment variables:');
				console.error(parsed.error);
				throw new Error('Invalid environment configuration');
			}

			return parsed.data;
		})();

export const privateEnv = e;

export const s3 = {
	Endpoint: e.S3_ENDPOINT,
	Region: e.S3_REGION,
	AccessKeyId: e.S3_ACCESS_KEY_ID,
	SecretAccessKey: e.S3_SECRET_ACCESS_KEY,
	PvBucketName: e.S3_PV_BUCKET_NAME,
	BlogBucketName: e.S3_BLOG_BUCKET_NAME
};

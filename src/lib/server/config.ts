import { env as penv } from '$env/dynamic/private';

// if (
// 	!penv.S3_ENDPOINT ||
// 	!penv.S3_REGION ||
// 	!penv.S3_ACCESS_KEY_ID ||
// 	!penv.S3_SECRET_ACCESS_KEY ||
// 	!penv.S3_PV_BUCKET_NAME
// ) {
// 	throw new Error('Missing S3 credentials env');
// }

export const s3 = {
	Endpoint: penv.S3_ENDPOINT!,
	Region: penv.S3_REGION!,
	AccessKeyId: penv.S3_ACCESS_KEY_ID!,
	SecretAccessKey: penv.S3_SECRET_ACCESS_KEY!,
	PvBucketName: penv.S3_PV_BUCKET_NAME!
};

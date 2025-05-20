import { isLocal, S3_PUBLIC_BUCKET_NAME } from '$config';

export function toPublicUrl(path: string, bucket?: string): string {
	if (!bucket) {
		bucket = S3_PUBLIC_BUCKET_NAME;
	}
	if (!path.startsWith('public://')) {
		return path;
	}
	const key = path.replace('public://', '');

	if (isLocal) {
		return `http://localhost:4566/${bucket}/${key}`;
	} else {
		return `https://${bucket}.s3.amazonaws.com/${key}`;
	}
}

export function replacePublicUrls(text: string, bucket?: string): string {
	if (!bucket) {
		bucket = S3_PUBLIC_BUCKET_NAME;
	}
	return text.replace(/public:\/\/([\w./-]+)/g, (_, key) => {
		if (isLocal) {
			return `http://localhost:4566/${bucket}/${key}`;
		} else {
			return `https://${bucket}.s3.amazonaws.com/${key}`;
		}
	});
}

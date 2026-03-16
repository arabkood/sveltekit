import { publicEnv } from '$config';

export function toPublicUrl(path: string): string {
	if (!path.startsWith('public://')) {
		return path;
	}
	const key = path.replace('public://', '');

	return `${publicEnv.PUBLIC_S3_PATH}/${key}`;
}

export function replacePublicUrls(text: string): string {
	return text.replace(/public:\/\/([\w./-]+)/g, (_, key) => {
		return `${publicEnv.PUBLIC_S3_PATH}/${key}`;
	});
}

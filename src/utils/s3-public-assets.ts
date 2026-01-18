import { isLocal } from '$config';

export function toPublicUrl(path: string): string {
	if (!path.startsWith('public://')) {
		return path;
	}
	const key = path.replace('public://', '');

	if (isLocal) {
		return `https://dev.arabkood.com/s3/${key}`;
	} else {
		return `https://akood.com/s3/${key}`;
	}
}

export function replacePublicUrls(text: string): string {
	return text.replace(/public:\/\/([\w./-]+)/g, (_, key) => {
		if (isLocal) {
			return `https://dev.arabkood.com/s3/${key}`;
		} else {
			return `https://akood.com/s3/${key}`;
		}
	});
}

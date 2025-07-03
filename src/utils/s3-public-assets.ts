export function toPublicUrl(path: string): string {
	if (!path.startsWith('public://')) {
		return path;
	}
	const key = path.replace('public://', '');

	return `https://dev.akood.com/s3/${key}`;
}

export function replacePublicUrls(text: string): string {
	return text.replace(/public:\/\/([\w./-]+)/g, (_, key) => {
		return `https://dev.akood.com/s3/${key}`;
	});
}

import { getS3TopicObjectAsBuffer } from '$lib/server/s3';
import type { Lesson, LessonInteractive, LessonMarkdown, LessonStep } from '$types/lesson';
import type { PageServerLoad } from './$types';
import path from 'node:path';
import yaml from 'js-yaml';
import AdmZip from 'adm-zip';
import { error } from '@sveltejs/kit';

function unzip(buff: Buffer): Record<string, string> {
	const zip = new AdmZip(buff);
	const zipEntries = zip.getEntries();

	const result: Record<string, string> = {};

	for (const entry of zipEntries) {
		if (!entry.isDirectory) {
			const content = entry.getData().toString('utf8');
			result[entry.entryName] = content;
		}
	}

	return result;
}

export const load: PageServerLoad = async ({ params, parent, locals }) => {
	const { item } = await parent();

	let steps: LessonStep[] = [];
	if (item.s3_path) {
		const buffs = await Promise.all([
			getS3TopicObjectAsBuffer(path.join(item.s3_path, 'lesson.bundle.zip'))
		]);

		if (buffs[0]) {
			try {
				steps = Object.entries(unzip(buffs[0]))
					.sort((a, b) => {
						const aa = parseInt(a[0].split('_')[0], 10);
						const bb = parseInt(b[0].split('_')[0], 10);
						return aa - bb;
					})
					.map((a) => {
						if (a[0].endsWith('.md')) {
							return a[1] as LessonMarkdown;
						}
						if (a[0].endsWith('.yml') || a[0].endsWith('.yaml')) {
							return yaml.load(a[1]) as LessonInteractive;
						}
						return undefined;
					})
					.filter((x): x is LessonMarkdown | LessonInteractive => x !== undefined);
			} catch (e) {
				console.error('bad lesson.bundle.zip at', item.s3_path, e);
				error(404, 'Not found');
			}
		}
	}

	return {
		lesson: {
			steps
		} as Lesson
	};
};

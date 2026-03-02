import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getS3TopicObjectAsBuffer } from '$lib/server/s3';
import path from 'node:path';

import AdmZip from 'adm-zip';
import type { Code, CodeConfig, CodeDocs, CodeFiles } from '$types/code';

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

export const load: PageServerLoad = async ({ parent }) => {
	const { item, track } = await parent();

	if (item.type !== 'code') {
		redirect(308, `/courses/${track.slug}/${item.slug}/${item.type}`);
	}

	let files: CodeFiles = {};
	let docs: CodeDocs = {};
	let cconfig: CodeConfig | null = null;
	if (item.s3Path) {
		const buffs = await Promise.all([
			getS3TopicObjectAsBuffer(path.join(item.s3Path, 'files.bundle.zip')),
			getS3TopicObjectAsBuffer(path.join(item.s3Path, 'docs.bundle.zip'))
		]);

		if (buffs[0]) {
			try {
				files = unzip(buffs[0]);
				if (!Object.hasOwn(files, '.meta/config.json')) {
					console.error('.meta/config.json not found at', item.s3Path);
					error(404, 'Not found');
				}
				try {
					cconfig = JSON.parse(files['.meta/config.json']);
				} catch {
					console.error('.meta/config.json invalid at', item.s3Path, files['.meta/config.json']);
					error(404, 'Not found');
				}
			} catch (e) {
				console.error('bad files.bundle.zip at', item.s3Path, e);
				error(404, 'Not found');
			}
		}
		if (buffs[1]) {
			try {
				docs = unzip(buffs[1]);
			} catch (e) {
				console.error('bad docs.bundle.zip at', item.s3Path, e);
				error(404, 'Not found');
			}
		}
	}

	return {
		code: {
			files,
			docs,
			config: cconfig!
		} as Code
	};
};

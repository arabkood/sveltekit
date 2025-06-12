import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getS3TopicObjectAsBuffer, getS3TopicObjectAsString } from '$lib/server/s3';
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
	if (item.s3_path) {
		const buffs = await Promise.all([
			getS3TopicObjectAsBuffer(path.join(item.s3_path, 'files.bundle.zip')),
			getS3TopicObjectAsBuffer(path.join(item.s3_path, 'docs.bundle.zip')),
			getS3TopicObjectAsString(path.join(item.s3_path, 'config.json'))
		]);

		if (buffs[0]) {
			try {
				files = unzip(buffs[0]);
			} catch (e) {
				console.error('bad files.bundle.zip at', item.s3_path, e);
				error(404, 'Not found');
			}
		}
		if (buffs[1]) {
			try {
				docs = unzip(buffs[1]);
			} catch (e) {
				console.error('bad docs.bundle.zip at', item.s3_path, e);
				error(404, 'Not found');
			}
		}
		if (buffs[2]) {
			try {
				cconfig = JSON.parse(buffs[2]);
			} catch (e) {
				console.error('bad config.json at', item.s3_path, e);
				error(404, 'Not found');
			}
		} else {
			// the config is required
			error(404, 'Not found');
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

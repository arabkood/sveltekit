import { classRepository, type Item, type Module } from '../db/repos/class';
import { getS3TopicObjectAsBuffer } from '../s3';
import { cacheGet, cacheSet } from '../cache';
import path from 'node:path';
import AdmZip from 'adm-zip';
import type { Code, CodeConfig, CodeDocs, CodeFiles } from '$types/code';

export class CourseNotFoundError extends Error {
	constructor(message: string = 'عفواً، لم نتمكن من العثور على ما تبحث عنه.') {
		super(message);
		this.name = 'CourseNotFoundError';
	}
}

export class CourseRedirectError extends Error {
	constructor(public statusCode: 301 | 302 | 308, public destination: string) {
		super(`Redirect to ${destination}`);
		this.name = 'CourseRedirectError';
	}
}

export class PremiumRestrictionError extends Error {
	constructor() {
		super('Premium required');
		this.name = 'PremiumRestrictionError';
	}
}

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

export class CourseService {
	static async getTrackWithModules(originalSlug: string, pathname: string, userId?: string) {
		let normalizedSlug = originalSlug;

		// Handle legacy slug format that caused SEO issues
		if (originalSlug.includes('@')) {
			const slugParts = originalSlug.split('@');
			if (slugParts.length >= 2) {
				const trackPart = slugParts.shift();
				const topicPart = slugParts.join('-');
				normalizedSlug = `${topicPart}-${trackPart}`;
			} else {
				normalizedSlug = originalSlug.replace(/@/g, '-');
			}

			// Force permanent redirect to the normalized slug
			const newUrl = pathname.replace(originalSlug, normalizedSlug);
			throw new CourseRedirectError(301, newUrl);
		}

		const trackWithModules = await classRepository.getTrackBySlug(normalizedSlug, userId);

		if (!trackWithModules?.track) {
			throw new CourseNotFoundError();
		}

		return {
			track: trackWithModules.track,
			modules: trackWithModules.modules
		};
	}

	static async resolveItemAccess(
		modules: (Module & { items: Item[] })[],
		itemSlug: string,
		track: { slug: string, premiumOnly?: boolean | null },
		currentPathname: string,
		userId?: string,
		isPro?: boolean
	) {
		let module: (Module & { items: Item[] }) | null = null;
		let item: Item | null = null;
		let prevItemIdx: number | null = null;
		let nextItemIdx: number | null = null;

		for (const mod of modules) {
			for (const [i, it] of mod.items.entries()) {
				if (it.slug === itemSlug) {
					item = it;
					module = mod;
					if (i >= 1) {
						prevItemIdx = i - 1;
					}
					if (i < mod.items.length - 1) {
						nextItemIdx = i + 1;
					}
					break;
				}
			}
			if (item) break;
		}

		if (!module || !item) {
			throw new CourseNotFoundError();
		}

		const lastPart = currentPathname.split('/').filter(Boolean).pop();
		if (lastPart !== item.type) {
			throw new CourseRedirectError(308, `/courses/${track.slug}/${item.slug}/${item.type}`);
		}

		const submission = userId
			? await classRepository.getUserSubmissionByItem(userId, item.id)
			: null;

		if ((track.premiumOnly || module.premiumOnly || item.premiumOnly) && !isPro && !submission) {
			throw new PremiumRestrictionError();
		}

		return {
			item,
			module,
			submission,
			prevItemIdx,
			nextItemIdx
		};
	}

	static async getCodeAssets(itemS3Path: string | null): Promise<Code> {
		if (!itemS3Path) {
			return {
				files: {},
				docs: {},
				config: null as any
			};
		}

		const cached = await cacheGet<Code>(`course:assets:${itemS3Path}`);
		if (cached) return cached;

		let files: CodeFiles = {};
		let docs: CodeDocs = {};
		let cconfig: CodeConfig | null = null;

		const buffs = await Promise.all([
			getS3TopicObjectAsBuffer(path.join(itemS3Path, 'files.bundle.zip')),
			getS3TopicObjectAsBuffer(path.join(itemS3Path, 'docs.bundle.zip'))
		]);

		if (buffs[0]) {
			try {
				files = unzip(buffs[0]);
				if (!Object.hasOwn(files, '.meta/config.json')) {
					console.error('.meta/config.json not found at', itemS3Path);
					throw new CourseNotFoundError();
				}
				try {
					cconfig = JSON.parse(files['.meta/config.json']);
				} catch {
					console.error('.meta/config.json invalid at', itemS3Path, files['.meta/config.json']);
					throw new CourseNotFoundError();
				}
			} catch (e: any) {
				if (e instanceof CourseNotFoundError) throw e;
				console.error('bad files.bundle.zip at', itemS3Path, e);
				throw new CourseNotFoundError();
			}
		} else {
			console.error('files.bundle.zip missing from S3 at', itemS3Path);
			throw new CourseNotFoundError();
		}
		if (buffs[1]) {
			try {
				docs = unzip(buffs[1]);
			} catch (e) {
				console.error('bad docs.bundle.zip at', itemS3Path, e);
				throw new CourseNotFoundError();
			}
		}

		const result = {
			files,
			docs,
			config: cconfig!
		};

		await cacheSet(`course:assets:${itemS3Path}`, result, 24 * 60 * 60); // Cache for 24 hours
		return result;
	}
}

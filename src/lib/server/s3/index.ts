import { S3Client, GetObjectCommand, type GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import { s3 } from '../config';
import path from 'node:path';

console.log('Initializing S3Client.');

function ensureUrlHasScheme(url: string) {
	if (!/^https?:\/\//i.test(url)) {
		return 'https://' + url;
	}
	return url;
}

const s3Opts = {
	endpoint: s3.Endpoint ? ensureUrlHasScheme(s3.Endpoint) : undefined,
	region: s3.Region,
	credentials: {
		accessKeyId: s3.AccessKeyId,
		secretAccessKey: s3.SecretAccessKey
	},
	forcePathStyle: true
};
const s3Client = new S3Client(s3Opts);

/**
 * Helper function to convert a Node.js Readable stream to a string.
 * @param stream The Readable stream from S3.
 * @returns A promise that resolves with the string content.
 */
async function streamToString(stream: Readable): Promise<string> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
		stream.on('error', reject);
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
	});
}

/**
 * Helper function to convert a Node.js Readable stream to a Buffer.
 * @param stream The Readable stream from S3.
 * @returns A promise that resolves with the Buffer content.
 */
async function streamToBuffer(stream: Readable): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
		stream.on('error', reject);
		stream.on('end', () => resolve(Buffer.concat(chunks)));
	});
}

/**
 * Reads an object from Object Storage and returns its content as a string.
 * @param bucketName The name of the bucket
 * @param key The key of the object in the bucket.
 * @returns The object content as a string, or null if not found or an error occurs.
 */
export async function getS3ObjectAsString(bucketName: string, key: string): Promise<string | null> {
	const command = new GetObjectCommand({
		Bucket: bucketName,
		Key: key
	});

	try {
		const output: GetObjectCommandOutput = await s3Client.send(command);
		if (output.Body instanceof Readable) {
			return await streamToString(output.Body);
		} else {
			console.error('GetObjectCommand did not return a readable stream for key:', key);
			return null;
		}
	} catch (error: any) {
		if (error.name === 'NoSuchKey') {
			console.warn(`Object not found for key: ${key}`);
			return null;
		}
		console.error('Error getting object from Object Storage:', error);
		return null;
	}
}

/**
 * Reads an object from Object Storage and returns its content as a Buffer.
 * Useful for binary files like images, PDFs, etc.
 * @param bucketName The name of the bucket
 * @param key The key of the object in the bucket.
 * @returns The object content as a Buffer, or null if not found or an error occurs.
 */
export async function getS3ObjectAsBuffer(bucketName: string, key: string): Promise<Buffer | null> {
	const command = new GetObjectCommand({
		Bucket: bucketName,
		Key: key
	});

	try {
		const output: GetObjectCommandOutput = await s3Client.send(command);
		if (output.Body instanceof Readable) {
			return await streamToBuffer(output.Body);
		} else {
			console.error('GetObjectCommand did not return a readable stream for key:', key);
			return null;
		}
	} catch (error: any) {
		if (error.name === 'NoSuchKey') {
			console.warn(`Object not found for key: ${key}`);
			return null;
		}
		console.error('Error getting object from Object Storage:', error);
		return null;
	}
}

export interface S3StreamResult {
	stream: Readable;
	contentType?: string;
	contentLength?: number;
	eTag?: string;
}

/**
 * For very large files, you might want to stream the response directly
 * if you're building an API endpoint.
 * @param bucketName The name of the bucket
 * @param key The key of the object in the bucket.
 * @returns An object containing the readable stream and content type, or null.
 */
export async function getS3ObjectStream(
	bucketName: string,
	key: string
): Promise<S3StreamResult | null> {
	const command = new GetObjectCommand({
		Bucket: bucketName,
		Key: key
	});

	try {
		const { Body, ContentType, ContentLength, ETag }: GetObjectCommandOutput =
			await s3Client.send(command);
		if (Body instanceof Readable) {
			return { stream: Body, contentType: ContentType, contentLength: ContentLength, eTag: ETag };
		}
		console.error('GetObjectCommand did not return a readable stream for key:', key);
		return null;
	} catch (error: any) {
		if (error.name === 'NoSuchKey') {
			console.warn(`Object not found for key: ${key}`);
			return null;
		}
		console.error('Error getting object stream from Object Storage:', error);
		return null;
	}
}

// ----------- BLOG

// Helper functions using the topics bucket
export const getS3TopicObjectStream = (key: string) =>
	getS3ObjectStream(s3.PvBucketName, path.normalize(path.join('topics', key)));
export const getS3TopicObjectAsString = (key: string) =>
	getS3ObjectAsString(s3.PvBucketName, path.normalize(path.join('topics', key)));
export const getS3TopicObjectAsBuffer = (key: string) =>
	getS3ObjectAsBuffer(s3.PvBucketName, path.normalize(path.join('topics', key)));

// Helper functions using the blog bucket
export const getS3PostObjectAsString = (key: string) =>
	getS3ObjectAsString(s3.BlogBucketName, path.normalize(path.join('public/blog/posts', key)));

export const getS3PostObjectAsBuffer = (key: string) =>
	getS3ObjectAsBuffer(s3.BlogBucketName, path.normalize(path.join('public/blog/posts', key)));

export const getS3PostObjectStream = (key: string) =>
	getS3ObjectStream(s3.BlogBucketName, path.normalize(path.join('public/blog/posts', key)));

/**
 * Fetch a specific blog post (metadata + markdown content)
 * @param slug The post slug (e.g., "first-post")
 * @returns Post object with metadata and content, or null if not found
 */
export async function getBlogPost(slug: string) {
	try {
		const metadataJson = await getS3PostObjectAsString(`${slug}/metadata.json`);
		const markdown = await getS3PostObjectAsString(`${slug}/index.md`);

		if (!metadataJson || !markdown) {
			return null;
		}

		const metadata = JSON.parse(metadataJson);

		return {
			...metadata,
			content: markdown,
			slug
		};
	} catch (error) {
		console.error(`Error fetching blog post ${slug}:`, error);
		return null;
	}
}

/**
 * List all published blog posts (metadata only, for fast queries)
 * @returns Array of published posts sorted by date (newest first)
 */
export async function listBlogPosts() {
	const command = new ListObjectsV2Command({
		Bucket: s3.BlogBucketName,
		Prefix: 'public/blog/posts/',
		Delimiter: '/'
	});

	try {
		const response = await s3Client.send(command);

		const posts = [];

		// Iterate through each post folder
		for (const prefix of response.CommonPrefixes || []) {
			const slug = prefix.Prefix?.split('/')[3];
			const metadataJson = await getS3PostObjectAsString(`${slug}/metadata.json`);

			if (!metadataJson) continue;

			const metadata = JSON.parse(metadataJson);
			posts.push({
				...metadata,
				slug
			});
		}

		// Filter published posts and sort by date (newest first)
		return posts
			.filter((post) => post.published === true)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	} catch (error) {
		console.error('Error listing blog posts:', error);
		return [];
	}
}

/**
 * Get blog post OG image as buffer (for serving or manipulation)
 * @param slug The post slug
 * @returns Buffer containing the image, or null if not found
 */
export async function getBlogPostOgImage(slug: string) {
	return getS3PostObjectAsBuffer(`${slug}/og-image.jpg`);
}

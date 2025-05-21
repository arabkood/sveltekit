import { S3Client, GetObjectCommand, type GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import { AWS_REGION, isLocal } from '$config';
import {
	AWS_S3_TOPICS_BUCKET_NAME,
	AWS_SECRET_ACCESS_KEY_LOCAL,
	AWS_ACCESS_KEY_ID_LOCAL
} from '$env/dynamic/private';

if (!AWS_S3_TOPICS_BUCKET_NAME) {
	throw new Error(
		'Missing AWS_S3_TOPICS_BUCKET_NAME in environment variables. These should be set by your CDK infrastructure.'
	);
}

let localAccessKeyId: string | undefined;
let localSecretAccessKey: string | undefined;

if (isLocal) {
	localAccessKeyId = AWS_ACCESS_KEY_ID_LOCAL;
	localSecretAccessKey = AWS_SECRET_ACCESS_KEY_LOCAL;
}

let s3Client: S3Client;

if (isLocal && localAccessKeyId && localSecretAccessKey) {
	console.log('Initializing S3Client with local development credentials.');
	s3Client = new S3Client({
		endpoint: 'http://172.17.0.1:4566',
		region: AWS_REGION,
		credentials: {
			accessKeyId: localAccessKeyId,
			secretAccessKey: localSecretAccessKey
		}
	});
} else {
	console.log('Initializing S3Client for production (expecting IAM role credentials).');
	// The SDK will automatically use credentials from the IAM Role
	s3Client = new S3Client({ region: AWS_REGION });
}

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
 * Reads an object from S3 and returns its content as a string.
 * @param key The key of the object in S3.
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
			console.error('S3 GetObjectCommand did not return a readable stream for key:', key);
			return null; // Or throw an error
		}
	} catch (error: any) {
		if (error.name === 'NoSuchKey') {
			console.warn(`S3 object not found for key: ${key}`);
			return null;
		}
		console.error('Error getting object from S3:', error);
		return null;
	}
}

/**
 * Reads an object from S3 and returns its content as a Buffer.
 * Useful for binary files like images, PDFs, etc.
 * @param key The key of the object in S3.
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
			console.error('S3 GetObjectCommand did not return a readable stream for key:', key);
			return null;
		}
	} catch (error: any) {
		if (error.name === 'NoSuchKey') {
			console.warn(`S3 object not found for key: ${key}`);
			return null;
		}
		console.error('Error getting object from S3:', error);
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
 * @param key The key of the object in S3.
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
		console.error('S3 GetObjectCommand did not return a readable stream for key:', key);
		return null;
	} catch (error: any) {
		if (error.name === 'NoSuchKey') {
			console.warn(`S3 object not found for key: ${key}`);
			return null;
		}
		console.error('Error getting object stream from S3:', error);
		return null;
	}
}

export const getS3TopicObjectStream = (key: string) =>
	getS3ObjectStream(AWS_S3_TOPICS_BUCKET_NAME, key);
export const getS3TopicObjectAsString = (key: string) =>
	getS3ObjectAsString(AWS_S3_TOPICS_BUCKET_NAME, key);
export const getS3TopicObjectAsBuffer = (key: string) =>
	getS3ObjectAsBuffer(AWS_S3_TOPICS_BUCKET_NAME, key);

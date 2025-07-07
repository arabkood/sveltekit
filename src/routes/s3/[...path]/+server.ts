import { getS3ObjectAsBuffer } from '$lib/server/s3';
import { error, type RequestHandler } from '@sveltejs/kit';
import path from 'node:path';
import mime from 'mime-types';
import { s3 } from '$lib/server/config';

//

export const GET: RequestHandler = async ({ params }) => {
	const userPath = params['path'];

	// 1. Validate input
	if (!userPath) {
		throw error(404, 'Not Found');
	}

	// 2. Safely construct and normalize the path
	const s3Key = path.normalize(path.join('public', userPath));

	// 3. SECURITY CHECK: Ensure the resolved path is still inside the public directory
	if (!s3Key.startsWith('public/')) {
		console.warn(`Potential path traversal attempt: ${userPath}`);
		throw error(403, 'Forbidden');
	}

	try {
		const fileBuffer = await getS3ObjectAsBuffer(s3.PvBucketName, s3Key);

		if (!fileBuffer) {
			throw error(404, 'Not Found');
		}

		// 4. Determine the correct Content-Type from the file extension
		const contentType = mime.lookup(s3Key) || 'application/octet-stream';

		//
		// Return a proper Response object with headers
		return new Response(fileBuffer, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=3600',
				'Content-Length': fileBuffer.length.toString(),
				'Access-Control-Allow-Origin': '*', // or your specific domain
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type'
			}
		});
	} catch (err: any) {
		if (err.name === 'NoSuchKey' || err.status === 404) {
			throw error(404, 'Not Found');
		}

		// For all other unexpected errors, return a 500
		console.error('S3 Error:', err);
		throw error(500, 'Internal Server Error');
	}
};

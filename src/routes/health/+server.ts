import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
	// Basic check: If this code runs, the server is up and responding.
	const healthStatus = {
		status: 'ok',
		timestamp: new Date().toISOString()
	};

	return json(healthStatus, {
		status: 200
	});
};

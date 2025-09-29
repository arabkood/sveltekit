import { APP_ENV, SITE } from '$config';
import type { RequestHandler } from './$types';

function generateRobots() {
	if (APP_ENV !== 'production') {
		// Block everything
		return `User-agent: *
Disallow: /`;
	}

	// Production robots.txt
	return `User-agent: *
Disallow: /settings/
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml`;
}

export const GET: RequestHandler = () => {
	return new Response(generateRobots(), {
		headers: {
			'Content-Type': 'text/plain'
		}
	});
};

import { SITE } from '$config';
import type { RequestHandler } from './$types';

const STATIC_PAGES = ['', 'courses', 'pages/glossary', 'signup', 'signin', 'blog/what-is-akood'];
const DYNAMIC_COURSES = [
	'courses/python-beginner',
	'courses/python-practice',
	'courses/web-internet'
];

function generateSitemap() {
	const today = new Date().toISOString().split('T')[0];
	const base = SITE.replace(/\/+$/, ''); // remove trailing slashes

	const urls = [...STATIC_PAGES, ...DYNAMIC_COURSES]
		.map((path) => {
			let priority = 0.7;
			if (path === '') priority = 1.0;
			else if (path.startsWith('blog/')) priority = 0.8;
			else if (path.startsWith('courses/')) priority = 0.8;

			// Build clean, encoded URL
			const url = encodeURI(`${base}/${path}`);

			return `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export const GET: RequestHandler = () => {
	return new Response(generateSitemap(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600' // cache for 1 hour
		}
	});
};

import { SITE } from '$config';
import type { RequestHandler } from './$types';

// list your static pages here
const STATIC_PAGES = ['', 'courses', 'pages/glossary', 'signup', 'signin'];

const DYNAMIC_COURSES = ['courses/beginner@python', 'courses/internet@web'];

function generateSitemap() {
	const urls = [...STATIC_PAGES, ...DYNAMIC_COURSES]
		.map(
			(path) => `
  <url>
    <loc>${SITE}/${path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${path === '' ? 1.0 : 0.8}</priority>
  </url>`
		)
		.join('');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export const GET: RequestHandler = () => {
	return new Response(generateSitemap(), {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};

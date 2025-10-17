import { SITE } from '$config';
import type { RequestHandler } from './$types';

// list your static pages here
const STATIC_PAGES = ['', 'courses', 'pages/glossary', 'signup', 'signin', 'blog/what-is-akood'];
const DYNAMIC_COURSES = ['courses/beginner@python', 'courses/internet@web'];

function generateSitemap() {
	const urls = [...STATIC_PAGES, ...DYNAMIC_COURSES]
		.map((path) => {
			// Higher priority for homepage, blog posts get 0.8, courses get 0.8, other pages get 0.7
			let priority = 0.7;
			if (path === '') priority = 1.0;
			if (path.startsWith('blog/')) priority = 0.8;
			if (path.startsWith('courses/')) priority = 0.8;

			return `
  <url>
    <loc>${SITE}/${path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${priority}</priority>
  </url>`;
		})
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

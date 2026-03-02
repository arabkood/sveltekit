import { SITE } from '$config';
import { listBlogPosts } from '$lib/server/s3';

export async function GET() {
	const posts = await listBlogPosts();
	const baseUrl = SITE;

	const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
		<title>مدونة أكود | تعلم البرمجة بالعربية من خلال الممارسة</title>
		<link>${baseUrl}/blog</link>
		<description>مدونة أكود تقدم مقالات مميزة حول تعلم البرمجة باللغة العربية، الممارسة العملية، ونصائح للمطورين العرب لبناء مهاراتهم التقنية بخطوات عملية وواضحة.</description>
    <language>ar-sa</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts
			.slice(0, 20)
			.map(
				(post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <author>${escapeXml(post.author)}</author>
      ${post.tags?.map((tag: string) => `<category>${escapeXml(tag)}</category>`).join('')}
    </item>
    `
			)
			.join('')}
  </channel>
</rss>`;

	return new Response(feed, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

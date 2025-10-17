import { getBlogPost, listBlogPosts } from '$lib/server/s3/index.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const post = await getBlogPost(params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	// Get all posts for navigation
	const allPosts = await listBlogPosts();
	const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);

	const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
	const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

	return { post, previousPost, nextPost };
}

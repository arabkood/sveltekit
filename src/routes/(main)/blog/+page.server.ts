import { listBlogPosts } from "$lib/server/s3";

export async function load() {
	const posts = await listBlogPosts();
	return { posts };
}

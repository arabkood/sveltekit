import { json } from '@sveltejs/kit';

export function POST({ cookies }) {
	// 1. Get all cookies from the incoming request.
	const allCookies = cookies.getAll();

	// 2. Iterate over the cookies and delete each one.
	for (const cookie of allCookies) {
		const cookieName = cookie.name;

		cookies.delete(cookieName, { path: '/' });
	}

	// 3. Respond with a success message.
	return json({ success: true, message: 'Signed out successfully' });
}

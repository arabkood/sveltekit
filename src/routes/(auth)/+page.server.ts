import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (locals.user?.id) {
		redirect(301, '/dashboard');
	} 
}

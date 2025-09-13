import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
  if (!url.searchParams.get('checkout_id')) {
    throw redirect(308, '/');
  }
}

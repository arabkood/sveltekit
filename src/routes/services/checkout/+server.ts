import { env } from '$env/dynamic/private';

import { Checkout } from "@polar-sh/sveltekit";
import { redirect } from '@sveltejs/kit';
import { APP_ENV } from '$config';


export const GET = (e) => {
  if (!e.locals.user) {
    redirect(307, "/")
  }
  return Checkout({
    accessToken: env.POLAR_ACCESS_TOKEN,
    successUrl: env.POLAR_SUCCESS_URL,
    // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
    server: APP_ENV === "production" ? "production" : "sandbox",
  })(e);
}

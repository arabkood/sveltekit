import { env } from '$env/dynamic/private';

import { Checkout } from "@polar-sh/sveltekit";
import { redirect } from '@sveltejs/kit';

export const GET = (e) => {
  if (!e.locals.user) {
    redirect(307, "/")
  }
  return Checkout({
    accessToken: env.POLAR_ACCESS_TOKEN,
    successUrl: env.POLAR_SUCCESS_URL,
    server: "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
    // theme: "dark", // Enforces the theme - System-preferred theme will be set if left omitted
  })(e);
}

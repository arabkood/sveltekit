import { env } from '$env/dynamic/private';
import { CustomerPortal } from "@polar-sh/sveltekit";
import { redirect } from '@sveltejs/kit';

export const GET = (e) => {
  if (!e.locals.user) {
    redirect(307, "/")
  }
  console.log("rrr", e.locals.user)

  return CustomerPortal({
    accessToken: env.POLAR_ACCESS_TOKEN!,
    getCustomerId: async (event) => event.locals.user!.id,
    server: "sandbox",
  })(e);
}

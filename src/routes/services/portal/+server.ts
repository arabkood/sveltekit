import { env } from '$env/dynamic/private';
import { CustomerPortal } from "@polar-sh/sveltekit";
import { redirect } from '@sveltejs/kit';

export const GET = (e) => {
  if (!e.locals.user?.polarCustomerId) {
    redirect(307, "/")
  }
  // console.log("rrr", e.locals.user)

  return CustomerPortal({
    accessToken: env.POLAR_ACCESS_TOKEN!,
    getCustomerId: async (event) => event.locals.user!.polarCustomerId!,
    server: "sandbox",
  })(e);
}

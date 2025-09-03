import { env } from '$env/dynamic/private';
import { CustomerPortal } from "@polar-sh/sveltekit";

export const GET = CustomerPortal({
  accessToken: env.POLAR_ACCESS_TOKEN!,
  getCustomerId: async (event) => "test",
  server: "sandbox",
});

// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SelectUser } from '$lib/server/db/schema/auth';

declare global {
  namespace App {
    interface Locals {
      user: SelectUser | null;
    }
  }
}

export { };

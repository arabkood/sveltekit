// See https://svelte.dev/docs/kit/types#app.d.ts

import type { UserPrivate } from '$lib/server/db/repos/user';

declare global {
  namespace App {
    interface Locals {
      user: UserPrivate | null;
    }
  }
}

export { };

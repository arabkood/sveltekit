// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SelectUser } from '$lib/server/db/schema/auth';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
    interface Locals {
      user: SelectUser | null;
    }
  }
}

export { };

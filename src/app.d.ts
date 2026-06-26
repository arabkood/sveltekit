// See https://svelte.dev/docs/kit/types#app.d.ts

import type { UserPrivate } from '$lib/server/db/repos/user';
import type { PostHog } from 'posthog-js';

declare global {
	namespace App {
		interface Locals {
			user: UserPrivate | null;
			session: any | null;
		}
	}
	interface Window {
		posthog: PostHog | null;
	}
}

export {};

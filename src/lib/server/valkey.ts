import Redis from 'iovalkey';
import { privateEnv } from '$secrets';
import { dev } from '$app/env';
import { building } from '$app/environment';

// Use globalThis to avoid multiple connections in development mode
const globalForValkey = globalThis as unknown as { valkey: Redis };

export const valkey =
	globalForValkey.valkey ||
	(building
		? ({} as any as Redis)
		: new Redis(privateEnv.VALKEY_URL, {
				maxRetriesPerRequest: null,
				enableOfflineQueue: false,
				commandTimeout: 2000
			}));

if (dev) globalForValkey.valkey = valkey;

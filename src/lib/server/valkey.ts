import Redis from 'iovalkey';
import { privateEnv } from '$secrets';

// Use globalThis to avoid multiple connections in development mode
const globalForValkey = globalThis as unknown as { valkey: Redis };

export const valkey =
	globalForValkey.valkey ||
	new Redis(privateEnv.VALKEY_URL, {
		// maxRetriesPerRequest is set to null as it is often recommended 
		// for queues like BullMQ which we plan to use later
		maxRetriesPerRequest: null
	});

if (import.meta.env.DEV) globalForValkey.valkey = valkey;

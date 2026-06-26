import Redis from 'iovalkey';
import { privateEnv } from '$secrets';

// Use globalThis to avoid multiple connections in development mode
const globalForValkey = globalThis as unknown as { valkey: Redis };

export const valkey =
	globalForValkey.valkey ||
	new Redis(privateEnv.VALKEY_URL, {
		// maxRetriesPerRequest is set to null as it is often recommended 
		// for queues like BullMQ which we plan to use later
		maxRetriesPerRequest: null,
		// Disable offline queue so if Valkey goes down, commands reject instantly 
		// instead of hanging the request, allowing our fail-open logic to trigger.
		enableOfflineQueue: false,
		commandTimeout: 2000
	});

if (import.meta.env.DEV) globalForValkey.valkey = valkey;

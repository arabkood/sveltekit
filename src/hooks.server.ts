import type { ServerInit } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { db } from '$lib/server/db';
import { authHandle } from './auth.hook.server';
import { QueueService } from '$lib/server/queue';

export const init: ServerInit = async () => {
	// The database is initialized automatically when imported.
	// Accessing db here ensures connection errors are thrown at startup.
	(() => db)();
	
	// Provision the NATS streams on startup
	await QueueService.initQueue();
};

export const handle = sequence(authHandle);

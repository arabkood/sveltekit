import type { ServerInit } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { authHandle } from './auth.hook.server';
import { QueueService } from '$lib/server/queue';

export const init: ServerInit = async () => {
	await QueueService.initQueue();
};

export const handle = sequence(authHandle);

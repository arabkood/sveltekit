import type { ServerInit } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { initDB } from '$lib/server/db';
import { authHandle } from './auth.hook.server';

export const init: ServerInit = async () => {
	initDB();
};

export const handle = sequence(authHandle);

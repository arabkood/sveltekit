import type { ServerInit } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { db } from '$lib/server/db';
import { authHandle } from './auth2.hook.server';

export const init: ServerInit = async () => {
	// The database is initialized automatically when imported.
	// Accessing db here ensures connection errors are thrown at startup.
	db;
};

export const handle = sequence(authHandle);

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { privateEnv } from '$secrets';
import { relations } from './relations';

function createDB(pool: Pool) {
	return drizzle({
		client: pool,
		logger: false,
		relations
	});
}

export type DB = ReturnType<typeof createDB>;

const globalForDb = globalThis as unknown as { db: DB; pool: Pool };

export const pool =
	globalForDb.pool ||
	new Pool({
		connectionString: privateEnv.DATABASE_URL,
		min: 1
	});

if (!globalForDb.pool) {
	pool.on('error', (err) => {
		console.error('Unexpected error on idle database client', err);
	});
}

export const db: DB = globalForDb.db || createDB(pool);

if (import.meta.env.DEV) {
	globalForDb.db = db;
	globalForDb.pool = pool;
}

export function getDB(): DB {
	return db;
}

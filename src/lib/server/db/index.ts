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

export let db: DB;

export function initDB(): DB {
	if (db) {
		return db;
	}

	console.log('Initializing new database connection...');

	const dbURL = privateEnv.DATABASE_URL;

	if (!dbURL) {
		throw new Error('Missing DATABASE_URL');
	}

	const pool = new Pool({
		connectionString: dbURL
	});

	pool.on('error', (err) => {
		console.error('Unexpected error on idle database client', err);
	});

	db = createDB(pool);

	console.log('Database connection initialized successfully.');

	return db;
}

export function getDB(): DB {
	if (!db) {
		return initDB();
	}

	return db;
}

import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { env } from '$env/dynamic/private';
import pg from 'pg';

const { Pool } = pg;

export let db: NodePgDatabase;

export function initDB(): NodePgDatabase {
	if (db) {
		return db;
	}

	console.log('Initializing new database connection...');

	const dbURL = env.DATABASE_URL;

	if (!dbURL) {
		console.error('FATAL: Missing required database environment variables DATABASE_URL');
		// throw new Error('Database configuration is incomplete.');
	}

	try {
		const pool = new Pool({
			connectionString: dbURL
		});

		pool.on('error', (err) => {
			console.error('Unexpected error on idle database client', err);
			// Consider strategy: maybe reset dbInstance to null to force re-init on next request?
			// dbInstance = null;
		});

		// Create and store the Drizzle instance
		db = drizzle(pool, { logger: false /* Enable logger in dev if needed */ });

		console.log('Database connection initialized successfully.');
		return db;
	} catch (error) {
		console.error('FATAL: Failed to create database pool or Drizzle instance:', error);
		// Re-throw the error to signal failure
		throw error;
	}
}

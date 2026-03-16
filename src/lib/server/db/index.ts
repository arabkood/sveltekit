import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './generated/drizzle/schema';
import * as relations from './generated/drizzle/relations';
import { privateEnv } from '$secrets';

const combinedSchema = { ...schema, ...relations };

const { Pool } = pg;

type DB = NodePgDatabase<typeof combinedSchema>;

export let db: DB;

export function initDB(): DB {
	if (db) {
		return db;
	}

	console.log('Initializing new database connection...');

	const dbURL = privateEnv.DATABASE_URL;

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
		db = drizzle(pool, { logger: false, schema: combinedSchema });

		console.log('Database connection initialized successfully.');
		return db;
	} catch (error) {
		console.error('FATAL: Failed to create database pool or Drizzle instance:', error);
		// Re-throw the error to signal failure
		throw error;
	}
}

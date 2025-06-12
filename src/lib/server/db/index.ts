import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Pool } = pg;

export let db: NodePgDatabase;

export function initDB(): NodePgDatabase {
	if (db) {
		return db;
	}

	console.log('Initializing new database connection...');

	const dbName = process.env.ARABKOOD_DATABASE_DBNAME;
	const user = process.env.ARABKOOD_DATABASE_USER;
	const host = process.env.ARABKOOD_DATABASE_HOST;
	const password = process.env.ARABKOOD_DATABASE_PASSWORD;
	const port = process.env.ARABKOOD_DATABASE_PORT;

	if (!dbName || !user || !host || !password) {
		console.error(
			'FATAL: Missing required database environment variables (DBNAME, USER, HOST, PASSWORD). Cannot initialize database.',
			{ dbname: !!dbName, user: !!user, host: !!host, password: !!password }
		);
		throw new Error('Database configuration is incomplete.');
	}

	try {
		const pool = new Pool({
			database: dbName,
			user: user,
			host: host,
			password: password,
			port: Number(port || 5432)
			// ssl: {
			// 	rejectUnauthorized: false
			// }
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

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Pool } = pg;

export let db: any;

export function connectToDb() {
	const pool = new Pool({
		database: import.meta.env.ARABKOOD_DATABASE_DBNAME,
		user: import.meta.env.ARABKOOD_DATABASE_USER,
		host: import.meta.env.ARABKOOD_DATABASE_HOST,
		password: import.meta.env.ARABKOOD_DATABASE_PASSWORD,
		port: Number(import.meta.env.ARABKOOD_DATABASE_PORT || 5432)
	});
	db = drizzle({ client: pool });
}

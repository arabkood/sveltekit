import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
	database: import.meta.env.ARABKOOD_DATABASE_DBNAME,
	user: import.meta.env.ARABKOOD_DATABASE_USER,
	host: import.meta.env.ARABKOOD_DATABASE_HOST,
	password: import.meta.env.ARABKOOD_DATABASE_PASSWORD,
	port: Number(import.meta.env.ARABKOOD_DATABASE_PORT || 5432)
});

export const db = drizzle({ client: pool });

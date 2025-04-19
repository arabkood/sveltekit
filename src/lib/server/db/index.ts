import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import fs from 'node:fs';

let databaseUrl = env.DATABASE_URL;

// If DATABASE_URL is not set in the environment, try building it from the file
if (!databaseUrl) {
	console.log('DATABASE_URL env var not found, attempting to read from /etc/svelte-app/app.env');
	try {
		const envFilePath = '/etc/svelte-app/app.env';
		const fileContent = fs.readFileSync(envFilePath, 'utf8');
		const config = {};

		// Simple parsing logic for the .env file format
		fileContent.split('\n').forEach((line) => {
			const trimmedLine = line.trim();
			if (trimmedLine && !trimmedLine.startsWith('#')) {
				// Ignore comments and empty lines
				const equalsIndex = trimmedLine.indexOf('=');
				if (equalsIndex > 0) {
					const key = trimmedLine.substring(0, equalsIndex).trim();
					const value = trimmedLine
						.substring(equalsIndex + 1)
						.trim()
						.replace(/^['"](.*)['"]$/, '$1'); // Remove potential quotes
					config[key] = value;
				}
			}
		});

		// Extract required values (provide defaults or handle missing values as needed)
		const user = config.ARABKOOD_DATABASE_USERNAME;
		const password = config.ARABKOOD_DATABASE_PASSWORD || ''; // Use empty string if password is blank
		const host = config.ARABKOOD_DATABASE_HOST;
		const port = config.ARABKOOD_DATABASE_PORT || '5432'; // Default PG port
		const dbname = config.ARABKOOD_DATABASE_DBNAME;

		// Basic validation: Ensure the essential parts are present
		if (user && host && dbname) {
			// Construct the DATABASE_URL string
			// Format: postgresql://<user>:<password>@<host>:<port>/<database>
			const encodedPassword = encodeURIComponent(password); // Important for special characters in password
			databaseUrl = `postgresql://${user}:${encodedPassword}@${host}:${port}/${dbname}`;
			console.log('Successfully constructed DATABASE_URL from file.');
		} else {
			console.error(
				'Required database configuration fields (USERNAME, HOST, DBNAME) missing in',
				envFilePath
			);
			// Decide if you want to throw an error here or let the connection fail later
			throw new Error(`Incomplete database configuration in ${envFilePath}`);
		}
	} catch (error) {
		// Handle errors like file not found, permissions issues, or parsing errors
		console.error(`Error reading or processing ${'/etc/svelte-app/app.env'}:`, error.message);
		// If file reading fails, databaseUrl remains unset (or null/undefined)
		// Throwing an error here is safer as the app can't connect anyway
		throw new Error(`Failed to configure database connection: ${error.message}`);
	}
}

// Final check: If after all attempts, databaseUrl is still not set, throw an error.
if (!databaseUrl) {
	throw new Error('FATAL: Database connection URL could not be determined.');
}

// Use the determined databaseUrl (either from env or constructed from file)
console.log('Connecting to database...'); // Add log for confirmation
const client = postgres(databaseUrl);
export const db = drizzle(client);

console.log('Database connection configured.');

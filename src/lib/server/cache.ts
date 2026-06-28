import { valkey } from './valkey';

const PREFIX = 'cache:';

export async function cacheGet<T>(key: string): Promise<T | null> {
	const raw = await valkey.get(PREFIX + key);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
	await valkey.set(PREFIX + key, JSON.stringify(value), 'EX', ttlSeconds);
}

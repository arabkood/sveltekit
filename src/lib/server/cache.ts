import { valkey } from './valkey';
import { building } from '$app/environment';

const PREFIX = 'cache:';

export async function cacheGet<T>(key: string): Promise<T | null> {
	if (building) return null;
	const raw = await valkey.get(PREFIX + key);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
	if (building) return;
	await valkey.set(PREFIX + key, JSON.stringify(value), 'EX', ttlSeconds);
}

export async function cacheDelete(key: string): Promise<void> {
	await valkey.del(PREFIX + key);
}

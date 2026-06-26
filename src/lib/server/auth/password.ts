import * as argon2 from 'argon2';

/**
 * Hash a password using Argon2, matching Go's default argon2 settings.
 * SvelteKit backend will use node argon2 package defaults which are highly secure.
 */
export async function hashPassword(password: string): Promise<string> {
	// Go's default for argon2id: time=1, memory=64*1024, threads=4, keyLen=32
	return await argon2.hash(password, {
		type: argon2.argon2id,
		memoryCost: 65536, // 64 MB
		timeCost: 1,
		parallelism: 4,
		hashLength: 32
	});
}

/**
 * Verify a password against an Argon2 hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	try {
		return await argon2.verify(hash, password);
	} catch (err) {
		console.error('Password verification error', err);
		return false;
	}
}

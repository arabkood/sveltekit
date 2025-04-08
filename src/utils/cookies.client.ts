interface CookieAttributes {
	expires?: number | Date;
	path?: string;
	domain?: string;
	secure?: boolean;
	sameSite?: 'strict' | 'lax' | 'none';
}

interface CookieJar {
	[key: string]: string;
}

const defaults: CookieAttributes = {
	path: '/',
	sameSite: 'lax'
};

/**
 * Set a cookie with the given name and value
 */
export function setCookie(
	name: string,
	value: string | Record<string, unknown>,
	attributes: CookieAttributes = {}
): void {
	if (typeof document === 'undefined') {
		return;
	}

	const opts = { ...defaults, ...attributes };

	// Handle JSON objects
	const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;

	let cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(stringValue);

	if (opts.expires) {
		const expires = opts.expires;
		if (typeof expires === 'number') {
			const d = new Date();
			d.setTime(d.getTime() + expires * 864e5); // Convert days to milliseconds
			cookieString += '; expires=' + d.toUTCString();
		} else if (expires instanceof Date) {
			cookieString += '; expires=' + expires.toUTCString();
		}
	}

	if (opts.path) {
		cookieString += '; path=' + opts.path;
	}

	if (opts.domain) {
		cookieString += '; domain=' + opts.domain;
	}

	if (opts.secure) {
		cookieString += '; secure';
	}

	if (opts.sameSite) {
		cookieString += '; samesite=' + opts.sameSite.toLowerCase();
	}

	document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | undefined;
export function getCookie<T extends Record<string, unknown>>(
	name: string,
	json: true
): T | undefined;
export function getCookie(
	name: string,
	json = false
): string | Record<string, unknown> | undefined {
	if (typeof document === 'undefined') {
		return undefined;
	}

	const cookies = document.cookie ? document.cookie.split('; ') : [];
	const jar: CookieJar = {};

	for (const cookie of cookies) {
		const parts = cookie.split('=');
		const value = parts.slice(1).join('=');
		const foundKey = parts[0];

		try {
			const key = decodeURIComponent(foundKey);
			jar[key] = decodeURIComponent(value);
		} catch {
			// Skip malformed cookies
			continue;
		}
	}

	const value = jar[name];
	if (!value) {
		return undefined;
	}

	if (!json) {
		return value;
	}

	try {
		return JSON.parse(value) as Record<string, unknown>;
	} catch {
		return undefined;
	}
}

/**
 * Get all cookies as an object
 */
export function getAllCookies(json = false): CookieJar | Record<string, unknown> {
	if (typeof document === 'undefined') {
		return {};
	}

	const cookies = document.cookie ? document.cookie.split('; ') : [];
	const jar: CookieJar = {};

	for (const cookie of cookies) {
		const parts = cookie.split('=');
		const value = parts.slice(1).join('=');
		const foundKey = parts[0];

		try {
			const key = decodeURIComponent(foundKey);
			const val = decodeURIComponent(value);

			if (json) {
				try {
					jar[key] = JSON.parse(val);
				} catch {
					jar[key] = val;
				}
			} else {
				jar[key] = val;
			}
		} catch {
			// Skip malformed cookies
			continue;
		}
	}

	return jar;
}

/**
 * Remove a cookie by name
 */
export function removeCookie(name: string, attributes: CookieAttributes = {}): void {
	setCookie(name, '', {
		...attributes,
		expires: -1
	});
}

/**
 * Check if cookies are enabled
 */
export function checkCookiesSupport(): boolean {
	if (typeof document === 'undefined') {
		return false;
	}

	const testKey = '__cookie_test__';
	const value = '1';

	try {
		setCookie(testKey, value);
		const result = getCookie(testKey) === value;
		removeCookie(testKey);
		return result;
	} catch {
		return false;
	}
}

export default {
	setCookie,
	getCookie,
	getAllCookies,
	removeCookie,
	checkCookiesSupport
};

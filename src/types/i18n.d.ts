import type { Readable } from 'svelte/store';
import type ar from '$i18n/locales/ar';
import type { ApiErrMessages } from './api';

export type Dictionary = typeof ar;
export type Language = 'ar';

// Get nested object type
export type NestedKeysOf<T> = T extends string
	? []
	: T extends object
		? {
				[K in keyof T]: [K, ...NestedKeysOf<T[K]>];
			}[keyof T]
		: [];

// Join array to create dot notation
export type Join<T extends unknown[], D extends string> = T extends []
	? never
	: T extends [infer F]
		? F
		: T extends [infer F, ...infer R]
			? F extends string
				? `${F}${D}${Join<Extract<R, string[]>, D>}`
				: never
			: string;

// Create the final translation key type
export type TranslationKey = Join<NestedKeysOf<Dictionary>, '.'>;
export type ErrorKey = ApiErrMessages;

// Type to get the value type at a specific path
export type PathValue<T, P extends string> = P extends keyof T
	? T[P]
	: P extends `${infer K}.${infer Rest}`
		? K extends keyof T
			? PathValue<T[K], Rest>
			: never
		: never;

export interface I18nStore extends Readable<{
	currentLocale: Language;
	dictionary: Dictionary;
}> {
	t: (key: TranslationKey, params?: Record<string, string>) => string;
	setLocale: (locale: Language) => void;
	error: (key: ErrorKey | string) => string;
}

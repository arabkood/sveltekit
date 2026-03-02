import type { LessonInteractiveAnswers } from '$types/lesson';

type StorageItem<T> = {
	v: T;
	e: number;
};

const PREFIX = 'drft-itm-';

export type DraftItem = {
	a: LessonInteractiveAnswers;
	csi: number;
	tt: number;
};

export function getDraftItem(itemId: string): DraftItem | null {
	if (typeof window === 'undefined') return null;

	const item = localStorage.getItem(PREFIX + itemId);
	if (!item) return null;

	const parsed: StorageItem<DraftItem> = JSON.parse(item);

	// Check if expired
	if (Date.now() > parsed.e) {
		localStorage.removeItem(PREFIX + itemId);
		return null;
	}

	return parsed.v;
}

export function setDraftItem<T>(itemId: string, value: T, customTTL?: number) {
	const ttl = customTTL ?? 60 * 4;
	const item: StorageItem<T> = {
		v: value,
		e: Date.now() + ttl * 60 * 1000
	};
	try {
		localStorage.setItem(PREFIX + itemId, JSON.stringify(item));
	} catch (e: any) {
		if (e.name === 'QuotaExceededError') {
			console.warn('Storage quota exceeded');

			const expiredCleared = clearExpiredDraftItems();

			if (expiredCleared > 0) {
				console.log(`Cleared ${expiredCleared} expired drafts`);
				try {
					localStorage.setItem(PREFIX + itemId, JSON.stringify(item));
					return;
				} catch (e2) {
					console.error('Local storage quota exceeded');
				}
			}
		}
	}
}

export function removeDraftItem(itemId: string) {
	localStorage.removeItem(PREFIX + itemId);
}

export function clearExpiredDraftItems() {
	const now = Date.now();
	let clearedCount = 0;

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key?.startsWith(PREFIX)) {
			try {
				const item = localStorage.getItem(key);
				if (item) {
					const parsed: StorageItem<any> = JSON.parse(item);
					if (now > parsed.e) {
						localStorage.removeItem(key);
						clearedCount++;
						i--;
					}
				}
			} catch (e) {
				localStorage.removeItem(key);
				clearedCount++;
				i--;
			}
		}
	}
	return clearedCount;
}

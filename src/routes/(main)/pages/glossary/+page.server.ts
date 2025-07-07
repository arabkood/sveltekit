import glossaryData from '$lib/data/glossary.json';
import type { PageLoad } from './$types';

// Define a type for a single glossary item for better autocompletion
export type GlossaryItem = {
	t: string; // term
	d: string; // definition
	e?: {
		l: string; // language
		c: string; // code
	};
};

export const load: PageLoad = async () => {
	// Group terms by the first letter of the English key
	const grouped: Record<string, [string, GlossaryItem][]> = {};

	// Sort the terms alphabetically by the English key
	const sortedEntries = Object.entries(glossaryData).sort((a, b) => a[0].localeCompare(b[0]));

	for (const [key, value] of sortedEntries) {
		const firstLetter = key[0].toUpperCase();
		if (!grouped[firstLetter]) {
			grouped[firstLetter] = [];
		}
		grouped[firstLetter].push([key, value as GlossaryItem]);
	}

	return {
		glossary: grouped,
		totalTerms: sortedEntries.length
	};
};

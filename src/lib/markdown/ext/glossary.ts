import type { RendererObject } from 'marked';
import type { MarkedExtension } from 'marked';
import glossaryData from '$lib/data/glossary.json';

const dict = createLookupMap(glossaryData);

function createLookupMap(glossary: Glossary): LookupMap {
	const map: LookupMap = {};

	for (const [key, entry] of Object.entries(glossary)) {
		const normKey = normalize(key);
		const normArabic = normalize(entry.t);

		map[normKey] = { key, entry };
		map[normArabic] = { key, entry };
	}

	return map;
}

type GlossaryEntry = {
	t: string;
	d: string;
};
type Glossary = Record<string, GlossaryEntry>;
type LookupMap = Record<string, { key: string; entry: GlossaryEntry }>;

function normalize(text: string): string {
	return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function searchGlossaryFast(
	map: LookupMap,
	query: string
): { key: string; entry: GlossaryEntry } | null {
	const normalizedQuery = normalize(query);
	return map[normalizedQuery] || null;
}

export const glossary = (options = {}): MarkedExtension => {
	const renderer: RendererObject = {
		codespan(token) {
			const key = token.text;
			const found = searchGlossaryFast(dict, key);
			if (!found) {
				return `<code dir="auto">${token.text}</code>`;
			}

			const isArabic = /[\u0600-\u06FF]/.test(key);
			const name = isArabic ? found.key : found.entry.t;

			return `<code dir="ltr" data-glossary="${found.key}"${name ? ` data-glossary-t="${name}"` : ''}${found.entry.d ? ` data-glossary-d="${found.entry.d}"` : ''}>${key}</code>`;
		}
	};

	return {
		renderer
	};
};

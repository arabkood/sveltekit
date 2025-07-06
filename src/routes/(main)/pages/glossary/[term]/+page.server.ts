import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import glossaryData from '$lib/markdown/ext/glossary.json';

function findTerm(slug: string) {
	const allTerms = Object.keys(glossaryData);
	const matchedKey = allTerms.find(
		(englishTerm) => englishTerm.toLowerCase() === slug.toLowerCase()
	);

	if (matchedKey) {
		return {
			englishTerm: matchedKey,
			details: glossaryData[matchedKey as keyof typeof glossaryData]
		};
	}

	return null;
}

export const load: PageServerLoad = ({ params }) => {
	const termSlug = params.term;
	const termData = findTerm(termSlug);

	if (!termData) {
		throw error(404, {
			message: `Glossary term '${termSlug}' not found`
		});
	}

	return {
		englishTerm: termData.englishTerm,
		details: termData.details
	};
};

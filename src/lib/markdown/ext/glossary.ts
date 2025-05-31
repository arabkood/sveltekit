import type { RendererObject } from 'marked';
import type { MarkedExtension } from 'marked';
import dict from './glossary.json';

export const glossary = (options = {}): MarkedExtension => {
	const renderer: RendererObject = {
		codespan(token) {
			if (!token.text.startsWith(':', 0)) {
				return `<code>${token.text}</code>`;
			}
			const key = token.text.substring(1);
			if (!Object.hasOwn(dict, key)) {
				return `<code>${token.text}</code>`;
			}
			const item = dict[key as keyof typeof dict];

			return `<code data-glossary="${key}" data-glossary-t="${item.t}" data-glossary-d="${item.d}">${key}</code>`;
		}
	};

	return {
		renderer
	};
};

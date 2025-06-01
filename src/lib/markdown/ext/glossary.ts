import type { RendererObject } from 'marked';
import type { MarkedExtension } from 'marked';
import dict from './glossary.json';

export const glossary = (options = {}): MarkedExtension => {
	const renderer: RendererObject = {
		codespan(token) {
			if (!token.text.startsWith(':', 0)) {
				return `<code dir="auto">${token.text}</code>`;
			}
			const key = token.text.substring(1);
			if (!Object.hasOwn(dict, key)) {
				return `<code dir="auto">${token.text}</code>`;
			}
			const item = dict[key as keyof typeof dict];

			return `<code dir="ltr" data-glossary="${key}"${item.t ? ` data-glossary-t="${item.t}"` : ''}${item.d ? ` data-glossary-d="${item.d}"` : ''}>${key}</code>`;
		}
	};

	return {
		renderer
	};
};

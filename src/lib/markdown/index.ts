import { Marked, type RendererObject } from 'marked';
import markedAlert from 'marked-alert';
import hljs from 'highlight.js';

import { glossary } from './ext/glossary';
import { markedHighlight } from './ext/code';

const renderer: RendererObject = {
	link(t) {
		const link = marked.Renderer.prototype.link.call(this, t);
		return link.replace('<a', "<a target='_blank' rel='noreferrer' ");
	},
	image({ href, title, text }) {
		try {
			const url = new URL(href, 'http://example.com');
			const dimensions = url.searchParams.get('ph');

			if (dimensions && /^\d+x\d+$/.test(dimensions)) {
				// --- PATH 1: Dimensions ARE specified in the URL ---
				const [width, height] = dimensions.split('x');

				const placeholderHtml = `
						<img
							src="${href}"
							alt="${text}"
							${title ? `title="${title}"` : ''}
							class="markdown-img-load"
              style="--aspect-w: ${width}; --aspect-h: ${height};"
						/>
				`;
				return placeholderHtml;
			}
		} catch (e) {
			// If URL parsing fails, fall through to the default behavior
			console.error('Invalid URL for image:', href, e);
		}

		// --- PATH 2: No valid 'ph' param found (Fallback) ---
		const standardImageHtml = `
			<img 
				src="${href}" 
				alt="${text}" 
				${title ? `title="${title}"` : ''}
				class="rounded-lg my-4" 
				loading="lazy" 
			/>
		`;
		return standardImageHtml;
	}
};

export const marked = new Marked({
	gfm: true,
	renderer
})
	.use(
		markedHighlight({
			emptyLangClass: 'hljs',
			langPrefix: 'hljs language-',
			highlight(code, lang, info) {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';
				return hljs.highlight(code, { language }).value;
			},
			defaultTitleToLang: false,
			defaultEnableCopy: true
		})
	)
	.use(glossary())
	.use(markedAlert());

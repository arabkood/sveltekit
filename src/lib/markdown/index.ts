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
	.use(markedAlert({
		variants: [
			{
				type: 'tip',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>`,
				title: 'نصيحة',
			},
			{
				type: 'next',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>`,
				title: 'التالي',
			}
		]
	}));

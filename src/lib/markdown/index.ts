import { Marked, type RendererObject } from 'marked';
import markedAlert from 'marked-alert';
import hljs from 'highlight.js';

import { glossary } from './ext/glossary';
import { markedHighlight } from './ext/code';

const renderer: RendererObject = {
	link(t) {
		const link = marked.Renderer.prototype.link.call(this, t);
		return link.replace('<a', "<a target='_blank' rel='noreferrer' ");
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

import { Marked } from 'marked';
import markedAlert from 'marked-alert';
import hljs from 'highlight.js';

import { glossary } from './ext/glossary';
import { markedHighlight } from './ext/code';

export const marked = new Marked({
	gfm: true
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

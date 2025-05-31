import type { RendererObject, Token, Tokens, MarkedExtension } from 'marked';

interface HighlightOptions {
	highlight: (code: string, lang: string, rawLang: string) => string | Promise<string>;
	langPrefix?: string;
	emptyLangClass?: string;
	async?: boolean;
	defaultTitleToLang?: boolean;
	defaultEnableCopy?: boolean;
}

// Escape helpers (same as in original code)
const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, 'g');
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
const escapeReplacements: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
};

const getEscapeReplacement = (ch: string): string => escapeReplacements[ch];

export function markedHighlight(
	options: HighlightOptions | HighlightOptions['highlight']
): MarkedExtension {
	if (typeof options === 'function') {
		options = {
			highlight: options
		};
	}

	if (!options || typeof options.highlight !== 'function') {
		throw new Error('Must provide highlight function');
	}

	if (typeof options.langPrefix !== 'string') {
		options.langPrefix = 'language-';
	}

	if (typeof options.emptyLangClass !== 'string') {
		options.emptyLangClass = '';
	}

	const escapeHtml = (html: string, encode?: boolean): string => {
		if (encode) {
			if (escapeTest.test(html)) {
				return html.replace(escapeReplace, getEscapeReplacement);
			}
		} else {
			if (escapeTestNoEncode.test(html)) {
				return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
			}
		}
		return html;
	};

	// const getLang = (lang: string | undefined): string => {
	//   return (lang || "").match(/\S*/)?.[0] || "";
	// };

	type Attrs = {
		lang: string;
		[key: string]: string | boolean;
	};
	const getAttrs = (info: string | undefined): Attrs => {
		const result: Attrs = { lang: '' };
		if (!info) return result;

		// Get the first word as lang
		const parts = info.trim().split(/\s+/);
		result.lang = parts[0] || '';

		// Process rest of parts
		for (let i = 1; i < parts.length; i++) {
			const part = parts[i];
			// key="value"
			const eqIndex = part.indexOf('=');
			if (eqIndex !== -1) {
				const key = part.slice(0, eqIndex);
				// Remove quotes from value
				const value = part.slice(eqIndex + 1).replace(/^"(.*)"$/, '$1');
				result[key] = value;
			} else {
				// Flag attribute, e.g. copy
				result[part] = true;
			}
		}

		return result;
	};

	const updateToken = (token: Tokens.Code) => (code: string) => {
		if (typeof code === 'string' && code !== token.text) {
			token.escaped = true;
			token.text = code;
		}
	};

	// const old_renderer: RendererObject = {
	//   code(code): string {
	//     const attrs = getAttrs(code.lang);
	//     const classValue = attrs.lang
	//       ? options!.langPrefix + escapeHtml(attrs.lang)
	//       : options!.emptyLangClass!;
	//     const classAttr = classValue ? ` class="${classValue}"` : "";
	//     code.text = code.text.replace(/\n$/, "");
	//     return `<pre><code${classAttr}>${code.escaped ? code.text : escapeHtml(code.text, true)}\n</code></pre>`;
	//   },
	// };

	const renderer: RendererObject = {
		code(code): string {
			const attrs = getAttrs(code.lang);

			// Use lang prefix for class
			const classValue = attrs.lang
				? options!.langPrefix + escapeHtml(attrs.lang)
				: options!.emptyLangClass!;

			const classAttr = classValue ? ` class="${classValue}"` : '';

			// Trim trailing newline from code text
			code.text = code.text.replace(/\n$/, '');

			// Title div (use attrs.title or fallback to lang)
			const title =
				typeof attrs.title === 'string'
					? attrs.title
					: options.defaultTitleToLang
						? attrs.lang || ''
						: '';
			const titleHtml = title
				? `<div class="code-header" dir="auto" >${escapeHtml(title)}</div>`
				: '';

			// Enable copy button or no
			const copy = Object.hasOwn(attrs, 'copy') || options.defaultEnableCopy;
			const copyAttr = copy && attrs.copy !== 'false' ? 'data-copy-button="true"' : '';

			// Always enable copy button (data-copy-button attribute on <pre>)
			return `<div class="code-block">${titleHtml}<pre class="code-body" ${copyAttr}><code${classAttr}>${
				code.escaped ? code.text : escapeHtml(code.text, true)
			}\n</code></pre></div>`;
		}
	};

	return {
		async: !!options.async,
		walkTokens(token: Token): Promise<void> | void {
			if (token.type !== 'code') return;

			const codeToken = token as Tokens.Code;
			const attrs = getAttrs(codeToken.lang);
			const title = typeof attrs.title === 'string' ? attrs.title : '';

			if (options!.async) {
				return Promise.resolve(
					options!.highlight(codeToken.text, attrs.lang, codeToken.lang || '')
				).then(updateToken(codeToken));
			}

			const code = options!.highlight(codeToken.text, attrs.lang, codeToken.lang || '');
			if (code instanceof Promise) {
				throw new Error(
					'markedHighlight is not set to async but the highlight function is async. Set the async option to true on markedHighlight to await the async highlight function.'
				);
			}
			updateToken(codeToken)(code);
		},
		renderer
	};
}

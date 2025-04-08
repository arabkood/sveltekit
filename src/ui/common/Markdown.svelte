<script lang="ts">
	import hljs from 'highlight.js';
	import MarkdownIt from 'markdown-it';
	import type { Options } from 'markdown-it';
	import type { Token } from 'markdown-it/index.js';

	let {
		markdown = ''
	}: {
		markdown?: string;
	} = $props();

	const arabicRegex = /^[\u0600-\u06FF]/;

	const md: MarkdownIt = new MarkdownIt({
		html: true,
		linkify: true,
		typographer: true,
		highlight: function (str: string, lang: string): string {
			const isArabic: boolean = arabicRegex.test(str);
			const direction: 'ltr' | 'rtl' = isArabic ? 'rtl' : 'ltr';
			const containerClass: string = `code-block-container${isArabic ? ' rtl-code' : ''}`;

			const langLabel: string = lang
				? `<div class="code-lang-label">${lang.toUpperCase()}</div>`
				: '';

			if (lang && hljs.getLanguage(lang)) {
				try {
					const highlighted: string = hljs.highlight(str, {
						language: lang,
						ignoreIllegals: true
					}).value;
					return `<div class="${containerClass}">${langLabel}<pre dir="${direction}"><code class="hljs language-${lang}">${highlighted}</code></pre></div>`;
				} catch (error) {
					console.error('Highlight.js error:', error);
					const escaped: string = md.utils.escapeHtml(str);
					return `<div class="${containerClass}">${langLabel}<pre dir="${direction}"><code class="hljs">${escaped}</code></pre></div>`;
				}
			}

			const escaped: string = md.utils.escapeHtml(str);
			return `<div class="${containerClass}">${langLabel}<pre dir="${direction}"><code class="hljs">${escaped}</code></pre></div>`;
		}
	});

	md.renderer.rules.fence = (tokens: Token[], idx: number, options: Options, env, self): string => {
		const token = tokens[idx];
		const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
		const langName = info.split(/\s+/g)[0];

		if (options.highlight) {
			return options.highlight(token.content, langName, '');
		}

		const isArabicFallback: boolean = arabicRegex.test(token.content);
		const fallbackDirection: 'ltr' | 'rtl' = isArabicFallback ? 'rtl' : 'ltr';
		const fallbackContainerClass: string = `code-block-container${isArabicFallback ? ' rtl-code' : ''}`;
		const langLabel: string = langName
			? `<div class="code-lang-label">${langName.toUpperCase()}</div>`
			: '';
		const escapedContentFallback: string = md.utils.escapeHtml(token.content);
		const attrs = self.renderAttrs(token);
		const langClass = langName ? `language-${langName}` : '';

		return `<div class="${fallbackContainerClass}">${langLabel}<pre dir="${fallbackDirection}" ${attrs}><code class="hljs ${langClass}">${escapedContentFallback}</code></pre></div>`;
	};

	md.renderer.rules.code_inline = (tokens, idx) => {
		const token = tokens[idx];
		const direction: 'ltr' | 'rtl' = arabicRegex.test(token.content) ? 'rtl' : 'ltr';
		return `<code dir="${direction}">${md.utils.escapeHtml(token.content)}</code>`;
	};

	const rendered: string = $derived(md.render(markdown));
</script>

<div class="markdown-render-wrapper">
	{@html rendered}
</div>

<style>
	.markdown-render-wrapper :global(code:not(pre code)) {
		padding: 0.2em 0.4em;
		margin: 0;
		font-size: 85%;
		background-color: rgba(175, 184, 193, 0.2);
		border-radius: 6px;
		unicode-bidi: embed;
		direction: inherit;
	}

	.markdown-render-wrapper :global(pre[dir='rtl']) {
		text-align: right;
		position: relative;
		margin-top: 0;
		margin-bottom: 0;
		padding-top: 0;
	}

	.markdown-render-wrapper :global(pre[dir='ltr']) {
		text-align: left;
		position: relative;
		margin-top: 0;
		margin-bottom: 0;
		padding-top: 0;
	}

	.markdown-render-wrapper :global(pre) {
		padding: 1em;
		overflow: auto;
		margin: 0;
	}

	.markdown-render-wrapper :global(.code-block-container) {
		position: relative;
		margin-top: 1.5em;
		margin-bottom: 1.5em;
		background-color: #f6f8fa;
		border: 1px solid #d0d7de;
		border-radius: 6px;
		overflow: hidden;
	}

	.markdown-render-wrapper :global(.code-block-container > pre) {
		padding-top: 2.5em;
		border: none;
		background-color: transparent;
		margin-top: 0;
	}

	.markdown-render-wrapper :global(.code-lang-label) {
		position: absolute;
		top: 0;
		font-size: 0.75em;
		font-family: sans-serif;
		padding: 0.25em 0.8em;
		border-bottom: 1px solid #d0d7de;
		border-left: 1px solid #d0d7de;
		background-color: #f0f0f0;
		color: #333;
		user-select: none;
		z-index: 1;
		right: 0;
		left: auto;
		border-radius: 0 0 0 6px;
	}

	.markdown-render-wrapper :global(.code-block-container.rtl-code .code-lang-label) {
		right: auto;
		left: 0;
		border-left: none;
		border-right: 1px solid #d0d7de;
		border-radius: 0 0 6px 0;
	}

	.markdown-render-wrapper :global(pre code.hljs) {
		display: block;
	}

	.markdown-render-wrapper :global(hr) {
		display: block;
		height: 0;
		border: 0;
		border-top: 1px solid #d0d7de;
		border-bottom: 1px solid rgba(255, 255, 255, 0.3);
		margin: 24px 0;
		padding: 0;
		overflow: hidden;
		background: transparent;
	}

	.markdown-render-wrapper :global(ul),
	.markdown-render-wrapper :global(ol) {
		margin-block-start: 0;
		margin-block-end: 16px;
		margin-inline-start: 0px;
		margin-inline-end: 0px;
		padding-inline-start: 2em;
	}
	.markdown-render-wrapper :global(ol) {
		list-style-type: decimal;
	}
	.markdown-render-wrapper :global(li) {
		margin-bottom: 0.25em;
	}
	.markdown-render-wrapper :global(ul ul),
	.markdown-render-wrapper :global(ul ol),
	.markdown-render-wrapper :global(ol ul),
	.markdown-render-wrapper :global(ol ol) {
		margin-block-start: 0;
		margin-block-end: 0;
	}
	.markdown-render-wrapper :global(li > p) {
		margin-block-start: 0;
		margin-block-end: 0;
	}
	.markdown-render-wrapper :global(li > p:first-child) {
		margin-block-start: 0;
	}
	.markdown-render-wrapper :global(li > p:last-child) {
		margin-block-end: 0;
	}
	.markdown-render-wrapper :global(li + li) {
		margin-top: 0.25em;
	}
	.markdown-render-wrapper :global(ul:not(li > ul):not(li > ol) + *),
	.markdown-render-wrapper :global(ol:not(li > ul):not(li > ol) + *) {
		margin-top: 24px;
	}

	@media (prefers-color-scheme: dark) {
		.markdown-render-wrapper :global(.code-block-container) {
			background-color: #161b22;
			border-color: #30363d;
		}

		.markdown-render-wrapper :global(.code-lang-label) {
			background-color: #0d1117;
			color: #c9d1d9;
			border-bottom-color: #30363d;
			border-left-color: #30363d;
		}
		.markdown-render-wrapper :global(.code-block-container.rtl-code .code-lang-label) {
			border-left-color: transparent;
			border-right-color: #30363d;
		}

		.markdown-render-wrapper :global(code:not(pre code)) {
			background-color: rgba(110, 118, 129, 0.4);
		}

		.markdown-render-wrapper :global(hr) {
			border-top-color: #30363d;
			border-bottom-color: rgba(255, 255, 255, 0.1);
		}
	}
</style>

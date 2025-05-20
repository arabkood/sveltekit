<script lang="ts">
	import { replacePublicUrls } from '$utils/s3-public-assets';
	import hljs from 'highlight.js';
	import MarkdownIt from 'markdown-it';
	import type { Options } from 'markdown-it';
	import type { Token } from 'markdown-it/index.js';

	let {
		markdown: markdownp = '',
		evalPublicAssets = false
	}: {
		markdown?: string;
		evalPublicAssets?: boolean;
	} = $props();

	let markdown = $derived(evalPublicAssets ? replacePublicUrls(markdownp) : markdownp);

	const arabicRegex = /^[\u0600-\u06FF]/;

	function createCodeBlockHtml(
		content: string,
		lang: string,
		isHighlighted: boolean,
		escapedContentOverride?: string
	): string {
		const isArabic: boolean = arabicRegex.test(content);
		const direction: 'ltr' | 'rtl' = isArabic ? 'rtl' : 'ltr';
		const containerClass: string = `code-block-container ${isArabic ? ' rtl-code' : ''}`;

		const langLabel: string = lang
			? `<div class="code-lang-label">${lang.toUpperCase()}</div>`
			: '';

		const copyButton: string = `<button class="copy-code-button" title="Copy code">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
				<path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h5A1.5 1.5 0 0 1 15 3.5v5A1.5 1.5 0 0 1 13.5 10h-5A1.5 1.5 0 0 1 7 8.5v-5Zm1.5-.5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-5Z"/>
  				<path d="M2.5 6A1.5 1.5 0 0 0 1 7.5v8A1.5 1.5 0 0 0 2.5 17h8a1.5 1.5 0 0 0 1.5-1.5V15a.5.5 0 0 1 1 0v.5A2.5 2.5 0 0 1 10.5 18h-8A2.5 2.5 0 0 1 0 15.5v-8A2.5 2.5 0 0 1 2.5 5H5a.5.5 0 0 1 0 1H2.5Z"/>
			</svg>
			<span class="copy-status">Copy</span>
		</button>`;

		const codeContent: string = escapedContentOverride
			? escapedContentOverride
			: isHighlighted
				? content
				: md.utils.escapeHtml(content);

		const langClass = lang ? `language-${lang}` : '';

		return `<div class="${containerClass}">
					<div class="code-block-header">
						${langLabel}
						${copyButton}
					</div>
					<pre dir="${direction}"><code class="hljs ${langClass}">${codeContent}</code></pre>
				</div>`;
	}

	const md: MarkdownIt = new MarkdownIt({
		html: true,
		linkify: true,
		typographer: true,
		highlight: function (str: string, lang: string): string {
			if (lang && hljs.getLanguage(lang)) {
				try {
					const highlighted: string = hljs.highlight(str, {
						language: lang,
						ignoreIllegals: true
					}).value;
					return createCodeBlockHtml(str, lang, true, highlighted);
				} catch (error) {
					console.error('Highlight.js error:', error);
					return createCodeBlockHtml(str, lang, false);
				}
			}
			return createCodeBlockHtml(str, lang, false);
		}
	});

	md.renderer.rules.fence = (tokens: Token[], idx: number, options: Options, env, self): string => {
		const token = tokens[idx];
		const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
		const langName = info.split(/\s+/g)[0];

		if (options.highlight) {
			return options.highlight(token.content, langName, '');
		}
		return createCodeBlockHtml(token.content, langName, false);
	};

	md.renderer.rules.code_inline = (tokens, idx) => {
		const token = tokens[idx];
		const direction: 'ltr' | 'rtl' = arabicRegex.test(token.content) ? 'rtl' : 'ltr';
		return `<code dir="${direction}">${md.utils.escapeHtml(token.content)}</code>`;
	};

	const rendered: string = $derived(md.render(markdown));

	function handleCopyCode(event: MouseEvent) {
		const target = event.target as HTMLElement;
		const button = target.closest('.copy-code-button');

		if (button) {
			const container = button.closest('.code-block-container');
			if (container) {
				const codeElement = container.querySelector('pre code');
				if (codeElement) {
					const codeToCopy = codeElement.textContent || '';
					navigator.clipboard
						.writeText(codeToCopy)
						.then(() => {
							const copyStatus = button.querySelector('.copy-status');
							if (copyStatus) copyStatus.textContent = 'Copied!';
							button.classList.add('copied');
							setTimeout(() => {
								if (copyStatus) copyStatus.textContent = 'Copy';
								button.classList.remove('copied');
							}, 2000);
						})
						.catch((err) => {
							console.error('Failed to copy: ', err);
							const copyStatus = button.querySelector('.copy-status');
							if (copyStatus) copyStatus.textContent = 'Error';
						});
				}
			}
		}
	}
</script>

<div role="none" class="markdown-render-wrapper" onclick={handleCopyCode}>
	{@html rendered}
</div>

<style>
	.markdown-render-wrapper {
		color: var(--color-slate-700);
		line-height: 1.6;
	}

	.markdown-render-wrapper :global(h1),
	.markdown-render-wrapper :global(h2),
	.markdown-render-wrapper :global(h3),
	.markdown-render-wrapper :global(h4),
	.markdown-render-wrapper :global(h5),
	.markdown-render-wrapper :global(h6) {
		margin-top: 1.5em;
		margin-bottom: 0.75em;
		font-weight: 600;
		line-height: 1.25;
		border-bottom: 1px solid var(--color-slate-200);
		padding-bottom: 0.3em;
		color: var(--color-slate-900);
	}
	.markdown-render-wrapper :global(h1) {
		font-size: 2em;
	}
	.markdown-render-wrapper :global(h2) {
		font-size: 1.5em;
	}
	.markdown-render-wrapper :global(h3) {
		font-size: 1.25em;
	}
	.markdown-render-wrapper :global(h4) {
		font-size: 1em;
	}
	.markdown-render-wrapper :global(h5) {
		font-size: 0.875em;
	}
	.markdown-render-wrapper :global(h6) {
		font-size: 0.85em;
		color: var(--color-slate-500);
	}
	.markdown-render-wrapper :global(h1:first-child),
	.markdown-render-wrapper :global(h2:first-child) {
		margin-top: 0;
	}
	.markdown-render-wrapper :global(p) {
		margin-bottom: 1em;
	}

	.markdown-render-wrapper :global(a) {
		color: var(--color-blue-600);
		text-decoration: none;
	}
	.markdown-render-wrapper :global(a:hover) {
		color: var(--color-blue-700);
		text-decoration: underline;
	}

	.markdown-render-wrapper :global(blockquote) {
		margin: 1.5em 0;
		padding: 0.5em 1em;
		color: var(--color-slate-600);
		background-color: var(--color-slate-50);
		border-left: 0.25em solid var(--color-slate-300);
	}
	.markdown-render-wrapper :global(blockquote p:last-child) {
		margin-bottom: 0;
	}

	.markdown-render-wrapper :global(code:not(pre code)) {
		padding: 0.2em 0.4em;
		margin: 0 0.1em;
		font-size: 85%;
		font-family: var(--font-mono);
		background-color: var(--color-slate-100);
		color: var(--color-pink-600);
		border-radius: 6px;
		unicode-bidi: embed;
		direction: inherit;
	}

	.markdown-render-wrapper :global(.code-block-container) {
		position: relative;
		margin-top: 1.5em;
		margin-bottom: 1.5em;
		background-color: var(--color-slate-50);
		border: 1px solid var(--color-slate-200);
		border-radius: 6px;
		overflow: hidden;
	}

	.markdown-render-wrapper :global(.code-block-header) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.4em 0.8em;
		background-color: var(--color-slate-100);
		border-bottom: 1px solid var(--color-slate-200);
		font-size: 0.8em;
		font-family: var(--font-sans);
	}
	.markdown-render-wrapper :global(.code-block-container.rtl-code .code-block-header) {
		flex-direction: row-reverse;
	}

	.markdown-render-wrapper :global(.code-lang-label) {
		color: var(--color-slate-600);
		font-weight: 500;
		user-select: none;
	}

	.markdown-render-wrapper :global(.copy-code-button) {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		background-color: var(--color-slate-200);
		color: var(--color-slate-700);
		border: 1px solid var(--color-slate-300);
		padding: 0.3em 0.6em;
		border-radius: 5px;
		cursor: pointer;
		font-size: 0.9em;
		line-height: 1;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease;
	}
	.markdown-render-wrapper :global(.copy-code-button svg) {
		vertical-align: middle;
		fill: currentColor;
	}
	.markdown-render-wrapper :global(.copy-code-button:hover) {
		background-color: var(--color-slate-300);
		border-color: var(--color-slate-400);
	}
	.markdown-render-wrapper :global(.copy-code-button.copied) {
		background-color: var(--color-green-500);
		color: var(--color-white);
		border-color: var(--color-green-600);
	}

	.markdown-render-wrapper :global(pre) {
		margin: 0;
		overflow: auto;
		font-family: var(--font-mono);
		font-size: 0.9em;
		line-height: 1.45;
	}
	.markdown-render-wrapper :global(pre[dir='rtl']) {
		text-align: right;
	}
	.markdown-render-wrapper :global(pre[dir='ltr']) {
		text-align: left;
	}

	.markdown-render-wrapper :global(pre code.hljs) {
		display: block;
		padding: 1em;
	}

	.markdown-render-wrapper :global(hr) {
		display: block;
		height: 0;
		border: 0;
		border-top: 1px solid var(--color-slate-200);
		margin: 24px 0;
		padding: 0;
		overflow: hidden;
		background: transparent;
	}

	.markdown-render-wrapper :global(ul),
	.markdown-render-wrapper :global(ol) {
		margin-block-start: 0;
		margin-block-end: 1em;
		padding-inline-start: 2em;
	}
	.markdown-render-wrapper :global(ol) {
		list-style-type: decimal;
	}
	.markdown-render-wrapper :global(ul) {
		list-style-type: disc;
	}
	.markdown-render-wrapper :global(li) {
		margin-bottom: 0.25em;
	}
	.markdown-render-wrapper :global(ul ul),
	.markdown-render-wrapper :global(ul ol),
	.markdown-render-wrapper :global(ol ul),
	.markdown-render-wrapper :global(ol ol) {
		margin-block-start: 0.25em;
		margin-block-end: 0.25em;
	}
	.markdown-render-wrapper :global(li > p) {
		margin-block-start: 0;
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
		.markdown-render-wrapper {
			color: var(--color-slate-300);
		}

		.markdown-render-wrapper :global(h1),
		.markdown-render-wrapper :global(h2),
		.markdown-render-wrapper :global(h3),
		.markdown-render-wrapper :global(h4),
		.markdown-render-wrapper :global(h5),
		.markdown-render-wrapper :global(h6) {
			border-bottom-color: var(--color-slate-700);
			color: var(--color-slate-100);
		}
		.markdown-render-wrapper :global(h6) {
			color: var(--color-slate-400);
		}

		.markdown-render-wrapper :global(a) {
			color: var(--color-blue-400);
		}
		.markdown-render-wrapper :global(a:hover) {
			color: var(--color-blue-300);
		}

		.markdown-render-wrapper :global(blockquote) {
			color: var(--color-slate-400);
			background-color: var(--color-slate-800);
			border-left-color: var(--color-slate-600);
		}

		.markdown-render-wrapper :global(code:not(pre code)) {
			background-color: var(--color-slate-700);
			color: var(--color-pink-400);
		}

		.markdown-render-wrapper :global(.code-block-container) {
			background-color: var(--color-slate-800);
			border-color: var(--color-slate-700);
		}

		.markdown-render-wrapper :global(.code-block-header) {
			background-color: var(--color-slate-700);
			border-bottom-color: var(--color-slate-600);
		}

		.markdown-render-wrapper :global(.code-lang-label) {
			color: var(--color-slate-400);
		}

		.markdown-render-wrapper :global(.copy-code-button) {
			background-color: var(--color-slate-600);
			color: var(--color-slate-300);
			border-color: var(--color-slate-500);
		}
		.markdown-render-wrapper :global(.copy-code-button:hover) {
			background-color: var(--color-slate-500);
			border-color: var(--color-slate-400);
		}
		.markdown-render-wrapper :global(.copy-code-button.copied) {
			background-color: var(--color-green-600);
			color: var(--color-green-100);
			border-color: var(--color-green-700);
		}

		.markdown-render-wrapper :global(hr) {
			border-top-color: var(--color-slate-700);
		}
	}
</style>

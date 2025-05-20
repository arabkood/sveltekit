<script lang="ts">
	import { i18n } from '$i18n/i18n'; // Assuming this path is correct
	import hljs from 'highlight.js';

	function escapeHtmlForContent(unsafe: string): string {
		if (typeof unsafe !== 'string') return '';
		return unsafe
			.replace(/&/g, '&')
			.replace(/</g, '<')
			.replace(/>/g, '>')
			.replace(/"/g, '"')
			.replace(/'/g, "'");
	}

	function escapeRegExp(string: string): string {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	// --- Configuration for the input placeholder ---
	const INPUT_PLACEHOLDER_REGEX = /__@@INPUT@@__/g;
	const UNIQUE_INPUT_START_MARKER_PREFIX = '___UISTART_';
	const UNIQUE_INPUT_END_MARKER_PREFIX = '___UIEND_';
	const EMPTY_SLOT_TEXT_MARKER = '___EMPTYSLOTTEXT___';
	const INPUT_SLOT_CLASS = 'cb-input-slot';
	const EMPTY_SLOT_MODIFIER_CLASS = 'cb-empty-slot';
	// --- End Configuration ---

	let {
		code = '',
		lang = '',
		showHeader = true,
		showCopyButton = true,
		codeOutput,
		userInput = []
	}: {
		code?: string;
		lang?: string;
		showHeader?: boolean;
		showCopyButton?: boolean;
		codeOutput?: string;
		userInput?: string[];
	} = $props();

	const arabicRegex = /^[\u0600-\u06FF]/;

	function generateCodeBlockHtmlString(
		rawCode: string,
		language: string,
		pShowHeader: boolean,
		pShowCopyButton: boolean,
		pCodeOutput: string | undefined,
		pUserInputs: string[]
	): string {
		const isArabic: boolean = arabicRegex.test(rawCode);
		const direction: 'ltr' | 'rtl' = isArabic ? 'rtl' : 'ltr';
		const containerClass: string = `cb-container ${isArabic ? ' rtl-code' : ''}`;

		let actualLangLabelHtml = '';
		if (language) {
			actualLangLabelHtml = `<div class='cb-lang-label'>${language.toUpperCase()}</div>`;
		}

		let actualCopyButtonHtml = '';
		if (pShowCopyButton) {
			actualCopyButtonHtml = `<button class='cb-copy-button' title='${escapeHtmlForContent(i18n.t('common.copy'))}'>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' width='16' height='16'>
					<path d='M7 3.5A1.5 1.5 0 0 1 8.5 2h5A1.5 1.5 0 0 1 15 3.5v5A1.5 1.5 0 0 1 13.5 10h-5A1.5 1.5 0 0 1 7 8.5v-5Zm1.5-.5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-5Z'/>
	  				<path d='M2.5 6A1.5 1.5 0 0 0 1 7.5v8A1.5 1.5 0 0 0 2.5 17h8a1.5 1.5 0 0 0 1.5-1.5V15a.5.5 0 0 1 1 0v.5A2.5 2.5 0 0 1 10.5 18h-8A2.5 2.5 0 0 1 0 15.5v-8A2.5 2.5 0 0 1 2.5 5H5a.5.5 0 0 1 0 1H2.5Z'/>
				</svg>
				<span class='cb-copy-status'>${escapeHtmlForContent(i18n.t('common.copy'))}</span>
			</button>`;
		}

		let headerHtml = '';
		if (pShowHeader) {
			const headerElementsCombined = `${actualLangLabelHtml}${actualCopyButtonHtml}`;
			if (headerElementsCombined.trim() !== '') {
				headerHtml = `<div class='cb-header'>
								${actualLangLabelHtml}
								${actualCopyButtonHtml}
							  </div>`;
			}
		}

		let codeForHighlighting: string;
		let inputIndex = 0;
		const inputSlotData: { markerSuffix: string; isEmpty: boolean }[] = [];

		codeForHighlighting = rawCode.replace(INPUT_PLACEHOLDER_REGEX, () => {
			const markerSuffix = inputIndex + '___';
			const startMarker = UNIQUE_INPUT_START_MARKER_PREFIX + markerSuffix;
			const endMarker = UNIQUE_INPUT_END_MARKER_PREFIX + markerSuffix;
			const currentUserInput = pUserInputs[inputIndex];
			const isEmpty = !(currentUserInput !== undefined && currentUserInput.trim() !== '');

			inputSlotData.push({ markerSuffix, isEmpty });
			inputIndex++;

			if (!isEmpty) {
				return startMarker + currentUserInput + endMarker; // Pass raw input for hljs
			} else {
				return startMarker + EMPTY_SLOT_TEXT_MARKER + endMarker;
			}
		});

		let codeHtmlContent: string;
		if (language && hljs.getLanguage(language)) {
			try {
				codeHtmlContent = hljs.highlight(codeForHighlighting, {
					language: language,
					ignoreIllegals: true
				}).value;
			} catch (error) {
				console.error('Highlight.js error:', error);
				codeHtmlContent = escapeHtmlForContent(codeForHighlighting); // Fallback
			}
		} else {
			codeHtmlContent = escapeHtmlForContent(codeForHighlighting); // No language, just escape
		}

		// Post-highlighting replacements
		const i18nEmptyText = i18n.t('lessons.yourAnswerHere'); // Get this once

		// 1. Replace the internal empty slot text marker with localized text
		// (This text will be inside the final styled span)
		const emptyTextMarkerRegex = new RegExp(escapeRegExp(EMPTY_SLOT_TEXT_MARKER), 'g');
		codeHtmlContent = codeHtmlContent.replace(
			emptyTextMarkerRegex,
			escapeHtmlForContent(i18nEmptyText)
		);

		// 2. Replace start/end markers with actual styled spans
		for (const slot of inputSlotData) {
			const startMarkerRegex = new RegExp(
				escapeRegExp(UNIQUE_INPUT_START_MARKER_PREFIX + slot.markerSuffix),
				'g'
			);
			const endMarkerRegex = new RegExp(
				escapeRegExp(UNIQUE_INPUT_END_MARKER_PREFIX + slot.markerSuffix),
				'g'
			);

			const slotClasses = slot.isEmpty
				? `${INPUT_SLOT_CLASS} ${EMPTY_SLOT_MODIFIER_CLASS}`
				: INPUT_SLOT_CLASS;
			const titleAttribute = slot.isEmpty ? `title="${escapeHtmlForContent(i18nEmptyText)}"` : '';

			codeHtmlContent = codeHtmlContent.replace(
				startMarkerRegex,
				`<span class="${slotClasses}" ${titleAttribute}>`
			);
			codeHtmlContent = codeHtmlContent.replace(endMarkerRegex, `</span>`);
		}

		const langClass = language ? `language-${language}` : '';

		let outputSectionHtml = '';
		if (pCodeOutput !== undefined && pCodeOutput !== null) {
			const trimmedOutput = pCodeOutput.trim();
			if (trimmedOutput !== '') {
				// Use the safer escaper for code output
				const escapedOutput = escapeHtmlForContent(trimmedOutput);
				outputSectionHtml = `
					<div class='cb-output-section'>
						<div class='cb-output-header'>Output</div>
						<pre class='cb-output-content' dir='${direction}'>${escapedOutput}</pre>
					</div>`;
			}
		}

		return `<div class='${containerClass}'>
					${headerHtml}
					<pre dir='${direction}'><code class='hljs ${langClass}'>${codeHtmlContent}</code></pre>
					${outputSectionHtml}
				</div>`;
	}

	const renderedHtml: string = $derived(
		generateCodeBlockHtmlString(code, lang, showHeader, showCopyButton, codeOutput, userInput)
	);

	function handleCopyCode(event: MouseEvent) {
		const target = event.target as HTMLElement;
		const button = target.closest('.cb-copy-button');

		if (button) {
			const container = button.closest('.cb-container');
			if (container) {
				const codeElement = container.querySelector('pre code');
				if (codeElement) {
					// Create a temporary element to correctly get text content without our markers
					// if they somehow failed to replace, or to preserve formatting from hljs spans
					const tempDiv = document.createElement('div');
					tempDiv.innerHTML = codeElement.innerHTML; // Get innerHTML which has hljs spans

					// Remove our specific input slot spans to get cleaner text for copy
					tempDiv.querySelectorAll(`.${INPUT_SLOT_CLASS}`).forEach((el) => {
						// Replace the span with its own text content
						el.replaceWith(el.textContent || '');
					});

					let codeToCopy = tempDiv.textContent || '';

					// Fallback if textContent is empty but original codeElement had text
					if (!codeToCopy && codeElement.textContent) {
						codeToCopy = codeElement.textContent;
					}

					navigator.clipboard
						.writeText(codeToCopy)
						.then(() => {
							const copyStatus = button.querySelector('.cb-copy-status');
							if (copyStatus)
								copyStatus.textContent = escapeHtmlForContent(i18n.t('common.copied'));
							button.classList.add('copied');
							setTimeout(() => {
								if (copyStatus)
									copyStatus.textContent = escapeHtmlForContent(i18n.t('common.copy'));
								button.classList.remove('copied');
							}, 2000);
						})
						.catch((err) => {
							console.error('Failed to copy code: ', err);
							const copyStatus = button.querySelector('.cb-copy-status');
							if (copyStatus) copyStatus.textContent = escapeHtmlForContent(i18n.t('common.error'));
						});
				}
			}
		}
	}
</script>

<div role="none" class="svelte-code-block-host" onclick={handleCopyCode}>
	{@html renderedHtml}
</div>

<style>
	/* Existing styles ... */
	.svelte-code-block-host :global(.cb-container) {
		position: relative;
		background-color: var(--cb-bg, var(--color-gray-50, #f8fafc));
		border: 1px solid var(--cb-border-color, var(--color-gray-200, #e2e8f0));
		border-radius: 6px;
		overflow: hidden;
	}

	.svelte-code-block-host :global(.cb-header) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.4em 0.8em;
		background-color: var(--cb-header-bg, var(--color-gray-100, #f1f5f9));
		border-bottom: 1px solid var(--cb-header-border-color, var(--color-gray-200, #e2e8f0));
		font-size: 0.8em;
		font-family: var(--font-sans, ui-sans-serif, system-ui, sans-serif);
	}
	.svelte-code-block-host :global(.cb-container.rtl-code .cb-header) {
		flex-direction: row-reverse;
	}

	.svelte-code-block-host :global(.cb-lang-label) {
		color: var(--cb-lang-label-text, var(--color-gray-600, #475569));
		font-weight: 500;
		user-select: none;
	}

	.svelte-code-block-host :global(.cb-copy-button) {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		background-color: var(--cb-copy-btn-bg, var(--color-gray-200, #e2e8f0));
		color: var(--cb-copy-btn-text, var(--color-gray-700, #334155));
		border: 1px solid var(--cb-copy-btn-border, var(--color-gray-300, #cbd5e1));
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
	.svelte-code-block-host :global(.cb-copy-button svg) {
		vertical-align: middle;
		fill: currentColor;
	}
	.svelte-code-block-host :global(.cb-copy-button:hover) {
		background-color: var(--cb-copy-btn-hover-bg, var(--color-gray-300, #cbd5e1));
		border-color: var(--cb-copy-btn-hover-border, var(--color-gray-400, #94a3b8));
	}
	.svelte-code-block-host :global(.cb-copy-button.copied) {
		background-color: var(--cb-copy-btn-copied-bg, var(--color-green-500, #22c55e));
		color: var(--cb-copy-btn-copied-text, var(--color-white, #ffffff));
		border-color: var(--cb-copy-btn-copied-border, var(--color-green-600, #16a34a));
	}

	.svelte-code-block-host :global(pre) {
		margin: 0;
		overflow-x: auto;
		font-family: var(
			--font-mono,
			ui-monospace,
			SFMono-Regular,
			Menlo,
			Monaco,
			Consolas,
			'Liberation Mono',
			'Courier New',
			monospace
		);
		font-size: 0.9em;
		line-height: 1.45;
		color: var(--cb-code-text, var(--color-gray-700, #334155));
	}
	.svelte-code-block-host :global(pre[dir='rtl']) {
		text-align: right;
	}
	.svelte-code-block-host :global(pre[dir='ltr']) {
		text-align: left;
	}

	.svelte-code-block-host :global(pre code.hljs) {
		display: block;
		padding: 1em;
		background: transparent;
	}

	/* Styles for the input slot (both filled and empty states) */
	.svelte-code-block-host :global(.cb-input-slot) {
		display: inline; /* Allow it to flow with text but still apply some styles */
		background-color: var(--cb-input-slot-bg, rgba(0, 0, 0, 0.05)); /* Subtle background */
		padding: 0.05em 0.2em; /* Minimal padding */
		border-radius: 3px;
		box-shadow: inset 0 0 0 1px var(--cb-input-slot-border, rgba(0, 0, 0, 0.1)); /* Subtle inset border */
		/* font-family: inherit; /* Inherits from pre code */
		/* font-size: inherit; /* Inherits from pre code */
		/* line-height: inherit; /* Inherits */
		/* color: inherit; /* Inherits, hljs will color content */
	}

	/* Specific styles for an empty input slot */
	.svelte-code-block-host :global(.cb-input-slot.cb-empty-slot) {
		background-color: var(--cb-empty-input-slot-bg, var(--color-gray-200, #e2e8f0));
		border: 1px dashed var(--cb-empty-input-slot-border, var(--color-gray-400, #94a3b8));
		color: var(
			--cb-empty-input-slot-text,
			var(--color-gray-500, #64748b)
		); /* Text color for "Your answer here" */
		padding: 0.05em 0.4em; /* May need slightly more padding for empty text */
		box-shadow: none; /* Override general input slot shadow if not desired for empty */
	}
	.svelte-code-block-host :global(.cb-input-slot.cb-empty-slot *) {
		/* If hljs wraps the placeholder text in its own spans, ensure they inherit the placeholder color */
		color: inherit !important;
		background-color: transparent !important;
	}

	.svelte-code-block-host :global(.cb-output-section) {
		border-top: 1px solid var(--cb-output-border-color, var(--color-gray-200, #e2e8f0));
	}
	.svelte-code-block-host :global(.cb-output-header) {
		padding: 0.4em 0.8em;
		background-color: var(--cb-output-header-bg, var(--color-gray-100, #f1f5f9));
		font-size: 0.8em;
		font-family: var(--font-sans, ui-sans-serif, system-ui, sans-serif);
		color: var(--cb-output-header-text, var(--color-gray-600, #475569));
		font-weight: 500;
		user-select: none;
	}
	/* ... rest of your styles ... */

	@media (prefers-color-scheme: dark) {
		/* ... existing dark mode styles ... */
		.svelte-code-block-host :global(.cb-container) {
			background-color: var(--cb-bg-dark, var(--color-gray-800, #1e293b));
			border-color: var(--cb-border-color-dark, var(--color-gray-700, #334155));
		}

		.svelte-code-block-host :global(.cb-header) {
			background-color: var(--cb-header-bg-dark, var(--color-gray-700, #334155));
			border-bottom-color: var(--cb-header-border-color-dark, var(--color-gray-600, #475569));
		}

		.svelte-code-block-host :global(.cb-lang-label) {
			color: var(--cb-lang-label-text-dark, var(--color-gray-400, #94a3b8));
		}

		.svelte-code-block-host :global(.cb-copy-button) {
			background-color: var(--cb-copy-btn-bg-dark, var(--color-gray-600, #475569));
			color: var(--cb-copy-btn-text-dark, var(--color-gray-300, #cbd5e1));
			border-color: var(--cb-copy-btn-border-dark, var(--color-gray-500, #64748b));
		}
		.svelte-code-block-host :global(.cb-copy-button:hover) {
			background-color: var(--cb-copy-btn-hover-bg-dark, var(--color-gray-500, #64748b));
			border-color: var(--cb-copy-btn-hover-border-dark, var(--color-gray-400, #94a3b8));
		}
		.svelte-code-block-host :global(.cb-copy-button.copied) {
			background-color: var(--cb-copy-btn-copied-bg-dark, var(--color-green-600, #16a34a));
			color: var(--cb-copy-btn-copied-text-dark, var(--color-green-100, #dcfce7));
			border-color: var(--cb-copy-btn-copied-border-dark, var(--color-green-700, #15803d));
		}
		.svelte-code-block-host :global(pre) {
			color: var(--cb-code-text-dark, var(--color-gray-300, #cbd5e1));
		}

		/* Dark mode for input slots */
		.svelte-code-block-host :global(.cb-input-slot) {
			background-color: var(--cb-input-slot-bg-dark, rgba(255, 255, 255, 0.08));
			box-shadow: inset 0 0 0 1px var(--cb-input-slot-border-dark, rgba(255, 255, 255, 0.15));
		}

		.svelte-code-block-host :global(.cb-input-slot.cb-empty-slot) {
			background-color: var(--cb-empty-input-slot-bg-dark, var(--color-gray-700, #334155));
			border-color: var(--cb-empty-input-slot-border-dark, var(--color-gray-500, #64748b));
			color: var(--cb-empty-input-slot-text-dark, var(--color-gray-400, #94a3b8));
		}
		.svelte-code-block-host :global(.cb-input-slot.cb-empty-slot *) {
			/* Ensure hljs spans inside empty slot also use placeholder color in dark mode */
			color: inherit !important;
			background-color: transparent !important;
		}

		.svelte-code-block-host :global(.cb-output-section) {
			border-top-color: var(--cb-output-border-color-dark, var(--color-gray-700, #334155));
		}
		.svelte-code-block-host :global(.cb-output-header) {
			background-color: var(--cb-output-header-bg-dark, var(--color-gray-700, #334155));
			color: var(--cb-output-header-text-dark, var(--color-gray-400, #94a3b8));
		}
	}
</style>

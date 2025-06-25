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
	const INPUT_PLACEHOLDER_REGEX = /@@INPUT@@/g;
	const UNIQUE_INPUT_START_MARKER_PREFIX = '___UISTART_';
	const UNIQUE_INPUT_END_MARKER_PREFIX = '___UIEND_';
	const EMPTY_SLOT_TEXT_MARKER = '___EMPTYSLOTTEXT___';
	const INPUT_SLOT_CLASS = 'cb-input-slot';
	const EMPTY_SLOT_MODIFIER_CLASS = 'cb-empty-slot';
	// --- End Configuration ---

	let {
		code = '',
		lang = '',
		codeOutput,
		userInput = []
	}: {
		code?: string;
		lang?: string;
		codeOutput?: string;
		userInput?: string[];
	} = $props();

	const arabicRegex = /^[\u0600-\u06FF]/;

	function generateCodeBlockHtmlString(
		rawCode: string,
		language: string,
		pCodeOutput: string | undefined,
		pUserInputs: string[]
	): string {
		const isArabic: boolean = arabicRegex.test(rawCode);
		const direction: 'ltr' | 'rtl' = isArabic ? 'rtl' : 'ltr';
		const containerClass: string = `cb-container ${isArabic ? ' rtl-code' : ''}`;

		let headerHtml = '';
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
					<pre class="code-body" dir='${direction}'><code class='hljs ${langClass}'>${codeHtmlContent}</code></pre>
					${outputSectionHtml}
				</div>`;
	}

	const renderedHtml: string = $derived(
		generateCodeBlockHtmlString(code, lang, codeOutput, userInput)
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html renderedHtml}

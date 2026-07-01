<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import hljs from 'highlight.js';

	interface Props {
		code?: string;
		lang?: string;
		codeOutput?: string;
		interactive?: boolean;
		userInput?: string[];
		userAnswers?: string[];
		incorrectIndexes?: number[];
		disabled?: boolean;
		focusInput?: number;
		onsubmit?: () => void;
	}

	let {
		code = '',
		lang = '',
		codeOutput = '',
		interactive = false,
		userInput = [],
		userAnswers = $bindable([]),
		incorrectIndexes = [],
		disabled = false,
		focusInput,
		onsubmit
	}: Props = $props();

	const i18nEmptyText: string = i18n.t('lessons.answerHere');
	let inputs: HTMLInputElement[] = [];

	$effect(() => {
		if (focusInput !== undefined) {
			inputs[focusInput]?.focus();
		}
	});

	function escapeHtml(unsafe: string): string {
		return unsafe
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function highlightSnippet(snippet: string, lang: string): string {
		if (snippet === '') return '';
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(snippet, { language: lang, ignoreIllegals: true }).value;
			} catch (e) {
				console.error('Highlight.js error on snippet:', e);
			}
		}
		return escapeHtml(snippet);
	}

	interface InteractiveData {
		interactive: true;
		highlightedSnippets: string[];
		inputCount: number;
	}

	function generateInteractiveData(code: string, lang: string): InteractiveData {
		const codeSnippets = code.split('@@INPUT@@');
		const highlightedSnippets = codeSnippets.map((snippet) => highlightSnippet(snippet, lang));
		return {
			interactive: true as const,
			highlightedSnippets,
			inputCount: codeSnippets.length - 1
		};
	}

	interface StaticData {
		interactive: false;
		staticHtml: string;
	}

	function generateStaticData(code: string, lang: string, userInput: string[]): StaticData {
		const START_MARKER = (i: number): string => `___S${i}S___`;
		const END_MARKER = (i: number): string => `___E${i}E___`;

		let inputCount = 0;
		const codeToHighlight = code.replace(/@@INPUT@@/g, () => {
			const currentInput = userInput[inputCount] ?? '';
			const content = currentInput.trim() === '' ? i18nEmptyText : currentInput;
			return START_MARKER(inputCount++) + content + END_MARKER(inputCount - 1);
		});

		let highlightedContent = highlightSnippet(codeToHighlight, lang);

		for (let i = 0; i < inputCount; i++) {
			const isEmpty = (userInput[i] ?? '').trim() === '';
			const slotClasses = `cb-input-slot ${isEmpty ? 'cb-empty-slot' : ''}`.trim();
			const titleAttribute = isEmpty ? `title="${escapeHtml(i18nEmptyText)}"` : '';
			const startTag = `<span class="${slotClasses}" ${titleAttribute}>`;
			highlightedContent = highlightedContent.replaceAll(START_MARKER(i), startTag);
			highlightedContent = highlightedContent.replaceAll(END_MARKER(i), '</span>');
		}
		return { interactive: false as const, staticHtml: highlightedContent };
	}

	interface CommonRenderData {
		direction: 'ltr' | 'rtl';
		langClass: string;
		containerClass: string;
		outputHtml: string;
	}

	type RenderData =
		(CommonRenderData & InteractiveData) | { interactive: false; staticHtml: string };

	const renderData: RenderData = $derived.by(() => {
		const isRtl = /^[\u0600-\u06FF]/.test(code);
		const direction: 'ltr' | 'rtl' = isRtl ? 'rtl' : 'ltr';
		const containerClass = `cb-container ${isRtl ? 'rtl-code' : ''}`.trim();

		const commonData: CommonRenderData = {
			direction,
			langClass: lang ? `language-${lang}` : '',
			containerClass,
			outputHtml:
				codeOutput && codeOutput.trim()
					? `<div class='cb-output-section'>
						<div class='cb-output-header'>Output</div>
						<pre class='cb-output-content' dir='${direction}'>${escapeHtml(codeOutput.trim())}</pre>
					</div>`
					: ''
		};

		const modeData = interactive
			? generateInteractiveData(code, lang)
			: generateStaticData(code, lang, userInput);

		if (modeData.interactive) {
			return { ...commonData, ...modeData };
		} else {
			const fullStaticHtml = `<div class='${commonData.containerClass}'>
				<pre class="code-body" dir='${commonData.direction}'><code class='hljs ${commonData.langClass}'>${modeData.staticHtml}</code></pre>
				${commonData.outputHtml}
			</div>`;
			return { interactive: false, staticHtml: fullStaticHtml };
		}
	});

	function handleKeyDown(event: KeyboardEvent, index: number): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			const isLastInput = index === (renderData as InteractiveData).inputCount - 1;

			if (isLastInput) {
				onsubmit?.();
			} else {
				inputs[index + 1]?.focus();
			}
		}
	}
</script>

{#if renderData.interactive}
	<div class={renderData.containerClass}>
		<pre class="code-body" dir={renderData.direction}><code class="hljs {renderData.langClass}"
				><!-- eslint-disable-next-line svelte/no-at-html-tags --><!--
			-->{#each renderData.highlightedSnippets as snippet, i (i)}{@html snippet}{#if i < renderData.inputCount}<span
							class="cb-input-wrapper"
							><input
								type="text"
								class="cb-input"
								class:incorrect={incorrectIndexes.includes(i)}
								bind:value={userAnswers[i]}
								bind:this={inputs[i]}
								{disabled}
								placeholder={i18nEmptyText}
								style="width: {Math.max(10, (userAnswers[i]?.length ?? 0) + 2)}ch;"
								onkeydown={(e) => handleKeyDown(e, i)}
								spellcheck="false"
								autocomplete="off"
							/></span
						>{/if}{/each}<!--
		--></code
			></pre>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html renderData.outputHtml}
	</div>
{:else}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html renderData.staticHtml}
{/if}

<style>
	.cb-input-wrapper {
		display: inline-block;
		vertical-align: bottom;
		margin: 2px 2px;
	}
	.cb-input {
		background-color: rgba(0, 0, 100, 0.05);
		border: 1px solid rgba(0, 0, 100, 0.2);
		color: #000;
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
		border-radius: 4px;
		padding: 0 6px;
		min-width: 10ch;
		transition:
			border-color 0.2s,
			box-shadow 0.2s,
			width 0.2s ease-in-out;
		outline: none;
	}
	.cb-input::placeholder {
		color: rgba(0, 0, 0, 0.6);
		opacity: 1;
		text-align: center;
	}
	.cb-input:focus {
		border-color: var(--color-sky-400);
		box-shadow: 0 0 0 2px rgba(100, 165, 255, 0.5);
	}
	.cb-input.incorrect {
		border-color: var(--color-red-400);
		background-color: rgba(255, 0, 0, 0.05);
	}
	.cb-input:disabled {
		background-color: rgba(0, 0, 0, 0.05);
		border-color: rgba(0, 0, 0, 0.1);
		cursor: not-allowed;
	}

	/*@media (prefers-color-scheme: dark) {*/
	.cb-input {
		background-color: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: #fff;
	}
	.cb-input::placeholder {
		color: rgba(255, 255, 255, 0.4);
	}
	.cb-input.incorrect {
		border-color: var(--color-red-400);
		background-color: rgba(255, 77, 77, 0.1);
	}
	.cb-input:disabled {
		background-color: rgba(128, 128, 128, 0.1);
		border-color: rgba(128, 128, 128, 0.2);
	}
	/*}*/
</style>

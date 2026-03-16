import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const monacoConfig: Monaco.editor.IStandaloneEditorConstructionOptions = {
	automaticLayout: true,
	minimap: { enabled: false },
	fontSize: 16,
	fontFamily: 'var(--font-mono)',
	lineNumbers: 'on',
	folding: true,
	lineHeight: 24,
	padding: { top: 16, bottom: 16 },
	scrollBeyondLastLine: false,
	cursorBlinking: 'smooth',
	wordWrap: 'on',
	formatOnPaste: true,
	formatOnType: true,
	suggestOnTriggerCharacters: true,
	acceptSuggestionOnEnter: 'on',
	tabSize: 2,
	quickSuggestions: { other: true, comments: false, strings: false },
	bracketPairColorization: { enabled: true },
	guides: { bracketPairs: true },
	hover: { enabled: true, delay: 500, sticky: true, above: true },
	suggest: {
		snippetsPreventQuickSuggestions: false,
		showIcons: true,
		selectionMode: 'always'
	},
	smoothScrolling: true,
	autoClosingBrackets: 'languageDefined',
	autoClosingQuotes: 'languageDefined',
	mouseWheelZoom: true,
	scrollbar: {
		vertical: 'visible',
		horizontal: 'visible',
		verticalScrollbarSize: 14,
		horizontalScrollbarSize: 14
	},
	lineNumbersMinChars: 3,
	fixedOverflowWidgets: true,
	overviewRulerBorder: false,
	suggestSelection: 'first'
};

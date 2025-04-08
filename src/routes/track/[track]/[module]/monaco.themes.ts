import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const defineMonacoThemes = (monaco: typeof Monaco) => {
	// Enhanced Light Theme (Emerald Focus)
	monaco.editor.defineTheme('kood-light', {
		base: 'vs',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '#64748b', fontStyle: 'italic' },
			{ token: 'keyword', foreground: '#059669', fontStyle: 'bold' }, // Emerald-700
			{ token: 'string', foreground: '#dc2626', background: '#fef2f2' }, // Red-600 with subtle bg
			{ token: 'number', foreground: '#065f46' }, // Dark Emerald-800
			{ token: 'type', foreground: '#3b82f6' }, // Blue-600
			{ token: 'function', foreground: '#ea580c', fontStyle: 'bold' }, // Orange-600
			{ token: 'variable', foreground: '#0e7490' }, // Cyan-700
			{ token: 'operator', foreground: '#059669' }, // Emerald-700
			{ token: 'delimiter', foreground: '#475569' }, // Slate-600
			{ token: 'tag', foreground: '#065f46' }, // Emerald-800
			{ token: 'attribute.name', foreground: '#059669' }, // Emerald-700
			{ token: 'error', foreground: '#ef4444', background: '#fef2f2' }, // Red-500
			{ token: 'warning', foreground: '#eab308', background: '#fefce8' }, // Yellow-500
			{ token: 'regexp', foreground: '#db2777' } // Pink-600
		],
		colors: {
			'editor.background': '#ffffff', // Lighter Slate-50
			'editor.foreground': '#000000', // Slate-800
			'editor.lineHighlightBackground': '#f1f5f9', // Slate-100
			'editorCursor.foreground': '#059669', // Emerald-700
			'editor.selectionBackground': '#a7f3d0', // Emerald-200
			'editor.inactiveSelectionBackground': '#d1fae5', // Emerald-100
			'editorLineNumber.foreground': '#94a3b8', // Slate-400
			'editorLineNumber.activeForeground': '#059669', // Emerald-700
			'editorBracketMatch.background': '#d1fae5', // Emerald-100
			'editorBracketMatch.border': '#059669', // Emerald-700
			'editorIndentGuide.background': '#e2e8f0', // Slate-200
			'editorIndentGuide.activeBackground': '#cbd5e1', // Slate-300
			'editorSuggestWidget.background': '#ffffff',
			'editorHoverWidget.background': '#f8fafc', // Slate-50
			'editorError.foreground': '#ef4444', // Red-500
			'editorWarning.foreground': '#eab308' // Yellow-500
		}
	});

	// Enhanced Dark Theme (Emerald Glow)
	monaco.editor.defineTheme('kood-dark', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '#94a3b8', fontStyle: 'italic' },
			{ token: 'keyword', foreground: '#10b981', fontStyle: 'bold' }, // Emerald-500
			{ token: 'string', foreground: '#fca5a5', background: '#450a0a' }, // Red-300
			{ token: 'number', foreground: '#6ee7b7' }, // Emerald-300
			{ token: 'type', foreground: '#60a5fa' }, // Blue-400
			{ token: 'function', foreground: '#fdba74', fontStyle: 'bold' }, // Orange-300
			{ token: 'variable', foreground: '#5eead4' }, // Teal-300
			{ token: 'operator', foreground: '#10b981' }, // Emerald-500
			{ token: 'delimiter', foreground: '#94a3b8' }, // Slate-400
			{ token: 'tag', foreground: '#6ee7b7' }, // Emerald-300
			{ token: 'attribute.name', foreground: '#10b981' }, // Emerald-500
			{ token: 'error', foreground: '#f87171', background: '#450a0a' }, // Red-400
			{ token: 'warning', foreground: '#fcd34d', background: '#451a03' }, // Yellow-300
			{ token: 'regexp', foreground: '#f472b6' } // Pink-400
		],
		colors: {
			'editor.background': '#1e2939',
			'editor.foreground': '#ffffff', // Slate-200
			'editor.lineHighlightBackground': '#1e293b', // Slate-800
			'editorCursor.foreground': '#10b981', // Emerald-500
			'editor.selectionBackground': '#05966960', // Emerald-700
			'editor.inactiveSelectionBackground': '#04785730', // Emerald-800
			'editorLineNumber.foreground': '#64748b', // Slate-500
			'editorLineNumber.activeForeground': '#6ee7b7', // Emerald-300
			'editorBracketMatch.background': '#05966930',
			'editorBracketMatch.border': '#6ee7b750',
			'editorIndentGuide.background': '#1e293b', // Slate-800
			'editorIndentGuide.activeBackground': '#334155', // Slate-700
			'editorSuggestWidget.background': '#1e293b',
			'editorHoverWidget.background': '#1e293b',
			'editorError.foreground': '#f87171', // Red-400
			'editorWarning.foreground': '#fcd34d' // Yellow-300
		}
	});
};

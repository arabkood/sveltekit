<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import { defineMonacoThemes } from './monaco.themes';
	import { monacoConfig } from './monaco.config';
	import type { EditorFile } from '$types/editor';

	let {
		files = $bindable([])
	}: {
		files: EditorFile[];
	} = $props();

	let editor: Monaco.editor.IStandaloneCodeEditor | undefined = $state();
	let monaco: typeof Monaco | undefined = $state();
	let editorContainer: HTMLElement;

	// Listen for system theme changes
	const mediaQueryListener = (e: MediaQueryListEvent) => {
		editor?.updateOptions({ theme: e.matches ? 'kood-dark' : 'kood-light' });
	};

	// onMount will run on browser only
	onMount(async () => {
		monaco = (await import('./monaco')).default;
		defineMonacoThemes(monaco);
		editor = monaco.editor.create(editorContainer, monacoConfig);

		// set intial theme and watch for changes
		const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		editor?.updateOptions({ theme: darkModeMediaQuery.matches ? 'kood-dark' : 'kood-light' });
		darkModeMediaQuery.addEventListener('change', mediaQueryListener);
		if (!monaco || !editor) return;
		const model = monaco.editor.createModel(files[0].content, 'typescript');
		editor.setModel(model);
		editor.onDidChangeModelContent(() => {
			files = [
				{
					path: files[0].path,
					content: editor?.getValue() || files[0].path
				}
			];
		});
	});

	// Clean up on component destroy
	// onDestroy runs both on server and browser
	onDestroy(() => {
		if (typeof window !== 'undefined') {
			const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			darkModeMediaQuery.removeEventListener('change', mediaQueryListener);
			monaco?.editor.getModels().forEach((model) => model.dispose());
			editor?.dispose();
		}
	});

	let loaded = $derived(!editor);
</script>

<div
	dir="ltr"
	class="h-full flex-1 overflow-auto bg-gray-100 font-mono dark:bg-gray-800"
	class:animate-[pulse_800ms_ease-in-out_0ms_infinite]={loaded}
>
	<div class="h-full w-full" bind:this={editorContainer}></div>
</div>

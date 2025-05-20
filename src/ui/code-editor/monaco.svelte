<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import { defineMonacoThemes } from './monaco.themes';
	import { monacoConfig } from './monaco.config';
	import type { CodeConfig, CodeFileConfig, CodeFiles } from '$types/code';

	let {
		files = $bindable(),
		config
	}: {
		files: CodeFiles;
		config: CodeConfig;
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
		let filteredfiles = config.files.filter((f) => f.idx >= 0).sort((a, b) => a.idx - b.idx);
		let file: CodeFileConfig & {
			content: string;
		};
		if (filteredfiles.length > 0) {
			file = {
				...filteredfiles[0],
				content: ''
			};
			if (Object.hasOwn(files, file.path)) {
				file.content = files[file.path];
			}
		} else {
			file = {
				content: '',
				idx: 0,
				lang: '',
				path: 'welcome',
				ro: false
			};
		}

		const model = monaco.editor.createModel(file.content, file.lang);
		editor.setModel(model);
		editor.onDidChangeModelContent(() => {
			files[file.path] = editor?.getValue() || file.content;
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

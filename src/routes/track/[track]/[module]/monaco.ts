import * as monaco from 'monaco-editor';

// Define async worker loaders
const getWorkers = {
	editorWorker: async () => {
		const worker = await import('monaco-editor/esm/vs/editor/editor.worker?worker');
		return new worker.default();
	},
	jsonWorker: async () => {
		const worker = await import('monaco-editor/esm/vs/language/json/json.worker?worker');
		return new worker.default();
	},
	cssWorker: async () => {
		const worker = await import('monaco-editor/esm/vs/language/css/css.worker?worker');
		return new worker.default();
	},
	htmlWorker: async () => {
		const worker = await import('monaco-editor/esm/vs/language/html/html.worker?worker');
		return new worker.default();
	},
	tsWorker: async () => {
		const worker = await import('monaco-editor/esm/vs/language/typescript/ts.worker?worker');
		return new worker.default();
	}
};

// Configure the worker
self.MonacoEnvironment = {
	getWorker: async function (_: string, label: string) {
		switch (label) {
			case 'json':
				// return await getWorkers.jsonWorker();
				return await getWorkers.editorWorker();
			case 'css':
			case 'scss':
			case 'less':
				// return await getWorkers.cssWorker();
				return await getWorkers.editorWorker();
			case 'html':
			case 'handlebars':
			case 'razor':
				// return await getWorkers.htmlWorker();
				return await getWorkers.editorWorker();
			case 'typescript':
			case 'javascript':
				return await getWorkers.tsWorker();
			default:
				return await getWorkers.editorWorker();
		}
	}
};

export default monaco;

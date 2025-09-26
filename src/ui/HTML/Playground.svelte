<script>
	// Svelte 5 runes for reactivity
	let activeTab = $state('html');

	// 1. The core state: the code in each textarea
	let htmlCode = $state(`<h1>Hello, World!</h1>
<p>This is a live preview.</p>
<button>Click Me</button>`);

	let cssCode = $state(`body {
  font-family: sans-serif;
  color: #333;
}
h1 {
  color: #ff3e00;
}
button {
  background: #ff3e00;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #c73100;
}`);

	let jsCode = $state(`const button = document.querySelector('button');
const h1 = document.querySelector('h1');

let count = 0;

button.addEventListener('click', () => {
  count++;
  h1.textContent = \`You clicked \${count} times!\`;
});`);

	// 2. The derived state: the preview document
	// This automatically recalculates whenever htmlCode, cssCode, or jsCode changes.
	const srcDoc = $derived(`
		<html>
			<head>
				<style>${cssCode}</style>
			</head>
			<body>
				${htmlCode}
				<script>${jsCode}<\/script> 
				<!-- Note: <\/script> is used to prevent the browser from thinking this string closes the main Svelte script tag -->
			</body>
		</html>
	`);
</script>

<div class="editor-layout">
	<!-- Editor Side -->
	<div class="editor-pane">
		<div class="tabs">
			<button class:active={activeTab === 'html'} onclick={() => (activeTab = 'html')}>
				HTML
			</button>
			<button class:active={activeTab === 'css'} onclick={() => (activeTab = 'css')}> CSS </button>
			<button class:active={activeTab === 'js'} onclick={() => (activeTab = 'js')}>
				JavaScript
			</button>
		</div>

		<div class="code-area">
			{#if activeTab === 'html'}
				<textarea bind:value={htmlCode} spellcheck="false"></textarea>
			{:else if activeTab === 'css'}
				<textarea bind:value={cssCode} spellcheck="false"></textarea>
			{:else if activeTab === 'js'}
				<textarea bind:value={jsCode} spellcheck="false"></textarea>
			{/if}
		</div>
	</div>

	<!-- Preview Side -->
	<div class="preview-pane">
		<iframe title="Live Preview" sandbox="allow-scripts allow-modals" srcdoc={srcDoc}></iframe>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	.editor-layout {
		display: grid;
		grid-template-columns: 1fr 1fr; /* Two equal columns */
		height: 100vh;
		width: 100vw;
		background: #f4f4f4;
	}

	.editor-pane {
		display: flex;
		flex-direction: column;
		height: 100%;
		border-right: 2px solid #ddd;
	}

	.tabs {
		display: flex;
		background: #e0e0e0;
	}

	.tabs button {
		padding: 10px 20px;
		border: none;
		background: #e0e0e0;
		cursor: pointer;
		font-size: 16px;
		border-bottom: 3px solid transparent;
	}

	.tabs button.active {
		background: #fff;
		border-bottom: 3px solid #ff3e00;
		font-weight: bold;
	}

	.code-area {
		flex-grow: 1;
		background: #2d2d2d;
	}

	textarea {
		width: 100%;
		height: 100%;
		border: none;
		padding: 1rem;
		font-family: 'Fira Code', 'Courier New', Courier, monospace;
		font-size: 16px;
		line-height: 1.5;
		color: #e3e3e3;
		background: transparent;
		resize: none;
		outline: none;
		box-sizing: border-box; /* Important for padding */
	}

	.preview-pane {
		height: 100%;
		background: #fff;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>

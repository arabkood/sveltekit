<script lang="ts">
	import type { UserSubmission } from '$lib/server/db/repos/class';

	// Components
	import Problem from '$ui/code-editor/Problem.svelte';
	import CodeEditor from '$ui/code-editor/monaco.svelte';
	import ActionBar from '$ui/code-editor/ActionBar.svelte';
	import Loading from '$ui/code-editor/Loading.svelte';
	import Tabs from '$ui/tabs/Tabs.svelte';
	import TabList from '$ui/tabs/TabList.svelte';
	import Tab from '$ui/tabs/Tab.svelte';
	import TabPanel from '$ui/tabs/TabPanel.svelte';
	import InputPanel from '$ui/code-editor/InputPanel.svelte';
	import OutputPanel from '$ui/code-editor/OutputPanel.svelte';
	import ResultsPanel from '$ui/code-editor/ResultsPanel.svelte';

	// --- Props ---
	let {
		problemDocs,
		files,
		codeConfig,
		submission,
		runStatus,
		submitStatus,
		submitError,
		runCooldown,
		submitCooldown,
		userInputs = $bindable(),
		activeTabResults = 'output',
		activeView = $bindable(),
		runOutput,
		handleRun,
		handleSubmit
	}: {
		problemDocs: Array<{ title: string; content: string }>;
		files: any;
		codeConfig: any;
		submission: UserSubmission | null;
		runStatus: 'idle' | 'loading' | 'success' | 'error';
		submitStatus: 'idle' | 'loading' | 'success' | 'error';
		submitError: string | null;
		runCooldown: number;
		submitCooldown: number;
		userInputs: Array<{ id: number; value: string }>;
		handleSubmit?: () => void;
		handleRun?: () => void;
		runOutput?: string;
		activeTabResults: 'input' | 'output' | 'result';
		activeView: 'problem' | 'code' | 'results';
	} = $props();

	// --- State ---
	let activeTab = $derived(
		{
			input: 0,
			output: 1,
			result: 2
		}[activeTabResults]
	);

	// Helper function for button classes
	function getButtonClass(view: string) {
		const baseClass =
			'flex gap-2 justify-center items-center px-1 py-3 font-medium border-b dark:border-gray-700 border-gray-200  transition-colors';
		const activeClass =
			'bg-blue-50 text-gray-900 dark:bg-blue-950 dark:text-gray-50 !border-b-blue-500 !dark:border-b-blue-500';
		const inactiveClass =
			'text-gray-500 hover:bg-gray-100/50 dark:text-gray-400 dark:hover:bg-gray-800/50';

		return `${baseClass} ${activeView === view ? activeClass : inactiveClass}`;
	}
</script>

<div class="flex flex-1 flex-col overflow-hidden">
	<nav class="bg-page safe-area-padding-bottom grid grid-cols-3 text-sm">
		<button onclick={() => (activeView = 'problem')} class={getButtonClass('problem')}>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				></path>
			</svg>
			المسألة
		</button>
		<button onclick={() => (activeView = 'code')} class="{getButtonClass('code')} border-x">
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
				></path>
			</svg>
			الكود
		</button>
		<button onclick={() => (activeView = 'results')} class={getButtonClass('results')}>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
				></path>
			</svg>
			النتائج
		</button>
	</nav>

	<!-- Content Area -->
	<div class="bg-page flex-1 overflow-y-auto dark:bg-gray-900">
		{#if activeView === 'problem'}
			<div class="h-full bg-gray-50 p-4 dark:bg-gray-900">
				<Problem markdown={problemDocs} />
			</div>
		{:else if activeView === 'code'}
			<div class="flex h-full flex-col">
				<div class="min-h-[calc(100vh-190px)] flex-1">
					<CodeEditor bind:files config={codeConfig} />
				</div>
				<ActionBar
					onRun={handleRun}
					onSubmit={handleSubmit}
					runStatus={runStatus === 'loading' ? 'loading' : runCooldown > 0 ? 'disabled' : 'idle'}
					submitStatus={submitStatus === 'loading'
						? 'loading'
						: submitCooldown > 0
							? 'disabled'
							: !handleSubmit
								? 'disabled'
								: 'idle'}
					runCooldownDuration={runCooldown}
					submitCooldownDuration={submitCooldown}
				/>
			</div>
		{:else if activeView === 'results'}
			<div class="h-full bg-gray-50 pb-14 dark:bg-gray-900">
				<!-- Loading State -->
				<Loading status={submitStatus === 'idle' ? runStatus : submitStatus} estimatedSeconds={3} />

				{#if runStatus !== 'loading' && submitStatus !== 'loading'}
					<!-- Results Sub-tabs -->
					<Tabs variant="pills" bind:activeTab>
						<TabPanel index={0}>
							<InputPanel bind:inputs={userInputs} />
						</TabPanel>

						<TabPanel index={1}>
							<OutputPanel output={runOutput} />
						</TabPanel>

						<TabPanel index={2}>
							<ResultsPanel {submission} error={submitError} />
						</TabPanel>

						<TabList class="fixed bottom-0 flex w-full">
							<Tab index={1} class="text-sm">المخرجات</Tab>
							<Tab index={2} class="text-sm">نتائج الاختبار</Tab>
							<Tab index={0} class="text-sm">المدخلات</Tab>
						</TabList>
					</Tabs>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	/* Safe area padding for devices with home indicator */
	.safe-area-padding-bottom {
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* Ensure Monaco editor takes full available space */
	:global(.monaco-editor) {
		width: 100% !important;
		height: 100% !important;
		font-size: 14px !important;
	}

	/* Better mobile scrolling */
	:global(.mobile-scroll) {
		-webkit-overflow-scrolling: touch;
		overflow-scrolling: touch;
	}

	/* Navigation button hover effects */
	button {
		position: relative;
		overflow: hidden;
	}

	button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
		transition: left 0.5s;
	}

	button:active::before {
		left: 100%;
	}
</style>

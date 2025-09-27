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
		activeTabResults = 'input',
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
		const baseClass = 'p-3 font-medium transition-colors';
		const activeClass = 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50';
		const inactiveClass =
			'text-gray-500 hover:bg-gray-100/50 dark:text-gray-400 dark:hover:bg-gray-800/50';

		return `${baseClass} ${activeView === view ? activeClass : inactiveClass}`;
	}
</script>

<div class="flex flex-1 flex-col overflow-hidden">
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
							: 'idle'}
					runCooldownDuration={runCooldown}
					submitCooldownDuration={submitCooldown}
				/>
			</div>
		{:else if activeView === 'results'}
			<div class="h-full bg-gray-50 dark:bg-gray-900">
				<!-- Loading State -->
				<Loading status={submitStatus === 'idle' ? runStatus : submitStatus} estimatedSeconds={3} />

				{#if runStatus !== 'loading' && submitStatus !== 'loading'}
					<!-- Results Sub-tabs -->
					<Tabs variant="default" bind:activeTab>
						<div class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
							<TabList class="flex w-full">
								<Tab index={0} class="flex-1 px-2 py-3 text-center text-sm font-medium">
									المدخلات
								</Tab>
								<Tab index={1} class="flex-1 px-2 py-3 text-center text-sm font-medium">
									المخرجات
								</Tab>
								<Tab index={2} class="flex-1 px-2 py-3 text-center text-sm font-medium">
									نتائج الاختبار
								</Tab>
							</TabList>
						</div>

						<TabPanel index={0}>
							<div class="p-4">
								<InputPanel bind:inputs={userInputs} />
							</div>
						</TabPanel>

						<TabPanel index={1}>
							<div class="p-4">
								<OutputPanel output={runOutput} />
							</div>
						</TabPanel>

						<TabPanel index={2}>
							<div class="p-4">
								<ResultsPanel {submission} error={submitError} />
							</div>
						</TabPanel>
					</Tabs>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Fixed Bottom Navigation -->
	<nav
		class="bg-page safe-area-padding-bottom grid grid-cols-3 border-t border-gray-200 text-sm dark:border-gray-700"
	>
		<button onclick={() => (activeView = 'problem')} class={getButtonClass('problem')}>
			<div class="flex flex-col items-center gap-1">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					></path>
				</svg>
				<span class="text-xs">المسألة</span>
			</div>
		</button>
		<button
			onclick={() => (activeView = 'code')}
			class="{getButtonClass('code')} border-x border-gray-200 dark:border-gray-700"
		>
			<div class="flex flex-col items-center gap-1">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
					></path>
				</svg>
				<span class="text-xs">الكود</span>
			</div>
		</button>
		<button onclick={() => (activeView = 'results')} class={getButtonClass('results')}>
			<div class="flex flex-col items-center gap-1">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					></path>
				</svg>
				<span class="text-xs">النتائج</span>
			</div>
		</button>
	</nav>
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

<script lang="ts">
	// Components
	import SplitPane from '$ui/common/SplitPane.svelte';
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
	import type { UserSubmission } from '$lib/server/db/repos/class';

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
		runOutput,
		userInputs = $bindable(),
		handleRun,
		activeTabResults = 'output',
		handleSubmit
	}: {
		problemDocs: Array<{ title: string; content: string }>;
		files: any;
		codeConfig: any;
		submission: UserSubmission | null;
		runStatus: 'idle' | 'loading' | 'success' | 'error';
		submitStatus: 'idle' | 'loading' | 'success' | 'error';
		runCooldown: number;
		submitCooldown: number;
		submitError: string | null;
		runOutput?: string;
		userInputs: Array<{ id: number; value: string }>;
		handleSubmit?: () => void;
		handleRun?: () => void;
		activeTabResults: 'input' | 'output' | 'result';
	} = $props();

	let activeTab = $derived(
		{
			input: 0,
			output: 1,
			result: 2
		}[activeTabResults]
	);
</script>

<div class="flex flex-1 flex-col overflow-hidden">
	<SplitPane
		type="horizontal"
		min="360px"
		max="80%"
		pos="60%"
		dir="rtl"
		dividerClass="after:dark:bg-gray-800 after:bg-gray-300"
	>
		{#snippet a()}
			<section class="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
				<Problem markdown={problemDocs} />
			</section>
		{/snippet}
		{#snippet b()}
			<div class="h-full">
				<SplitPane
					type="vertical"
					min="100px"
					max="90%"
					pos="50%"
					dividerClass="after:dark:bg-gray-700 after:bg-gray-300"
				>
					{#snippet a()}
						<section class="flex h-full flex-col overflow-hidden">
							<div class="min-h-0 flex-grow">
								<CodeEditor bind:files config={codeConfig} />
							</div>
							<div class="flex-shrink-0">
								<ActionBar
									onRun={handleRun}
									onSubmit={handleSubmit}
									runStatus={runStatus === 'loading'
										? 'loading'
										: runCooldown > 0
											? 'disabled'
											: 'idle'}
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
						</section>
					{/snippet}
					{#snippet b()}
						<section class="bg-page h-full overflow-auto dark:bg-gray-900">
							<Loading
								status={submitStatus == 'idle' ? runStatus : submitStatus}
								estimatedSeconds={3}
							/>
							{#if runStatus !== 'loading' && submitStatus !== 'loading'}
								<Tabs variant="default" bind:activeTab>
									<TabList>
										<Tab index={1}>المخرجات</Tab>
										<Tab index={2}>نتائج الاختبار</Tab>
										<Tab index={0}>المدخلات</Tab>
									</TabList>

									<TabPanel index={0}>
										<InputPanel bind:inputs={userInputs} />
									</TabPanel>

									<TabPanel index={1}>
										<OutputPanel output={runOutput} />
									</TabPanel>

									<TabPanel index={2}>
										<ResultsPanel {submission} error={submitError} />
									</TabPanel>
								</Tabs>
							{/if}
						</section>
					{/snippet}
				</SplitPane>
			</div>
		{/snippet}
	</SplitPane>
</div>

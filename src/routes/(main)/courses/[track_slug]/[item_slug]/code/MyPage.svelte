<script lang="ts">
	import type { PageData } from './$types';
	import type { Sound } from '$utils/sound';

	// Components

	// Services
	import { submissionService } from './submission.service';
	import type { Submission } from '$lib/server/db/schema/submission';
	import Header from './Header.svelte';
	import DesktopLayout from './DesktopLayout.svelte';
	import MobileLayout from './MobileLayout.svelte';
	import { onMount } from 'svelte';
	import SuccessPopup from '$ui/success-popup/SuccessPopup.svelte';

	// --- Props ---
	let { data, finishPlayer }: { data: PageData; finishPlayer?: Sound } = $props();

	const COOLDOWN_SECONDS = {
		run: 10,
		submit: 30
	};

	// --- State ---
	let run = $state<{
		status: 'idle' | 'loading' | 'success' | 'error';
		error: string | null;
		cooldown: number;
		result: {
			stdout: string;
			stderr: string;
			exit_code: number;
			error?: string;
		} | null;
	}>({
		status: 'idle',
		error: null,
		cooldown: 0,
		result: null
	});
	let setRun = (k: string, v: any) => {
		run = {
			...run,
			[k]: v
		};
	};

	let submit = $state<{
		status: 'idle' | 'loading' | 'success' | 'error';
		error: string | null;
		cooldown: number;
	}>({
		status: 'idle',
		error: null,
		cooldown: 0
	});
	let setSubmit = (k: string, v: any) => {
		submit = {
			...submit,
			[k]: v
		};
	};

	let isMobile = $state(false);
	let showSuccessPopup = $state(false);

	let userInputs = $state<
		{
			id: number;
			value: string;
		}[]
	>([]);

	let newSubmission = $state<Submission>();

	let activeTabResults = $state<'input' | 'output' | 'result'>('input');
	let activeMobileView = $state<'problem' | 'code' | 'results'>('problem');

	// --- Lifecycle ---
	onMount(() => {
		const timer = setInterval(() => {
			if (run.cooldown > 0) {
				run.cooldown--;
			}
			if (submit.cooldown > 0) {
				submit.cooldown--;
			}
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	});

	onMount(() => {
		const mediaQuery = window.matchMedia('(max-width: 1023px)');
		isMobile = mediaQuery.matches;

		const updateIsMobile = (e: MediaQueryListEvent) => (isMobile = e.matches);
		mediaQuery.addEventListener('change', updateIsMobile);

		return () => {
			mediaQuery.removeEventListener('change', updateIsMobile);
		};
	});

	// --- Derived State ---
	let files = $derived((data.submission?.data as any)?.files ?? data.code.files);
	let submission: Submission | null = $derived(newSubmission ?? data.submission);

	let problemDocs = $derived(
		Object.entries(data.code.docs)
			.sort(([a], [b]) => {
				if (a === 'instructions.md') return -1;
				if (b === 'instructions.md') return 1;
				return 0;
			})
			.map(([k, v]) => {
				const titleMap = {
					'instructions.md': 'تعليمات',
					'hints.md': 'تلميحات'
				};
				return {
					title: titleMap[k as keyof typeof titleMap] ?? k,
					content: v as string
				};
			})
	);

	// --- Handlers ---

	async function handleRun() {
		if (run.status === 'loading' || run.cooldown > 0) return;

		setRun('status', 'loading');
		setRun('error', null);

		// Switch to correct tab
		if (isMobile) {
			activeMobileView = 'results';
		}
		activeTabResults = 'output';

		try {
			const result = await submissionService.runCode(
				data.item.id,
				files,
				userInputs.map((v) => v.value)
			);
			setRun('result', result.results);
			setRun('status', 'success');
		} catch (e) {
			console.error('Run failed:', e);
			setRun('error', (e as Error).message || 'Failed to run code');
			setRun('status', 'error');
		} finally {
			setRun('status', 'idle');
			setRun('cooldown', COOLDOWN_SECONDS.run);
		}
	}

	async function handleSubmit() {
		if (submit.status === 'loading' || submit.cooldown > 0) return;

		setSubmit('status', 'loading');
		setSubmit('error', null);

		// Switch to correct tab
		if (isMobile) {
			activeMobileView = 'results';
		}
		activeTabResults = 'result';

		try {
			const result = await submissionService.submitTests(data.item.id, files);

			newSubmission = result;
			setSubmit('status', 'success');

			const allTestsPassed =
				result.results?.tests?.every((test: any) => test.status === 'pass') ?? false;

			if (allTestsPassed) {
				showSuccessPopup = true;
			}
		} catch (e) {
			console.error('Submission failed:', e);
			setSubmit('error', (e as Error).message || 'Failed to submit tests');
			setSubmit('status', 'error');
		} finally {
			setSubmit('status', 'idle');
			setSubmit('cooldown', COOLDOWN_SECONDS.submit);
		}
	}
</script>

<main class="bg-page flex h-screen flex-col">
	<Header trackSlug={data.track?.slug} trackTitle={data.track.title} itemTitle={data.item.title} />

	{#if !isMobile}
		<DesktopLayout
			{problemDocs}
			{files}
			codeConfig={data.code.config}
			{submission}
			runStatus={run.status}
			submitStatus={submit.status}
			submitError={submit.error}
			bind:userInputs
			{handleSubmit}
			{handleRun}
			runCooldown={run.cooldown}
			submitCooldown={submit.cooldown}
			{activeTabResults}
			runOutput={run.result?.stdout + '\n' + run.result?.stderr}
		/>
	{:else}
		<MobileLayout
			{problemDocs}
			{files}
			codeConfig={data.code.config}
			{submission}
			runStatus={run.status}
			submitStatus={submit.status}
			submitError={submit.error}
			bind:userInputs
			{handleSubmit}
			{handleRun}
			runCooldown={run.cooldown}
			submitCooldown={submit.cooldown}
			bind:activeView={activeMobileView}
			{activeTabResults}
			runOutput={run.result?.stdout + '\n' + run.result?.stderr}
		/>
	{/if}

	{#if showSuccessPopup}
		<SuccessPopup
			onClose={() => (showSuccessPopup = false)}
			nextHref={`/courses/${data?.track.slug}`}
			sound={finishPlayer}
			score={submission?.xp_reward ?? 0}
			courseTitle={data.track.title}
		/>
	{/if}
</main>

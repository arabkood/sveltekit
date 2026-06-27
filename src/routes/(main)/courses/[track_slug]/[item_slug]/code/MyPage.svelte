<script lang="ts">
	import type { PageData } from './$types';
	import type { Sound } from '$utils/sound';

	// Components

	// Services
	import { submissionService, RateLimitError } from './submission.service';
	import Header from './Header.svelte';
	import DesktopLayout from './DesktopLayout.svelte';
	import MobileLayout from './MobileLayout.svelte';
	import { onMount } from 'svelte';
	import SuccessPopup from '$ui/popup/SuccessPopup.svelte';
	import type { UserSubmission } from '$lib/server/db/repos/class';
	import Seo from '$ui/others/SEO.svelte';

	// --- Props ---
	let { data, finishPlayer }: { data: PageData; finishPlayer?: Sound } = $props();

	// SEO data
	const cleanTitle = $derived(
		data.item.title.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim()
	);
	const seoTitle = $derived(`تحدي: ${cleanTitle} - ${data.track.title} | أكود`);
	const seoDescription = $derived(
		`حل تحدي البرمجة ${cleanTitle} في مسار ${data.track.title} - اختبر مهاراتك في البرمجة على منصة أكود`
	);
	const seoKeywords = $derived(
		`${cleanTitle}, تحدي برمجة, ${data.track.title}, حل تمارين برمجة, تعلم البرمجة بالممارسة, أكود`
	);

	const COOLDOWN_SECONDS = {
		run: 5,
		submit: 10
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

	let newSubmission = $state<UserSubmission>();

	let activeTabResults = $state<'input' | 'output' | 'result'>('output');
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
	let submission: UserSubmission | null = $derived(newSubmission ?? data.submission);

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
			setRun('cooldown', COOLDOWN_SECONDS.run);
		} catch (e: any) {
			console.error('Run failed:', e);
			setRun('error', e.message || 'Failed to run code');
			setRun('status', 'error');
			if (e instanceof RateLimitError) {
				setRun('cooldown', e.retryAfter);
			} else {
				setRun('cooldown', COOLDOWN_SECONDS.run);
			}
		} finally {
			setRun('status', 'idle');
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
			setSubmit('cooldown', COOLDOWN_SECONDS.submit);

			const allTestsPassed =
				result.results?.tests?.every((test: any) => test.status === 'pass') ?? false;

			if (allTestsPassed) {
				showSuccessPopup = true;
			}
		} catch (e: any) {
			console.error('Submission failed:', e);
			setSubmit('error', e.message || 'Failed to submit tests');
			setSubmit('status', 'error');
			if (e instanceof RateLimitError) {
				setSubmit('cooldown', e.retryAfter);
			} else {
				setSubmit('cooldown', COOLDOWN_SECONDS.submit);
			}
		} finally {
			setSubmit('status', 'idle');
		}
	}

	const runOutput = $derived.by(() => {
		if (run.error) return `Error:\n${run.error}`;
		let out = '';
		if (run.result?.stdout && run.result?.stdout.length > 0) {
			out += run.result.stdout;
		}
		if (run.result?.stderr && run.result?.stderr.length > 0) {
			if (run.result?.stdout && run.result?.stdout.length > 0) {
				out += '\n';
			}
			out += run.result.stderr;
		}
		return out;
	});
</script>

<Seo title={seoTitle} description={seoDescription} keywords={seoKeywords} />

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
			handleSubmit={data.submission?.status === 'pass' ? undefined : handleSubmit}
			{handleRun}
			runCooldown={run.cooldown}
			submitCooldown={submit.cooldown}
			{activeTabResults}
			{runOutput}
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
			handleSubmit={data.submission?.status === 'pass' ? undefined : handleSubmit}
			{handleRun}
			runCooldown={run.cooldown}
			submitCooldown={submit.cooldown}
			bind:activeView={activeMobileView}
			{activeTabResults}
			{runOutput}
		/>
	{/if}

	{#if showSuccessPopup}
		<SuccessPopup
			onClose={() => (showSuccessPopup = false)}
			nextHref={`/courses/${data?.track.slug}`}
			sound={finishPlayer}
			score={submission?.xpReward ?? 0}
			courseTitle={data.track.title}
		/>
	{/if}
</main>

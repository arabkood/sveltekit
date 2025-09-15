<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cn } from '$utils/classnames';
	import { API_ENDPOINTS } from '$api/config';

	import Icon from '$ui/common/Icon.svelte';
	import Logo from '$ui/common/Logo.svelte';
	import SplitPane from '$ui/common/SplitPane.svelte';
	import Problem from '$ui/code-editor/Problem.svelte';
	import CodeEditor from '$ui/code-editor/monaco.svelte';
	import Loading from '$ui/code-editor/Loading.svelte';
	import ResultsPanel from '$ui/code-editor/ResultsPanel.svelte';
	import SuccessPopup from '$ui/success-popup/SuccessPopup.svelte';

	import type { PageData } from './$types';
	import type { ApiError } from '$types/api';
	import { i18n } from '$i18n/i18n';
	import type { Submission } from '$lib/server/db/schema/submission';
	import type { Sound } from '$utils/sound';

	// --- Constants ---
	const ATTEMPT_COOLDOWN_SECONDS = 3;
	const POLLING_INITIAL_DELAY_MS = 1000;
	const POLLING_BACKOFF_FACTOR = 1.5;
	const POLLING_MAX_DELAY_MS = 4000;
	const POLLING_MAX_ATTEMPTS = 20;

	// --- Props ---
	let { data, finishPlayer }: { data: PageData; finishPlayer?: Sound } = $props();

	// --- State ---
	let status: 'idle' | 'loading' | 'success' | 'error' = $state('idle');
	let error = $state<string | null>(null);
	let showSuccessPopup = $state(false);
	let cooldown = $state(0);
	let isMobile = $state(false);
	let activeView: 'problem' | 'code' | 'output' = $state('problem');
	let newSubmission = $state<Submission>();

	// --- Derived State ---
	let files = $derived((data.submission?.data as any)?.files ?? data.code.files);
	let nextItem = $derived(data.nextItemIdx ? data.module.items[data.nextItemIdx] : null);
	let prevItem = $derived(data.prevItemIdx ? data.module.items[data.prevItemIdx] : null);
	let submission: Submission | undefined = $derived(
		newSubmission ? newSubmission : data.submission ? data.submission : undefined
	);
	let canSubmit = $derived(submission?.status !== 'pass');

	let problemDocs = $derived(
		Object.entries(data.code.docs).map(([k, v]) => {
			const dct = {
				'instructions.md': 'تعليمات',
				'hints.md': 'تلميحات'
			};
			return {
				title: Object.hasOwn(dct, k) ? dct[k as keyof typeof dct] : k,
				content: v
			};
		})
	);

	// --- Lifecycle ---
	onMount(() => {
		const timer = setInterval(() => {
			if (cooldown > 0) {
				cooldown--;
			}
		}, 1000);

		const mediaQuery = window.matchMedia('(max-width: 1023px)');
		isMobile = mediaQuery.matches;

		const updateIsMobile = (e: MediaQueryListEvent) => (isMobile = e.matches);
		mediaQuery.addEventListener('change', updateIsMobile);

		return () => {
			clearInterval(timer);
			mediaQuery.removeEventListener('change', updateIsMobile);
		};
	});

	// --- Logic ---
	async function runSubmission() {
		if (status === 'loading' || cooldown > 0) return;

		status = 'loading';
		error = null;
		if (isMobile) {
			activeView = 'output';
		}
		cooldown = ATTEMPT_COOLDOWN_SECONDS;

		try {
			const initialResponse = await fetch(API_ENDPOINTS.item.submit(data.item.id), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: { files } }),
				credentials: 'include'
			});

			if (!initialResponse.ok) {
				const apiError: ApiError = await initialResponse.json();
				throw new Error(i18n.error(apiError.error) || 'Failed to submit solution.');
			}

			const res1 = await initialResponse.json();
			const res2 = await pollForResult(res1.submission.id);

			newSubmission = res2;

			status = 'success';

			const allTestsPassed =
				res2.results?.tests?.every((test: any) => test.status === 'pass') ?? false;
			if (allTestsPassed) {
				showSuccessPopup = true;
			}
		} catch (e) {
			console.error('Submission failed:', e);
			error = (e as Error).message || 'INTERNAL_ERROR';
			status = 'error';
		} finally {
			status = 'idle';
		}
	}

	async function pollForResult(submissionId: string, attempt = 0): Promise<any> {
		if (attempt >= POLLING_MAX_ATTEMPTS) {
			throw new Error('Submission timed out. Please try again.');
		}

		const delay = Math.min(
			POLLING_INITIAL_DELAY_MS * Math.pow(POLLING_BACKOFF_FACTOR, attempt),
			POLLING_MAX_DELAY_MS
		);
		await new Promise((resolve) => setTimeout(resolve, delay));

		const response = await fetch(`/server/submission?id=${encodeURIComponent(submissionId)}`);
		if (!response.ok) {
			throw new Error('Could not fetch submission status.');
		}

		const { submission: sub } = await response.json();

		if (sub.status === 'pending') {
			return pollForResult(submissionId, attempt + 1);
		}

		return sub;
	}

	function closeSuccessPopup() {
		showSuccessPopup = false;
	}
</script>

<main class="bg-page flex h-screen flex-col">
	<header
		class="flex shrink-0 items-center justify-between border-b border-gray-200 px-2 py-2 sm:px-4 dark:border-gray-700"
	>
		<div class="flex min-w-0 flex-1 items-center">
			<a
				href="/"
				class="mr-2 hidden shrink-0 items-center justify-center rounded-md p-1 text-gray-700 hover:bg-gray-200 md:flex dark:text-gray-200 dark:hover:bg-gray-800"
				aria-label="Home"
			>
				<Logo variant="iconOnly" size={26} />
			</a>
			<nav class="hidden min-w-0 items-center gap-1 text-sm md:flex">
				<a
					class="truncate rounded px-2 py-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
					href={`/courses/${data.track?.slug}`}
					title={data.track.title}>{data.track.title}</a
				>
				<Icon class="shrink-0 text-gray-400 dark:text-gray-500" name="chevron-left" size={18} />
				<span
					class="truncate px-2 py-1 font-medium text-gray-800 dark:text-gray-100"
					title={data.item.title}>{data.item.title}</span
				>
			</nav>
			<div class="flex min-w-0 items-center md:hidden">
				<a
					href={`/courses/${data.track?.slug}`}
					class="me-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
					aria-label="Back to track"
					title={data.track.title}
				>
					<Icon name="arrow-right" size={20} />
				</a>
				<span
					class="truncate text-sm font-medium text-gray-800 dark:text-gray-100"
					title={data.item.title}
				>
					{data.item.title}
				</span>
			</div>
		</div>

		<div class="flex items-center justify-center px-2 sm:px-4">
			<button
				transition:fade
				class={cn(
					'flex items-center gap-2 rounded-lg px-3 py-1.5 font-medium transition-colors',
					status === 'loading' || cooldown > 0 || !canSubmit
						? 'cursor-not-allowed text-gray-600 dark:text-gray-400'
						: 'cursor-pointer text-emerald-600 hover:bg-gray-500/10 dark:text-emerald-400'
				)}
				onclick={runSubmission}
				disabled={status === 'loading' || cooldown > 0 || !canSubmit}
			>
				<Icon name="play" class="h-4 w-4 sm:h-5 sm:w-5" />
				<span class="text-sm sm:text-base">تصحيح الإجابة</span>
				{#if cooldown > 0 && status === 'idle'}
					<span>({cooldown})</span>
				{/if}
			</button>
		</div>
	</header>

	<div class="hidden flex-1 flex-col overflow-hidden md:flex">
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
							<section class="h-full overflow-hidden">
								<CodeEditor bind:files config={data.code.config} />
							</section>
						{/snippet}
						{#snippet b()}
							<section class="bg-page h-full overflow-auto dark:bg-gray-900">
								<Loading {status} estimatedSeconds={3} />
								{#if status !== 'loading'}
									<ResultsPanel {submission} {error} />
								{/if}
							</section>
						{/snippet}
					</SplitPane>
				</div>
			{/snippet}
		</SplitPane>
	</div>

	<div class="flex flex-1 flex-col overflow-hidden md:hidden">
		<div class="bg-page flex-1 overflow-y-auto dark:bg-gray-900">
			{#if activeView === 'problem'}
				<div class="bg-gray-50 dark:bg-gray-900">
					<Problem markdown={data.code.docs['instructions.md']} />
				</div>
			{:else if activeView === 'code'}
				<div class="h-full min-h-[calc(100vh-120px)]">
					<CodeEditor bind:files config={data.code.config} />
				</div>
			{:else if activeView === 'output'}
				<div class="p-4">
					<Loading {status} estimatedSeconds={3} />
					{#if status !== 'loading'}
						<ResultsPanel {submission} {error} />
					{/if}
				</div>
			{/if}
		</div>

		<nav class="bg-page grid grid-cols-3 border-t border-gray-200 text-sm dark:border-gray-700">
			<button
				onclick={() => (activeView = 'problem')}
				class={cn(
					'p-3 font-medium transition-colors',
					activeView === 'problem'
						? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
						: 'text-gray-500 hover:bg-gray-100/50 dark:text-gray-400 dark:hover:bg-gray-800/50'
				)}
			>
				المسألة
			</button>
			<button
				onclick={() => (activeView = 'code')}
				class={cn(
					'border-x border-gray-200 p-3 font-medium transition-colors dark:border-gray-700',
					activeView === 'code'
						? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
						: 'text-gray-500 hover:bg-gray-100/50 dark:text-gray-400 dark:hover:bg-gray-800/50'
				)}
			>
				الحل
			</button>
			<button
				onclick={() => (activeView = 'output')}
				class={cn(
					'p-3 font-medium transition-colors',
					activeView === 'output'
						? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
						: 'text-gray-500 hover:bg-gray-100/50 dark:text-gray-400 dark:hover:bg-gray-800/50'
				)}
			>
				النتيجة
			</button>
		</nav>
	</div>

	{#if showSuccessPopup}
		<SuccessPopup
			onClose={closeSuccessPopup}
			nextHref={`/courses/${data?.track.slug}`}
			sound={finishPlayer}
			score={submission?.xp_reward ?? 0}
		/>
	{/if}
</main>

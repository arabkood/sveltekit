<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
	import { fade } from 'svelte/transition';
	import SplitPane from '$ui/common/SplitPane.svelte';
	import Problem from '$ui/code-editor/Problem.svelte';
	import CodeEditor from '$ui/code-editor/monaco.svelte';
	import Loading from '$ui/code-editor/Loading.svelte';
	import ResultsPanel from '$ui/code-editor/ResultsPanel.svelte';
	import { API_ENDPOINTS } from '$api/config';
	import type { ApiError } from '$types/api';
	import SuccessPopup from '$ui/code-editor/SuccessPopup.svelte';
	import { onMount } from 'svelte';
	import { cn } from '$utils/classnames';
	import type { PageData } from './$types';
	import type { CodeFiles, CodeResults } from '$types/code';
	import Logo from '$ui/common/Logo.svelte';

	let {
		submission,
		data
	}: { submission?: { files: CodeFiles; results: CodeResults }; data: PageData } = $props();

	const ATTEMPT_COOLDOWN = 2;

	let status: 'idle' | 'loading' | 'end' = $state('idle');
	let files = $state<CodeFiles>(data.code.files);
	let results = $state<CodeResults>();
	let submissionRes = $state();
	let showSuccessPopup = $state(false);
	let cooldown = $state(0);
	let isMobile = $state(false);
	let activeView: 'problem' | 'code' | 'output' = $state('problem');

	let next = $derived(data.nextItemIdx ? data.module.items[data.nextItemIdx] : null);
	let prev = $derived(data.prevItemIdx ? data.module.items[data.prevItemIdx] : null);

	$effect(() => {
		if (submission) {
			files = submission.files;
		}
	});

	$effect(() => {
		if (submission?.results) {
			results = submission.results;
		} else {
			results = undefined;
		}
	});

	onMount(() => {
		const i = setInterval(() => {
			if (cooldown >= 0) {
				if (!(cooldown == 0 && status !== 'idle')) {
					cooldown--;
				}
			}
		}, 1000);

		const mediaQuery = window.matchMedia('(max-width: 1023px)');
		isMobile = mediaQuery.matches;
		const updateIsMobile = (e: MediaQueryListEvent) => (isMobile = e.matches);
		mediaQuery.addEventListener('change', updateIsMobile);

		return () => {
			clearInterval(i);
			mediaQuery.removeEventListener('change', updateIsMobile);
		};
	});

	async function attempt() {
		if (!data.item.id || cooldown >= 0) {
			return;
		}
		status = 'loading';
		if (isMobile) {
			activeView = 'output';
		}
		cooldown = ATTEMPT_COOLDOWN;
		const response = await fetch(API_ENDPOINTS.item.submit(data.item.id), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ data: { files } }),
			credentials: 'include'
		});

		if (!response.ok) {
			const error: ApiError = await response.json();
			alert('Something went wrong, check console for details');
			console.error('KOOD', error);
			return;
		}

		const { submission: res } = await response.json();
		submissionRes = res;
		setTimeout(() => {
			checkSubmission(res.id);
		}, 2000);
	}

	const checkSubmission = async (subId: string, attempts = 0) => {
		if (!subId) {
			return;
		}
		const response = await fetch(`/server/submission?id=${encodeURIComponent(subId)}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const { submission: res } = await response.json();
		submissionRes = res;

		if (res?.status === 'wait') {
			const delay = Math.min(Math.pow(1.5, attempts) * 1000, 5000);

			if (attempts < 30) {
				setTimeout(() => checkSubmission(subId, attempts + 1), delay);
			} else {
				throw new Error('Submission timeout');
			}
		} else {
			status = 'end';
			setTimeout(() => {
				status = 'idle';
				const testCases = res?.results?.tests || [];
				const allTestsPassed =
					testCases.length > 0 && testCases.every((test) => test.status === 'pass');

				if (allTestsPassed) {
					showSuccessPopup = true;
				}
			}, 500);
			return res;
		}
	};

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
					cooldown >= 0
						? 'cursor-not-allowed text-gray-600 dark:text-gray-400'
						: 'cursor-pointer text-emerald-600 hover:bg-gray-500/10 dark:text-emerald-400'
				)}
				onclick={cooldown >= 0 ? undefined : attempt}
				disabled={cooldown >= 0}
			>
				<Icon name="play" class="h-4 w-4 sm:h-5 sm:w-5" />
				<span class="text-sm sm:text-base">تصحيح الإجابة</span>
				{#if cooldown > 0 && status == 'idle'}
					<span>({cooldown})</span>
				{/if}
			</button>
		</div>

		<!-- <div class="flex shrink-0 items-center justify-end gap-1"> -->
		<!-- 	<a -->
		<!-- 		href={`/courses/${data.track?.slug}/${prev?.slug}`} -->
		<!-- 		class="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" -->
		<!-- 		class:pointer-events-none={!prev?.slug} -->
		<!-- 		class:opacity-50={!prev?.slug} -->
		<!-- 		aria-label="Previous item" -->
		<!-- 	> -->
		<!-- 		<Icon name="chevron-right" size={22} /> -->
		<!-- 	</a> -->
		<!---->
		<!-- 	<a -->
		<!-- 		href={`/courses/${data.track?.slug}/${next?.slug}`} -->
		<!-- 		class="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" -->
		<!-- 		class:pointer-events-none={!next?.slug} -->
		<!-- 		class:opacity-50={!next?.slug} -->
		<!-- 		aria-label="Next item" -->
		<!-- 	> -->
		<!-- 		<Icon name="chevron-left" size={22} /> -->
		<!-- 	</a> -->
		<!-- </div> -->
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
					<Problem markdown={data.code.docs['instructions.md']} />
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
								{#if status == 'idle'}
									<ResultsPanel {results} />
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
					{#if status == 'idle'}
						<ResultsPanel {results} />
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

	<SuccessPopup
		visible={showSuccessPopup}
		onClose={closeSuccessPopup}
		nextHref={next?.slug ? `/courses/${data?.track.slug}/${next?.slug}` : undefined}
		score={results?.xp_reward || 0}
	/>
</main>

<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
	import { fade } from 'svelte/transition';
	import TopNav from '$ui/code-editor/TopNav.svelte';
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
	import { i18n } from '$i18n/i18n';
	import type { PageData } from './$types';
	import type { CodeFiles, CodeResults } from '$types/code';

	let {
		// code,
		submission,
		data
	}: {
		// code: Code;
		submission?: {
			files: CodeFiles;
			results: CodeResults;
		};
		data: PageData;
	} = $props();

	const ATTEMPT_COOLDOWN = 2;

	let status: 'idle' | 'loading' | 'end' = $state('idle');
	let files = $state<CodeFiles>(data.code.files);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let results = $state<CodeResults>();
	let showSuccessPopup = $state(false);
	let cooldown = $state(0);
	// next, prev
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
		return () => clearInterval(i);
	});

	async function handleStartTrack() {
		const url = new URL(API_ENDPOINTS.tracks.start);
		url.search = new URLSearchParams({ id: data.track.id }).toString();
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include'
		});

		if (response.status !== 409) {
			if (!response.ok) {
				const error: ApiError = await response.json();
				alert(i18n.error(error.error));
				return;
			}
		}
	}

	const userTrack = $derived(
		data.userTracks?.find((ut) => ut.userTrack.trackId == data.track.id) || null
	);

	async function attempt() {
		if (!data.item.id || cooldown >= 0) {
			return;
		}
		status = 'loading';
		cooldown = ATTEMPT_COOLDOWN;
		if (!userTrack) {
			await handleStartTrack();
		}
		const response = await fetch(API_ENDPOINTS.item.codeAttempt(data.item.id), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ files }),
			credentials: 'include'
		});

		if (!response.ok) {
			const error: ApiError = await response.json();
			alert('Something went wrong, check console for details');
			console.error('KOOD', error);
			return;
		}

		const res = await response.json();
		setTimeout(() => {
			checkSubmission(res.submissionId);
		}, 2000);
	}

	const checkSubmission = async (attemptId: string, attempts = 0) => {
		const response = await fetch(API_ENDPOINTS.item.codeAttempt(attemptId), {
			method: 'GET',
			credentials: 'include'
		});
		results = await response.json();
		console.debug('Checking result', results);

		if (results?.status === 'wait') {
			// Exponential backoff with max delay of 5 seconds
			const delay = Math.min(Math.pow(1.5, attempts) * 1000, 5000);

			if (attempts < 30) {
				// 30 second timeout
				setTimeout(() => checkSubmission(attemptId, attempts + 1), delay);
			} else {
				throw new Error('Submission timeout');
			}
		} else {
			status = 'end';
			setTimeout(() => {
				status = 'idle';

				// Check if all tests have passed
				const testCases = results?.results?.tests || [];
				const allTestsPassed =
					testCases.length > 0 && testCases.every((test) => test.status === 'pass');

				if (allTestsPassed) {
					showSuccessPopup = true;
				}
			}, 500);
			return results;
		}
	};

	function closeSuccessPopup() {
		showSuccessPopup = false;
	}
</script>

<main class="bg-red fixed top-0 left-0 flex h-full w-full flex-col">
	<TopNav nextSlug={next?.slug} prevSlug={prev?.slug} track={data.track} item={data.item}>
		{#snippet Actions()}
			<button
				transition:fade
				class={cn(
					'flex items-center gap-2 rounded-lg px-3 py-1 font-medium transition-colors',
					cooldown >= 0
						? 'cursor-not-allowed text-gray-600 dark:text-gray-400'
						: 'cursor-pointer text-emerald-600 hover:bg-gray-500/10 dark:text-emerald-400'
				)}
				onclick={cooldown >= 0 ? undefined : attempt}
				disabled={cooldown >= 0}
			>
				<Icon name="play" size={22} />
				<span>تصحيح الإجابة</span>
				{#if cooldown > 0 && status == 'idle'}
					<span>({cooldown})</span>
				{/if}
			</button>
		{/snippet}
	</TopNav>

	<SplitPane
		type="horizontal"
		min="360px"
		max="80%"
		pos="60%"
		dir="rtl"
		dividerClass="after:dark:bg-gray-800 after:bg-gray-300"
	>
		{#snippet a()}
			<section class="bg-gray-100 dark:bg-gray-900">
				<Problem markdown={data.code.docs['instructions.md']} />
			</section>
		{/snippet}
		{#snippet b()}
			<SplitPane
				type="vertical"
				min="100px"
				max="90%"
				pos="50%"
				dividerClass="after:dark:bg-gray-700 after:bg-gray-300"
			>
				{#snippet a()}
					<section>
						<CodeEditor bind:files config={data.code.config} />
					</section>
				{/snippet}
				{#snippet b()}
					<section class="bg-gray-100 dark:bg-gray-900">
						<Loading {status} estimatedSeconds={3} />
						{#if status == 'idle'}
							<ResultsPanel {results} />
						{/if}
					</section>
				{/snippet}
			</SplitPane>
		{/snippet}
	</SplitPane>

	<SuccessPopup
		visible={showSuccessPopup}
		onClose={closeSuccessPopup}
		nextHref={next?.slug ? `/track/${data?.track.slug}/${next?.slug}` : undefined}
		score={results?.xp_reward || 0}
	/>
</main>

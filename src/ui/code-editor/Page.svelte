<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
	import { fade } from 'svelte/transition';
	import TopNav from './TopNav.svelte';
	import type { PageProps } from './$types';
	import SplitPane from '$ui/common/SplitPane.svelte';
	import Problem from './Problem.svelte';
	import CodeEditor from './monaco.svelte';
	import Loading from './Loading.svelte';
	import ResultsPanel from './ResultsPanel.svelte';
	import { API_ENDPOINTS } from '$api/config';
	import type { ApiError } from '$types/api';
	import type { EditorFile } from '$types/editor';
	import SuccessPopup from './SuccessPopup.svelte';
	import { onMount } from 'svelte';
	import { cn } from '$utils/classnames';
	import { page } from '$app/state';
	import { i18n } from '$i18n/i18n';

	let { data }: PageProps = $props();
	const ATTEMPT_COOLDOWN = 2;

	let status: 'idle' | 'loading' | 'end' = $state('idle');
	let files = $state<EditorFile[]>(data.exercise?.files);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let results = $state<any>();
	let showSuccessPopup = $state(false);
	let cooldown = $state(0);

	$effect(() => {
		if (data.submission?.userFiles) {
			files = data.submission?.userFiles;
		} else {
			files = data.exercise?.files;
		}
	});

	$effect(() => {
		if (data.submission?.results) {
			results = { results: data.submission.results };
		} else {
			results = [];
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		page.params.module;
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
		if (!data.module.id || cooldown >= 0) {
			return;
		}
		status = 'loading';
		cooldown = ATTEMPT_COOLDOWN;
		console.debug('boo', userTrack);
		if (!userTrack) {
			await handleStartTrack();
		}
		const body: {
			files: EditorFile[];
		} = {
			files: files
		};
		const response = await fetch(API_ENDPOINTS.modules.attempt(data.module.id), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
			credentials: 'include'
		});

		if (!response.ok) {
			const error: ApiError = await response.json();
			alert('Something went wrong, check console for details');
			console.error('KOOD', error);
			return;
		}

		const res = await response.json();
		console.debug('Submitted', res);
		setTimeout(() => {
			checkSubmission(res.submissionId);
		}, 2000);
	}

	const checkSubmission = async (attemptId: string, attempts = 0) => {
		const response = await fetch(API_ENDPOINTS.modules.getAttempt(attemptId), {
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

	// next, prev
	let next = $state<null | any>(null); // Use the actual type if known, e.g., { id: string; slug: string; ... }
	let prev = $state<null | any>(null);

	$effect(() => {
		// Reset before calculating
		next = null;
		prev = null;

		if (!data.module || !data.sectionsWithModules || data.sectionsWithModules.length === 0) {
			console.warn('Module data or sections unavailable for next/prev calculation.');
			return; // Exit if necessary data is missing
		}

		const sectionIdx = data.sectionsWithModules.findIndex(
			(section) => section.id === data.module.section_id
		);

		// Exit if the current section isn't found (shouldn't happen with valid data)
		if (sectionIdx === -1) {
			console.error(
				`Current section with id ${data.module.section_id} not found in sectionsWithModules.`
			);
			return;
		}

		const section = data.sectionsWithModules[sectionIdx];
		if (!section.modules || section.modules.length === 0) {
			console.warn(`Section ${section.id} has no modules.`);
			// Treat as boundary case for next/prev calculation if needed,
			// but this likely indicates a data issue.
			// We'll proceed assuming other sections might exist.
		}

		const currModuleIdx = section.modules.findIndex((mod) => mod.id === data.module.id);

		// Exit if the current module isn't found within its supposed section (data inconsistency)
		if (currModuleIdx === -1) {
			console.error(`Current module with id ${data.module.id} not found in section ${section.id}.`);
			return;
		}

		// --- Calculate Next Module ---
		// 1. Try next module in the *current* section
		if (currModuleIdx < section.modules.length - 1) {
			next = section.modules[currModuleIdx + 1];
		}
		// 2. If it was the last module, try the *first* module of the *next* section
		else if (sectionIdx < data.sectionsWithModules.length - 1) {
			const nextSection = data.sectionsWithModules[sectionIdx + 1];
			// Make sure the next section actually has modules
			if (nextSection?.modules?.length > 0) {
				next = nextSection.modules[0];
			}
		}
		// 3. Otherwise (last module of last section), there is no next module (remains null)

		// --- Calculate Previous Module ---
		// 1. Try previous module in the *current* section
		if (currModuleIdx > 0) {
			prev = section.modules[currModuleIdx - 1];
		}
		// 2. If it was the first module, try the *last* module of the *previous* section
		else if (sectionIdx > 0) {
			const prevSection = data.sectionsWithModules[sectionIdx - 1];
			// Make sure the previous section actually has modules
			if (prevSection?.modules?.length > 0) {
				prev = prevSection.modules[prevSection.modules.length - 1];
			}
		}
		// 3. Otherwise (first module of first section), there is no previous module (remains null)

		// console.debug("Calculated Nav:", { prev, next }); // Optional: for debugging
	});
</script>

<main class="bg-red fixed top-0 left-0 flex h-full w-full flex-col">
	<TopNav nextSlug={next?.slug} prevSlug={prev?.slug} track={data.track} module={data.module}>
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
				<Problem markdown={data?.exercise.docs} />
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
						<CodeEditor bind:files />
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

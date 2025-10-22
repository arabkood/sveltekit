<script lang="ts">
	import { cn } from '$utils/classnames';
	import { i18n } from '$i18n/i18n';
	import { fly, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Button from '$ui/common/Button.svelte';
	import Markdown from '$ui/common/Markdown.svelte';

	let {
		status = 'idle',
		isChecking = false,
		canCheck = true,
		failCount = 0,
		explanation,
		hint,
		showHint = $bindable(false),
		onCheck,
		onNext,
		onGetAnswer,
		onToggleHint
	}: {
		status?: 'idle' | 'incorrect' | 'correct';
		isChecking?: boolean;
		canCheck?: boolean;
		failCount?: number;
		explanation?: string;
		hint?: string;
		showHint?: boolean;
		onCheck?: () => void;
		onNext: () => void;
		onGetAnswer?: () => void;
		onToggleHint?: () => void;
	} = $props();

	const showGetAnswer = $derived(failCount >= 3 && status !== 'correct');
	const hasCheckButton = $derived(onCheck !== undefined);
	const autoShowHint = $derived(failCount >= 3 && hint);

	const encouragementKey = $derived(
		failCount === 0
			? 'lessons.tryAgain'
			: failCount === 1
				? 'lessons.tryAgainKeepGoing'
				: failCount === 2
					? 'lessons.gettingCloser'
					: 'lessons.letMeHelp'
	);

	let showExplanation = $state(false);
</script>

<div
	class={cn(
		'lesson-box-shared-footer',
		'fixed bottom-0 w-full border-t transition-colors duration-200',
		status === 'correct'
			? 'border-green-200 bg-green-50/30 dark:border-green-800 dark:bg-green-950/20'
			: status === 'incorrect'
				? 'border-yellow-300 bg-yellow-100/40 dark:border-yellow-700 dark:bg-yellow-900/30'
				: 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
	)}
>
	<div class="mx-auto max-w-3xl px-4 sm:px-6">
		<!-- FEEDBACK BANNER -->
		<div class="min-h-0">
			{#if status === 'correct'}
				<div
					class={cn('flex gap-4 pt-5 pb-0', explanation ? 'justify-between' : 'justify-center')}
					transition:slide={{ duration: 250, easing: cubicOut }}
				>
					<h3 class="text-xl font-bold text-green-700 dark:text-green-300">
						{i18n.t('lessons.correctAnswer')}
						<span class="ms-2 text-2xl"> 🎉 </span>
					</h3>

					{#if explanation && !showExplanation}
						<div transition:fly={{ y: -5, duration: 200 }}>
							<Button
								onclick={() => (showExplanation = true)}
								variant="neutral"
								rounded={true}
								size="sm"
							>
								{i18n.t('lessons.why')}
							</Button>
						</div>
					{/if}
				</div>
				{#if explanation && showExplanation}
					<div
						class="mt-4 rounded-2xl border border-green-200/50 bg-green-50/50 p-5 dark:border-green-800/50 dark:bg-green-900/30"
						transition:slide={{ duration: 250 }}
						role="region"
						aria-label="Explanation"
					>
						<div class="text-sm leading-relaxed text-green-900 dark:text-green-100">
							<Markdown markdown={explanation} />
						</div>
					</div>
				{/if}
			{:else if status === 'incorrect'}
				<div
					class={cn(
						'flex flex-wrap gap-4 pt-5 pb-0',
						(showGetAnswer && onGetAnswer) || (hint && !autoShowHint && !showHint && onToggleHint)
							? 'justify-between'
							: 'justify-center'
					)}
					transition:slide={{ duration: 250, easing: cubicOut }}
				>
					<h3 class="text-lg font-bold text-yellow-700 dark:text-yellow-300">
						{i18n.t(encouragementKey)}
					</h3>

					{#if showGetAnswer && onGetAnswer}
						<div transition:fly={{ y: -5, duration: 200 }}>
							<Button onclick={onGetAnswer} variant="neutral" rounded={true} size="sm">
								{i18n.t('lessons.getAnswer')}
							</Button>
						</div>
					{/if}

					{#if hint && !autoShowHint && !showHint && onToggleHint}
						<div transition:fly={{ y: -5, duration: 200 }}>
							<Button variant="neutral" rounded={true} size="sm" onclick={onToggleHint}>
								{i18n.t('lessons.showHint')}
							</Button>
						</div>
					{/if}
				</div>
				{#if hint && (autoShowHint || showHint)}
					<div
						class="rounded-xl bg-yellow-100 px-4 py-3.5 dark:bg-yellow-900/30"
						transition:slide={{ duration: 200 }}
					>
						<div
							class="mb-2 flex items-center gap-2 text-sm font-semibold text-yellow-800 dark:text-yellow-300"
						>
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
									clip-rule="evenodd"
								/>
							</svg>
							{i18n.t('lessons.hint')}
						</div>
						<div class="text-sm leading-relaxed text-yellow-900 dark:text-yellow-200">
							<Markdown markdown={hint} />
						</div>
					</div>
				{/if}
			{/if}
		</div>

		<!-- STABLE ACTION AREA -->
		<div class="flex min-h-[92px] items-center justify-center py-5">
			{#if status === 'correct'}
				<Button
					type="button"
					onclick={onNext}
					size="xl"
					rounded={true}
					variant="friendly"
					class="min-w-[240px]"
					endIcon="arrow-left"
				>
					{i18n.t('lessons.continue')}
				</Button>
			{:else if !hasCheckButton}
				<Button
					type="button"
					onclick={onNext}
					size="xl"
					rounded={true}
					variant="neutral"
					class="min-w-[240px]"
				>
					{i18n.t('lessons.continue')}
				</Button>
			{:else}
				<div class="flex flex-col items-center gap-3">
					<Button
						loading={isChecking}
						type="button"
						disabled={!canCheck || isChecking}
						onclick={onCheck}
						size="xl"
						rounded={true}
						variant="neutral"
						class="min-w-[240px]"
					>
						{isChecking ? i18n.t('lessons.checking') : i18n.t('lessons.checkAnswer')}
					</Button>
				</div>
			{/if}
		</div>
	</div>
</div>

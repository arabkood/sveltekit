<script lang="ts">
	import { slide } from 'svelte/transition';
	import { i18n } from '$i18n/i18n';
	import QuizExplanation from './QuizExplanation.svelte';
	import Button from '$ui/common/Button.svelte';

	const {
		status,
		explanation,
		xp,
		onNext
	}: { status: string; xp?: number; explanation?: string; onNext: () => void } = $props();

	let openExplanation = $state(false);
</script>

<QuizExplanation
	title={i18n.t('common.solution_explanation')}
	{explanation}
	visible={openExplanation}
	onClose={() => {
		openExplanation = false;
	}}
/>

<footer in:slide class="border-t border-gray-200 pt-4 dark:border-gray-700">
	<div class="flex min-h-[44px] items-center justify-between">
		<div class="flex items-center space-x-4">
			{#if status === 'success'}
				<span
					class="flex items-center text-sm font-semibold text-emerald-600 sm:text-base dark:text-emerald-400"
				>
					<span class="me-3 text-xl" aria-hidden="true">🏆</span>
					{i18n.t('lessons.correctAnswer')}
					{#if xp}
						+{xp} XP
					{/if}
				</span>
			{/if}
			{#if status === 'fail'}
				<span
					class="flex items-center text-sm font-semibold text-red-600 sm:text-base dark:text-red-400"
				>
					<span class="me-3 text-xl" aria-hidden="true">❌ </span>
					{i18n.t('common.false_answer')}
				</span>
			{/if}
		</div>
		<div class="flex items-center space-x-3">
			{#if (status === 'fail' || status === 'success') && explanation}
				<Button
					variant="secondary"
					onclick={() => {
						openExplanation = true;
					}}
				>
					{i18n.t('common.solution_explanation')}
				</Button>
			{/if}
			<Button type="button" onclick={onNext}>{i18n.t('common.next')}</Button>
		</div>
	</div>
</footer>

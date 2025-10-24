<script lang="ts">
	import Button from '$ui/common/Button.svelte';

	interface Props {
		onRun?: () => void;
		onSubmit?: () => void;
		runStatus: 'idle' | 'loading' | 'disabled';
		submitStatus: 'idle' | 'loading' | 'disabled';
		runCooldownDuration?: number; // Run button cooldown in seconds
		submitCooldownDuration?: number; // Submit button cooldown in seconds
	}

	let {
		onRun,
		onSubmit,
		runStatus = 'idle',
		submitStatus = 'idle',
		runCooldownDuration = 0,
		submitCooldownDuration = 0
	}: Props = $props();

	const isRunDisabled = $derived(
		runStatus === 'disabled' || runStatus === 'loading' || submitStatus === 'loading'
	);
	const isSubmitDisabled = $derived(
		submitStatus === 'disabled' || runStatus === 'loading' || submitStatus === 'loading'
	);

	// Show cooldown text when button is disabled due to cooldown
	const showRunCooldown = $derived(runStatus !== 'loading' && runCooldownDuration > 0);
	const showSubmitCooldown = $derived(submitStatus !== 'loading' && submitCooldownDuration > 0);
</script>

<footer
	class="fixed right-0 bottom-0 flex items-center justify-between bg-gray-100 p-4 md:relative dark:bg-gray-800"
>
	<div class="flex items-center gap-4">
		<Button
			onclick={onSubmit}
			disabled={isSubmitDisabled}
			size="md"
			variant="friendly"
			loading={submitStatus === 'loading'}
		>
			{showSubmitCooldown ? `تصحيح الإجابة (${submitCooldownDuration}s)` : 'تصحيح الإجابة'}
		</Button>

		<Button
			onclick={onRun}
			disabled={isRunDisabled}
			size="md"
			variant="boring"
			startIcon="play"
			loading={runStatus === 'loading'}
		>
			{showRunCooldown ? `تشغيل (${runCooldownDuration}s)` : 'تشغيل'}
		</Button>
	</div>

	<!-- Utility Icons -->
	<div class="flex items-center gap-4">
		<!-- <button onclick={onReset} disabled={loading} title="Copy Code" class={iconButtonClasses}> -->
		<!-- 	<Icon name="copy" /> -->
		<!-- </button> -->
		<!-- <button onclick={onReset} disabled={loading} title="reset code" class={iconButtonClasses}> -->
		<!-- 	<Icon name="check-circle" /> -->
		<!-- </button> -->
	</div>
</footer>

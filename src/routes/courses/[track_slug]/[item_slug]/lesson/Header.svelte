<script lang="ts">
	const {
		currentStep,
		totalSteps,
		goToStep
	}: {
		currentStep: number;
		totalSteps: number;
		goToStep: (i: number) => void;
	} = $props();
</script>

<header
	class="flex items-center justify-end border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
>
	<div class="flex items-center space-x-2">
		{#each { length: totalSteps } as _, i}
			{@const stepNumber = i + 1}
			<button
				type="button"
				class="focus-visible:ring-primary-500 h-2.5 w-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-800"
				class:bg-primary-500={i < currentStep}
				class:bg-primary-400={i === currentStep}
				class:scale-125={i === currentStep}
				class:bg-gray-300={i > currentStep}
				class:dark:bg-gray-600={i > currentStep}
				class:cursor-pointer={i < currentStep}
				class:hover:bg-primary-600={i < currentStep}
				aria-label={i < currentStep
					? `Go to step ${stepNumber}`
					: `Step ${stepNumber}${i === currentStep ? ' (Current)' : ''}`}
				disabled={i >= currentStep}
				onclick={() => goToStep(i)}
			>
				<span class="sr-only">
					{i < currentStep ? `Go to step ${stepNumber}` : `Step ${stepNumber}`}
					{i === currentStep ? ' (Current)' : ''}
					{i < currentStep ? ' (Completed)' : ''}
					{i > currentStep ? ' (Upcoming)' : ''}
				</span>
			</button>
		{/each}
	</div>
</header>

<script lang="ts">
	import { slide } from 'svelte/transition';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';

	interface InterestOption {
		id: string;
		emoji: string;
		label: string;
		description: string;
		available: boolean;
		courseSlug?: string;
		priority: 'high' | 'medium' | 'low';
	}

	let {
		allInterestOptions,
		futureInterests = $bindable([]),
		marketingConsent = $bindable(true),
		onComplete
	}: {
		allInterestOptions: InterestOption[];
		futureInterests: string[];
		onComplete: () => void;
		marketingConsent: boolean;
	} = $props();

	const unavailableOptions = $derived(allInterestOptions.filter((opt) => !opt.available));

	function toggleInterest(optionId: string): void {
		if (futureInterests.includes(optionId)) {
			futureInterests = futureInterests.filter((id) => id !== optionId);
		} else {
			futureInterests = [...futureInterests, optionId];
		}
	}
</script>

<div class="space-y-8">
	<h2 class="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
		ما الذي تريد رؤيته بعد ذلك؟
	</h2>
	<p class="text-base text-slate-600 dark:text-slate-400">
		ساعدنا في تحديد أولويات الدورات القادمة
	</p>

	<!-- Future Interests Grid -->
	<div class="mt-8 grid gap-3 sm:grid-cols-2">
		{#each unavailableOptions as option}
			<button
				onclick={() => toggleInterest(option.id)}
				class="group cursor-pointer rounded-xl border p-3.5 text-right transition-all {futureInterests.includes(
					option.id
				)
					? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/30'
					: 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500'}"
			>
				<div class="flex items-center justify-start gap-2.5">
					<div
						class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xl transition-colors {futureInterests.includes(
							option.id
						)
							? 'bg-emerald-100 dark:bg-emerald-900/50'
							: 'bg-slate-100 dark:bg-slate-700'}"
					>
						{option.emoji}
					</div>
					<h4 class="text-sm font-semibold text-slate-900 dark:text-white">
						{option.label}
					</h4>
				</div>
			</button>
		{/each}
	</div>

	<label class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
		<input
			type="checkbox"
			bind:checked={marketingConsent}
			class="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 transition-colors focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600"
		/>
		<span>أرغب في تلقي تحديثات عن الدورات الجديدة</span>
	</label>

	<Button startIcon="check" variant="friendly" size="lg" onclick={onComplete} fullWidth={true}>
		إنهاء
	</Button>
	<button
		onclick={onComplete}
		class="w-full cursor-pointer text-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
	>
		تخطي
	</button>
</div>

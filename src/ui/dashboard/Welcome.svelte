<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import { formatDate } from '$utils/formatDate';
	import { onMount } from 'svelte';
	import Button from '$ui/common/Button.svelte';
	import IconPng from '$ui/common/IconPng.svelte';
	import type { UserTrack } from '$lib/server/db/repos/class';
	import { slide } from 'svelte/transition';

	const {
		userTracks,
		name,
		is_user_premium,
		handleContinueLearning
	}: {
		userTracks: UserTrack[];
		name: string;
		is_user_premium: boolean;
		handleContinueLearning?: () => void;
	} = $props();

	const hasAnyTracks = $derived(userTracks.length > 0);

	const getCurrentDate = () =>
		formatDate(new Date(), i18n.t('date.format.today') || 'EEEE, MMMM d', i18n.t);

	const getGreeting = () => {
		const hour = new Date().getHours();

		if (hour >= 5 && hour < 12) {
			return i18n.t('dashboard.greeting.morning');
		} else if (hour >= 12 && hour < 17) {
			return i18n.t('dashboard.greeting.hi');
		} else if (hour >= 17 && hour < 22) {
			return i18n.t('dashboard.greeting.evening');
		} else {
			return i18n.t('dashboard.greeting.hi');
		}
	};

	let currentDate = $state(getCurrentDate());
	let greeting = $state(i18n.t('dashboard.greeting.hi'));

	onMount(() => {
		currentDate = getCurrentDate();
		greeting = getGreeting();
	});
</script>

<div class="bg-section mb-8 rounded-xl p-6 shadow-sm">
	<div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
		<div class="space-y-3">
			<p class="opacity-60">{currentDate}</p>
			{#if greeting !== ''}
				<div class="flex items-center gap-3">
					{#if is_user_premium}
						<IconPng name="premium" size={40} />
					{/if}
					<h1 class="text-3xl font-bold">
						{greeting}
						<span dir="ltr" class="font-hacker">{name}</span><span class="font-hacker">!</span>
					</h1>
				</div>
			{/if}
		</div>
		{#if hasAnyTracks && handleContinueLearning}
			<Button onclick={handleContinueLearning} startIcon="play" variant="secondary">
				{i18n.t('dashboard.continue_learning')}
			</Button>
		{:else if !hasAnyTracks}
			<Button href="/courses" startIcon="plus" variant="secondary">
				{i18n.t('dashboard.start_learning')}
			</Button>
		{/if}
	</div>
</div>

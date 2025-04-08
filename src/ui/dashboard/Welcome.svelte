<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
	import { i18n } from '$i18n/i18n';
	import { formatDate } from '$utils/formatDate';
	import { onMount } from 'svelte';
	import Button from '$ui/common/Button.svelte';
	import type { SelectUserTracks } from '$lib/server/db/schema/class';

	const {
		userTracks,
		name,
		is_user_premium,
		handleContinueLearning
	}: {
		userTracks: SelectUserTracks[];
		name: string;
		is_user_premium: boolean;
		handleContinueLearning?: () => void;
	} = $props();

	const hasAnyTracks = $derived(userTracks.length > 0);

	const getCurrentDate = () =>
		formatDate(new Date(), i18n.t('date.format.today') || 'EEEE, MMMM d', i18n.t);

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return i18n.t('dashboard.greeting.morning');
		if (hour < 18) return i18n.t('dashboard.greeting.afternoon');
		return i18n.t('dashboard.greeting.evening');
	};

	let currentDate = $state(getCurrentDate());
	let greeting = $state(getGreeting());
	onMount(() => {
		currentDate = getCurrentDate();
		greeting = getGreeting();
	});
</script>

<div class="bg-section mb-8 rounded-xl p-6 shadow-sm">
	<div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
		<div class="space-y-3">
			<div class="flex items-center gap-3">
				<h1 class="font-arabic text-3xl font-bold">
					{greeting}
					{name}!
				</h1>

				{#if is_user_premium}
					<span
						class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
					>
						<Icon name="star" class="me-1.5 h-4 w-4" />
						{i18n.t('common.premium')}
					</span>
				{/if}

				<span class="relative flex h-3 w-3">
					<span
						class="bg-primary-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
					>
					</span>
					<span class="bg-primary-500 relative inline-flex h-3 w-3 rounded-full"></span>
				</span>
			</div>
			<p class="opacity-60">{currentDate}</p>
		</div>
		{#if hasAnyTracks && handleContinueLearning}
			<Button onclick={handleContinueLearning} startIcon="play" variant="secondary">
				{i18n.t('dashboard.continue_learning')}
			</Button>
		{:else if !hasAnyTracks}
			<Button href="/explore-tracks" startIcon="plus" variant="secondary">
				{i18n.t('dashboard.start_learning')}
			</Button>
		{/if}
	</div>
</div>

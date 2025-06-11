<script lang="ts">
	import CardXp from './CardXP.svelte';

	let {
		totalXp,
		currentStreak,
		todayStreakCompleted,
		globalRank
	}: {
		totalXp: number;
		currentStreak: number;
		todayStreakCompleted: boolean;
		globalRank: number;
	} = $props();
</script>

<div class="mb-8 grid gap-6 lg:grid-cols-3">
	<CardXp {totalXp} />
</div>

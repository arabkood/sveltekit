<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import type { ProfileInfo, ProfileStats } from '$types/user';

	const { profile, stats } = $props<{ profile: ProfileInfo; stats: ProfileStats }>();

	const xp = tweened(0, { duration: 1000, easing: cubicOut });
	const problems = tweened(0, { duration: 1000, easing: cubicOut });
	const streak = tweened(0, { duration: 1000, easing: cubicOut });

	$effect(() => {
		xp.set(stats.xp);
		problems.set(stats.problems);
		streak.set(stats.streak);
	});

	function handleFollow() {
		alert(`Following ${profile.name}! 🎉`);
	}

	function handleMessage() {
		alert(`Opening message dialog...`);
	}
</script>

<header class="mb-8 rounded-xl bg-white p-6 shadow-lg md:p-8 dark:bg-gray-800">
	<div class="flex flex-col items-center gap-6 md:flex-row md:items-start">
		<div class="relative">
			<img
				src={profile.avatarUrl}
				alt="{profile.name}'s profile picture"
				class="h-32 w-32 rounded-full border-4 border-blue-500 object-cover shadow-md lg:h-40 lg:w-40 dark:border-blue-400"
			/>
			{#if profile.isOnline}
				<div
					class="absolute right-2 bottom-2 h-6 w-6 rounded-full border-2 border-white bg-green-500 dark:border-gray-800"
					aria-label="Online status"
					title="Online"
				></div>
			{/if}
		</div>

		<div class="flex-1 text-center md:text-left">
			<h1 class="text-3xl font-bold text-gray-900 lg:text-4xl dark:text-white">{profile.name}</h1>
			<p class="mt-1 text-gray-500 dark:text-gray-400">{profile.handle}</p>
			<p class="mt-3 max-w-xl text-gray-600 dark:text-gray-300">
				{profile.bio}
			</p>

			<div class="mt-4 flex justify-center gap-3 md:justify-start">
				<button
					class="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
					onclick={handleFollow}
				>
					Follow
				</button>
				<button
					class="rounded-lg bg-gray-200 px-5 py-2 font-semibold text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
					onclick={handleMessage}
				>
					Message
				</button>
			</div>
		</div>
	</div>

	<div
		class="mt-8 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6 text-center sm:grid-cols-4 dark:border-gray-700"
	>
		<div>
			<p class="text-2xl font-bold text-blue-500 dark:text-blue-400">
				{Math.round($xp).toLocaleString()}
			</p>
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total XP</p>
		</div>
		<div>
			<p class="text-2xl font-bold text-green-500 dark:text-green-400">
				{Math.round($problems)}
			</p>
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Problems Solved</p>
		</div>
		<div>
			<p class="text-2xl font-bold text-purple-500 dark:text-purple-400">{stats.league}</p>
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Current League</p>
		</div>
		<div>
			<p class="text-2xl font-bold text-orange-500 dark:text-orange-400">{Math.round($streak)}</p>
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Day Streak</p>
		</div>
	</div>
</header>

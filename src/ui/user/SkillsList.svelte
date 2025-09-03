<script lang="ts">
	import { onMount } from 'svelte';
	import type { Skill } from '$types/user';

	const { skills } = $props<{ skills: Skill[] }>();

	let skillElements: HTMLDivElement[] = [];

	onMount(() => {
		// Animate bars on mount
		const timeout = setTimeout(() => {
			skillElements.forEach((bar, index) => {
				if (bar && skills[index]) {
					bar.style.width = `${skills[index].level}%`;
				}
			});
		}, 100);

		return () => clearTimeout(timeout);
	});
</script>

<section class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
	<h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">Skills</h2>
	<div class="space-y-6">
		{#each skills as skill, i}
			<div>
				<div class="mb-2 flex justify-between">
					<span class="font-medium text-gray-900 dark:text-white">{skill.name}</span>
					<span class="text-sm font-medium text-gray-600 dark:text-gray-300">{skill.level}%</span>
				</div>
				<div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
					<div
						bind:this={skillElements[i]}
						class="h-2 rounded-full transition-all duration-1000 ease-out"
						style="width: 0%; background-color: {skill.color};"
					></div>
				</div>
			</div>
		{/each}
	</div>
</section>

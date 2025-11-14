<script lang="ts">
	import type { PageData } from './$types';
	import Header from './Header.svelte';
	import CompletedCourses from './CompletedCourses.svelte';

	let { data }: { data: PageData } = $props();
</script>

<Header user={data.user} userStats={data.userStats} />

{#if data.completedTracks.length > 0}
	<div class="mx-auto my-8 max-w-7xl px-4">
		<CompletedCourses tracks={data.completedTracks} />
	</div>
{/if}

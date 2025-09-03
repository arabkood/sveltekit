<script>
	import UserPage from '$ui/user/UserPage.svelte';

	let { data } = $props();
</script>

<UserPage {data} />

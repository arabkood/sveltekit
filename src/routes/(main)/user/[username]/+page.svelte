<script lang="ts">
	import { page } from '$app/state';
	import type { User } from '$lib/server/db/repos/user';
	import Header from './Header.svelte';
	import Stats from './Stats.svelte';

	const user: Partial<User> & {
		avatar?: string;
	} = {
		username: page.params.username,
		avatar: 'https://i.pinimg.com/736x/a0/36/d9/a036d937e3e53c54a62dab90a674362d.jpg'
	};
</script>

<Header {user} />

<div class="mx-auto my-8 flex max-w-7xl">
	<Stats />
</div>

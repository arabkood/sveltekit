<script lang="ts">
	import type { User } from '$lib/server/db/repos/user';
	import Avatar from '$ui/common/Avatar.svelte';
	import Icon from '$ui/common/Icon.svelte';

	const {
		user
	}: {
		user: Partial<User> & {
			avatar?: string;
		};
	} = $props();
</script>

<div
	class="mx-auto mt-8 flex max-w-7xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
>
	<div class="flex items-center justify-center p-8">
		<Avatar src={user.avatar} alt={user.username} fallback={user.username} size="5xl" />
	</div>
	<div class="flex-1 p-6 text-right">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100" dir="auto">Jane Doe</h1>
		<div class="mb-6 font-medium text-gray-500 dark:text-gray-400" dir="auto">@janedoe</div>

		<div class="mb-8">
			<p>مؤسس أكود - akood</p>
		</div>

		<div class="mb-2 flex items-center gap-3 text-sm font-normal text-gray-600 dark:text-gray-400">
			<span class="me-3">
				<Icon class="inline" name="clock" size={18} />
				<span class="inline">Joined December 2023</span>
			</span>
			<span class="me-3">
				<Icon class="inline" name="medal" size={18} />
				<span class="inline">1 likes</span>
			</span>
			<span class="me-3">
				<Icon class="inline" name="linkedin" size={18} />
				<a
					class="inline text-blue-500"
					href="https://www.akood.com"
					rel="nofollow ugc noopener noreferrer"
					target="_blank"
				>
					akood.com
				</a>
			</span>
		</div>
	</div>
</div>

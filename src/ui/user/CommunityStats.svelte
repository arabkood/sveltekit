<script lang="ts">
	import type { CommunityStats } from '$types/user';

	const { community } = $props<{ community: CommunityStats }>();
</script>

<section class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
	<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Community</h2>
	<dl class="space-y-3 text-gray-600 dark:text-gray-300">
		<div class="flex justify-between">
			<dt class="font-medium">Followers</dt>
			<dd class="font-bold text-gray-900 dark:text-white">
				{community.followers.toLocaleString()}
			</dd>
		</div>
		<div class="flex justify-between">
			<dt class="font-medium">Following</dt>
			<dd class="font-bold text-gray-900 dark:text-white">
				{community.following.toLocaleString()}
			</dd>
		</div>
		<div class="flex justify-between">
			<dt class="font-medium">Joined</dt>
			<dd class="font-bold text-gray-900 dark:text-white">{community.joinDate}</dd>
		</div>
	</dl>
</section>

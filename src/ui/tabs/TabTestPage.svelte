<script lang="ts">
	import Tab from '$ui/tabs/Tab.svelte';
	import TabList from '$ui/tabs/TabList.svelte';
	import TabPanel from '$ui/tabs/TabPanel.svelte';
	import Tabs from '$ui/tabs/Tabs.svelte';

	let activeTab = $state<number>(0);

	const handleTabChange = (index: number) => {
		console.log('Tab changed to:', index);
	};
</script>

<div class="min-h-screen bg-white p-8 dark:bg-gray-900">
	<!-- Default variant -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Default Variant</h2>
		<Tabs bind:activeTab onChange={handleTabChange}>
			<TabList>
				<Tab index={0}>Home</Tab>
				<Tab index={1}>Profile</Tab>
				<Tab index={2} badge={3}>Messages</Tab>
				<Tab index={3} disabled>Settings</Tab>
			</TabList>

			<TabPanel index={0}>
				<h3 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Home Content</h3>
				<p class="text-gray-600 dark:text-gray-400">Welcome to the home tab!</p>
			</TabPanel>

			<TabPanel index={1}>
				<h3 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Profile Content</h3>
				<p class="text-gray-600 dark:text-gray-400">Your profile information goes here.</p>
			</TabPanel>

			<TabPanel index={2}>
				<h3 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Messages</h3>
				<p class="text-gray-600 dark:text-gray-400">You have 3 new messages.</p>
			</TabPanel>

			<TabPanel index={3}>
				<h3 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h3>
				<p class="text-gray-600 dark:text-gray-400">This tab is disabled.</p>
			</TabPanel>
		</Tabs>
	</div>

	<!-- Pills variant -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Pills Variant</h2>
		<Tabs variant="pills" size="lg">
			<TabList>
				<Tab index={0}>
					{#snippet icon()}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
					{/snippet}
					Home
				</Tab>
				<Tab index={1}>
					{#snippet icon()}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					{/snippet}
					Profile
				</Tab>
				<Tab index={2} badge="New">
					{#snippet icon()}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					{/snippet}
					Settings
				</Tab>
			</TabList>

			<TabPanel index={0} transition="slide">
				<p class="text-gray-600 dark:text-gray-400">Home content with slide transition</p>
			</TabPanel>

			<TabPanel index={1} transition="slide">
				<p class="text-gray-600 dark:text-gray-400">Profile content with slide transition</p>
			</TabPanel>

			<TabPanel index={2} transition="slide">
				<p class="text-gray-600 dark:text-gray-400">Settings content with slide transition</p>
			</TabPanel>
		</Tabs>
	</div>

	<!-- Vertical tabs with enclosed variant -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
			Vertical Enclosed Variant
		</h2>
		<Tabs orientation="vertical" variant="enclosed">
			<TabList class="w-48">
				<Tab index={0}>General</Tab>
				<Tab index={1}>Security</Tab>
				<Tab index={2}>Notifications</Tab>
				<Tab index={3}>Advanced</Tab>
			</TabList>

			<TabPanel index={0}>
				<h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
					General Settings
				</h3>
				<p class="text-gray-600 dark:text-gray-400">Configure your general preferences here.</p>
			</TabPanel>

			<TabPanel index={1}>
				<h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
					Security Settings
				</h3>
				<p class="text-gray-600 dark:text-gray-400">Manage your security options.</p>
			</TabPanel>

			<TabPanel index={2}>
				<h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
					Notification Settings
				</h3>
				<p class="text-gray-600 dark:text-gray-400">Control your notification preferences.</p>
			</TabPanel>

			<TabPanel index={3}>
				<h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
					Advanced Settings
				</h3>
				<p class="text-gray-600 dark:text-gray-400">Advanced configuration options.</p>
			</TabPanel>
		</Tabs>
	</div>

	<!-- Underline variant with lazy loading -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
			Underline Variant (Full Width)
		</h2>
		<Tabs variant="underline" fullWidth>
			<TabList>
				<Tab index={0}>Overview</Tab>
				<Tab index={1}>Analytics</Tab>
				<Tab index={2}>Reports</Tab>
			</TabList>

			<TabPanel index={0} lazy>
				<p class="text-gray-600 dark:text-gray-400">Overview content - loaded immediately</p>
			</TabPanel>

			<TabPanel index={1} lazy>
				<p class="text-gray-600 dark:text-gray-400">
					Analytics content - loaded when first accessed
				</p>
			</TabPanel>

			<TabPanel index={2} lazy>
				<p class="text-gray-600 dark:text-gray-400">Reports content - loaded when first accessed</p>
			</TabPanel>
		</Tabs>
	</div>
</div>

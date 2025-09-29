<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
	import IconPng from '$ui/common/IconPng.svelte';

	const items = [
		{
			value: '3',
			label: 'Streak',
			icon: 'fire',
			iconType: 'png'
		},
		{
			value: '20979',
			label: 'XP',
			icon: 'bolt',
			iconType: 'png'
		},
		{
			value: 'Bronze',
			label: 'Rank',
			icon: 'level_badges_4',
			iconType: 'png'
		},
		{
			value: '130',
			label: 'Completed items',
			icon: 'terminal',
			iconType: 'png'
		}
	];
</script>

<div class="grid w-full grid-cols-2 gap-2 lg:grid-cols-4">
	{#each items as item}
		<div
			class="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 px-3 py-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
		>
			<div>
				{#if item.iconType === 'png'}
					<IconPng name={item.icon as any} size={48} />
				{:else}
					<div class="p-[12px]">
						<Icon name={item.icon as any} size={24} />
					</div>
				{/if}
			</div>
			<div>
				<p class="font-hacker text-xl leading-5 font-semibold">{item.value}</p>
				<p class="text-sm font-medium opacity-70">{item.label}</p>
			</div>
		</div>
	{/each}
</div>

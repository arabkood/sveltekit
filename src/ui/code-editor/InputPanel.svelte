<script lang="ts">
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import { fly } from 'svelte/transition';

	type InputItem = {
		id: number;
		value: string;
	};

	let {
		inputs = $bindable()
	}: {
		inputs: InputItem[];
	} = $props();

	let nextId = $state(0);

	function addInput() {
		inputs.push({ id: nextId, value: '' });
		nextId++;
	}

	function removeInput(id: number) {
		inputs = inputs.filter((input) => input.id !== id);
	}
</script>

<div class="h-full w-full bg-gray-50 p-4 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
	<header class="mb-4 flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold">المدخلات (Inputs)</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				أضف المدخلات التي يتوقعها برنامجك، كل سطر يمثل إدخالاً منفصلاً.
			</p>
		</div>
		<Button
			onclick={addInput}
			title="إضافة مدخل جديد"
			aria-label="إضافة مدخل جديد"
			size="icon"
			variant="friendly"
		>
			<Icon name="plus" />
		</Button>
	</header>

	<div class="space-y-2 overflow-y-auto" style="max-height: calc(100% - 80px);">
		{#if inputs.length > 0}
			{#each inputs as input (input.id)}
				<div class="flex items-center gap-3" transition:fly={{ y: -15, duration: 200 }}>
					<input
						type="text"
						bind:value={input.value}
						placeholder="أدخل القيمة هنا..."
						class="focus:border-primary-500 dark:focus:border-primary-400 flex-grow rounded-md border border-gray-300 bg-white p-2 transition-shadow focus:outline-none dark:border-gray-600 dark:bg-gray-800"
					/>
					<button
						onclick={() => removeInput(input.id)}
						title="حذف المدخل"
						aria-label="حذف المدخل"
						class="flex-shrink-0 rounded-full p-2 text-gray-400 transition-colors duration-200 hover:text-red-500 focus:bg-gray-200 focus:outline-none dark:hover:text-red-400 dark:focus:bg-gray-700"
					>
						<Icon name="x" size={20} />
					</button>
				</div>
			{/each}
		{/if}
	</div>
</div>

<script lang="ts">
	let {
		length = 6,
		value = [],
		onChange,
		disabled = false
	} = $props<{
		length?: number;
		disabled?: boolean;
		value?: string[];
		onChange?: (code: string[]) => void;
	}>();

	let inputRefs = $state<(HTMLInputElement | null)[]>(Array(length).fill(null));
	let code = $state<string[]>(value);

	const handleInput = (index: number, event: Event) => {
		const input = event.target as HTMLInputElement;
		const value = input.value;

		// Only allow numbers
		if (!/^\d*$/.test(value)) {
			input.value = '';
			return;
		}

		// Update the code array
		code[index] = value;

		// Auto-focus next input
		if (value && index < length - 1) {
			inputRefs[index + 1]?.focus();
		}

		onChange?.(code);
	};

	const handleKeyDown = (index: number, event: KeyboardEvent) => {
		// Handle backspace
		if (event.key === 'Backspace' && !code[index] && index > 0) {
			inputRefs[index - 1]?.focus();
		}

		// Handle left arrow
		if (event.key === 'ArrowLeft' && index > 0) {
			inputRefs[index - 1]?.focus();
		}

		// Handle right arrow
		if (event.key === 'ArrowRight' && index < length - 1) {
			inputRefs[index + 1]?.focus();
		}
	};

	const handlePaste = (event: ClipboardEvent) => {
		event.preventDefault();
		const pastedData = event.clipboardData?.getData('text');
		if (!pastedData) return;

		const numbers = pastedData.replace(/\D/g, '').slice(0, length).split('');
		code = [...numbers, ...Array(length - numbers.length).fill('')];

		// Focus the next empty input or the last input if all are filled
		const nextEmptyIndex = code.findIndex((v) => !v);
		if (nextEmptyIndex !== -1) {
			inputRefs[nextEmptyIndex]?.focus();
		} else {
			inputRefs[length - 1]?.focus();
		}

		onChange?.(code);
	};
</script>

<div class="flex justify-center gap-2" dir="ltr">
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#each Array(length) as _, index}
		<input
			type="text"
			maxlength="1"
			class="focus:border-primary-600 focus:ring-primary-600 dark:focus:border-primary-500 dark:focus:ring-primary-500 h-12 w-12 rounded-lg border border-gray-300 bg-gray-50 text-center text-xl font-semibold text-gray-900 placeholder-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
			bind:this={inputRefs[index]}
			value={code[index]}
			placeholder={String(index + 1)}
			oninput={(e) => handleInput(index, e)}
			onkeydown={(e) => handleKeyDown(index, e)}
			onpaste={handlePaste}
			{disabled}
		/>
	{/each}
</div>

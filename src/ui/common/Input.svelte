<script lang="ts">
	import { cn } from '$utils/classnames';
	import Icon from '$ui/common/Icon.svelte';
	import { uniqueId } from 'lodash-es';
	import type { IconId } from '$ui/shared/SvgSprite.svelte';
	import { slide } from 'svelte/transition';

	let {
		class: className = '',
		type = 'text',
		label,
		icon,
		placeholder = '',
		disabled = false,
		error = '',
		...props
	} = $props<{
		class?: string;
		type?: 'text' | 'email' | 'password';
		label?: string;
		icon?: IconId;
		placeholder?: string;
		disabled?: boolean;
		error?: string;
		[key: string]: unknown;
	}>();

	let showPassword = $state(false);
	const isPassword = $derived(type === 'password');
	const inputId = uniqueId('form-input_');

	const inputClasses = $derived(
		cn(
			'block w-full rounded-lg border bg-input px-2.5 py-2 text-sm dark:placeholder-gray-400 ',
			error
				? 'border-red-500 focus:border-red-500 focus:ring-red-500'
				: 'border-gray-300 focus:border-primary-600 focus:ring-primary-600 dark:focus:border-primary-500 dark:focus:ring-primary-500 dark:border-gray-600',
			icon ? 'pl-10' : '',
			isPassword ? 'pr-10' : '',
			className
		)
	);
</script>

<div class="w-full">
	{#if label}
		<label for={inputId} class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
			{label}
		</label>
	{/if}
	<div class="relative">
		{#if icon}
			<div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
				<Icon name={icon} class={cn('h-5 w-5', error ? 'text-red-400' : 'text-gray-400')} />
			</div>
		{/if}
		<input
			{...props}
			id={inputId}
			type={isPassword ? (showPassword ? 'text' : 'password') : type}
			class={inputClasses}
			{placeholder}
			{disabled}
			aria-invalid={!!error}
			aria-errormessage={error ? `${inputId}-error` : undefined}
		/>
		{#if isPassword}
			<div class="absolute inset-y-0 right-0 z-10 flex items-center pr-2">
				<button
					type="button"
					class="rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-primary-600"
					onclick={() => (showPassword = !showPassword)}
					title={showPassword ? 'Hide password' : 'Show password'}
				>
					<Icon
						name={showPassword ? 'eye-off' : 'eye'}
						class={'h-5 w-5 text-gray-400 hover:text-gray-500'}
					/>
				</button>
			</div>
		{/if}
	</div>
	{#if error}
		<div
			transition:slide={{ duration: 400 }}
			id={`${inputId}-error`}
			class="mt-1 flex items-center gap-x-1 text-sm text-red-600"
		>
			<Icon name="alert-circle" class="h-5 w-5" />
			<span>{error}</span>
		</div>
	{/if}
</div>

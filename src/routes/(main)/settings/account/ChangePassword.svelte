<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import Banner from '$ui/common/Banner.svelte';
	import Button from '$ui/common/Button.svelte';
	import Input from '$ui/common/Input.svelte';
	import { enhance } from '$app/forms';

	let status = $state<'idle' | 'loading' | 'success'>('idle');

	let { form } = $props();
</script>

<form method="POST" action="?/changePassword" use:enhance={() => {
	status = 'loading';
	return async ({ result, update }) => {
		if (result.type === 'success') {
			status = 'success';
			setTimeout(() => {
				location.href = '/';
			}, 2000);
		} else {
			status = 'idle';
		}
		await update();
	};
}} class="bg-section flex-1 space-y-6 rounded-lg p-8 shadow">
	<h2 class="text-2xl font-bold">{i18n.t('settings.password.changePassword')}</h2>

	<div class="w-full space-y-4">
		<div class="w-full">
			<Input
				label={i18n.t('common.currentPassword')}
				placeholder={i18n.t('common.currentPasswordPlaceholder')}
				type="password"
				icon="key"
				disabled={status === 'loading'}
				required={true}
				dir="ltr"
				class="placeholder-rtl"
				name="currentPassword"
				error={form?.errors?.currentPassword ? i18n.t(form.errors.currentPassword[0]) : undefined}
			/>
		</div>
		<div class="w-full">
			<Input
				label={i18n.t('common.newPassword')}
				placeholder={i18n.t('common.newPasswordPlaceholder')}
				type="password"
				icon="key"
				disabled={status === 'loading'}
				required={true}
				dir="ltr"
				class="placeholder-rtl"
				name="newPassword"
				error={form?.errors?.newPassword ? i18n.t(form.errors.newPassword[0]) : undefined}
			/>
		</div>
		<div class="w-full">
			<Input
				label={i18n.t('common.confirmPassword')}
				placeholder={i18n.t('common.confirmPasswordPlaceholder')}
				type="password"
				icon="key"
				disabled={status === 'loading'}
				required={true}
				dir="ltr"
				class="placeholder-rtl"
				name="confirmPassword"
				error={form?.errors?.confirmPassword ? i18n.t(form.errors.confirmPassword[0]) : undefined}
			/>
		</div>
	</div>

	{#if form?.error}
		<Banner variant="error" class="mb-4" message={i18n.t(form.error)} />
	{/if}

	{#if form?.success || status === 'success'}
		<Banner
			variant="success"
			class="mb-4"
			message={i18n.t('settings.password.changePasswordSuccess')}
		/>
	{/if}

	<div class="flex pt-4">
		<Button
			class="ms-auto"
			variant="default"
			disabled={status === 'success' || status === 'loading'}
			type="submit"
			loading={status === 'loading'}
		>
			{i18n.t('settings.password.saveButton')}</Button
		>
	</div>
</form>

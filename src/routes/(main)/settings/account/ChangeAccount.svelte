<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import type { UserPrivate } from '$lib/server/db/repos/user';
	import Banner from '$ui/common/Banner.svelte';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import Input from '$ui/common/Input.svelte';
	import { enhance } from '$app/forms';

	let status = $state<'idle' | 'loading' | 'success'>('idle');

	let {
		user,
		form
	}: {
		user: UserPrivate;
		form: any;
	} = $props();
</script>

<form method="POST" action="?/changeAccount" use:enhance={() => {
	status = 'loading';
	return async ({ result, update }) => {
		if (result.type === 'success') {
			status = 'success';
			setTimeout(() => {
				location.reload();
			}, 1000);
		} else {
			status = 'idle';
		}
		await update();
	};
}} class="bg-section flex-1 space-y-6 rounded-lg p-8 shadow">
	<h2 class="text-2xl font-bold">{i18n.t('settings.account.accountSettings')}</h2>

	<!-- Email Section -->
	<div class="w-full space-y-4">
		<div class="w-full">
			<label class="mb-2 block text-sm font-medium">
				{i18n.t('common.email')}
			</label>
			<div class="flex items-center gap-3">
				<span class="text-sm">{user.email || 'No email'}</span>
				{#if user.emailVerified}
					<Icon name="check-circle" class="text-green-500" />
				{:else}
					<Icon name="x-circle" class="text-yellow-600" />
				{/if}
			</div>
		</div>
	</div>

	<!-- Profile Section -->
	<div class="w-full space-y-4">
		<div class="w-full">
			<Input
				label={i18n.t('common.username')}
				placeholder={i18n.t('common.usernamePlaceholder')}
				type="text"
				icon="user"
				disabled={status === 'loading'}
				required={true}
				dir="ltr"
				class="placeholder-rtl"
				name="username"
				value={form?.values?.username ?? user.username}
				error={status === 'idle' && form?.errors?.username ? i18n.t(form.errors.username[0]) : undefined}
			/>
		</div>
	</div>

	{#if form?.error && form?.action === 'changeAccount'}
		<Banner variant="error" class="mb-4" message={i18n.t(form.error, { retryAfterSecs: String(form?.retryAfterSecs ?? '') })} />
	{/if}

	{#if (form?.success && form?.action === 'changeAccount') || status === 'success'}
		<Banner
			variant="success"
			class="mb-4"
			message={i18n.t('settings.account.updateAccountSuccess')}
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
			{i18n.t('settings.account.saveButton')}
		</Button>
	</div>
</form>

<script lang="ts">
	import { API_ENDPOINTS } from '$api/config';
	import { i18n } from '$i18n/i18n';
	import type { ApiError } from '$types/api';
	import Banner from '$ui/common/Banner.svelte';
	import Button from '$ui/common/Button.svelte';
	import Input from '$ui/common/Input.svelte';

	import { createForm, z } from '$utils/createForm.svelte';

	const schema = z
		.object({
			currentPassword: z
				.string()
				.min(8, i18n.t('validation.password.minLength'))
				.max(100, i18n.t('validation.password.maxLength'))
				.regex(/[0-9]/, i18n.t('validation.password.number')),
			newPassword: z
				.string()
				.min(8, i18n.t('validation.password.minLength'))
				.max(100, i18n.t('validation.password.maxLength'))
				.regex(/[0-9]/, i18n.t('validation.password.number')),
			confirmPassword: z.string().min(1, i18n.t('validation.confirmPassword.required'))
		})
		.refine((data) => data.newPassword === data.confirmPassword, {
			message: i18n.t('validation.confirmPassword.match'),
			path: ['confirmPassword']
		});

	let status = $state<'idle' | 'loading' | 'success'>('idle');
	let submitError = $state<null | string>(null);

	const form = createForm(
		{
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		},
		schema,
		async (values) => {
			if (!form.state.isValid) return;
			status = 'loading';
			submitError = null;

			const response = await fetch(API_ENDPOINTS.auth.changePassword, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					oldPassword: values.currentPassword,
					newPassword: values.newPassword
				}),
				credentials: 'include'
			});

			if (!response.ok) {
				const error: ApiError = await response.json();
				submitError = error.error;
				status = 'idle';
				return;
			}

			const data: { success: boolean } = await response.json();

			if (data.success) {
				status = 'success';

				setTimeout(() => {
					location.href = '/';
				}, 2000);
				return;
			}
			status = 'idle';
			submitError = i18n.error('INTERNAL_ERROR');
		}
	);
</script>

<form onsubmit={form.handleSubmit} class="bg-section flex-1 space-y-6 rounded-lg p-8 shadow">
	<h2 class="text-2xl font-bold">{i18n.t('settings.password.changePassword')}</h2>

	<div class="w-full space-y-4">
		<div class="w-full">
			<Input
				label={i18n.t('common.currentPassword')}
				placeholder={i18n.t('common.currentPasswordPlaceholder')}
				type="password"
				icon="key"
				disabled={form.state.isSubmitting}
				required={true}
				dir="ltr"
				class="placeholder-rtl"
				name="currentPassword"
				value={form.state.values.currentPassword}
				onchange={form.handleChange}
				error={form.state.touched.currentPassword ? form.state.errors.currentPassword : undefined}
			/>
		</div>
		<div class="w-full">
			<Input
				label={i18n.t('common.newPassword')}
				placeholder={i18n.t('common.newPasswordPlaceholder')}
				type="password"
				icon="key"
				disabled={form.state.isSubmitting}
				required={true}
				dir="ltr"
				class="placeholder-rtl"
				name="newPassword"
				value={form.state.values.newPassword}
				onchange={form.handleChange}
				error={form.state.touched.newPassword ? form.state.errors.newPassword : undefined}
			/>
		</div>
		<div class="w-full">
			<Input
				label={i18n.t('common.confirmPassword')}
				placeholder={i18n.t('common.confirmPasswordPlaceholder')}
				type="password"
				icon="key"
				disabled={form.state.isSubmitting}
				required={true}
				dir="ltr"
				class="placeholder-rtl"
				name="confirmPassword"
				value={form.state.values.confirmPassword}
				onchange={form.handleChange}
				error={form.state.touched.confirmPassword ? form.state.errors.confirmPassword : undefined}
			/>
		</div>
	</div>

	{#if submitError}
		<Banner variant="error" class="mb-4" message={i18n.error(submitError)} />
	{/if}

	{#if status === 'success'}
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
			disabled={!form.state.isValid ||
				form.state.isSubmitting ||
				status === 'success' ||
				status === 'loading'}
			type="submit"
			loading={status === 'loading'}
		>
			{i18n.t('settings.password.saveButton')}</Button
		>
	</div>
</form>

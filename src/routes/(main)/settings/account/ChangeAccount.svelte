<script lang="ts">
	import { API_ENDPOINTS } from '$api/config';
	import { i18n } from '$i18n/i18n';
	import type { User } from '$lib/server/db/repos/user';
	import type { ApiError } from '$types/api';
	import Banner from '$ui/common/Banner.svelte';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import Input from '$ui/common/Input.svelte';

	import { createForm, z } from '$utils/createForm.svelte';

	let {
		user
	}: {
		user: User;
	} = $props();

	const schema = z.object({
		username: z
			.string()
			.min(4, i18n.t('validation.username.minLength'))
			.max(40, i18n.t('validation.username.maxLength'))
			.regex(/^[a-zA-Z0-9_-]+$/, i18n.t('validation.username.pattern'))
	});

	let status = $state<'idle' | 'loading' | 'success'>('idle');
	let submitError = $state<null | string>(null);

	const form = createForm(
		{
			username: user.username || ''
			// TODO: avatar
		},
		schema,
		async (values) => {
			if (!form.state.isValid) return;
			status = 'loading';
			submitError = null;

			const response = await fetch(API_ENDPOINTS.user.me.put, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: values.username
				}),
				credentials: 'include'
			});

			if (!response.ok) {
				const error: ApiError = await response.json();
				submitError = error.error;
				status = 'idle';
				return;
			}

			const data: User = await response.json();

			if (data.username === values.username) {
				status = 'success';
				user.username = values.username;

				setTimeout(() => {
					location.reload();
				}, 1000);
				return;
			}
			status = 'idle';
			submitError = i18n.error('INTERNAL_ERROR');
		}
	);

	// let avatar = $state<{
	// 	error?: string;
	// 	preview?: string;
	// 	file?: File;
	// }>({
	// 	error: '',
	// 	preview: '',
	// 	file: undefined
	// });

	// const handleAvatarChange = (event: Event) => {
	// 	const input = event.target as HTMLInputElement;
	// 	const file = input.files?.[0];

	// 	if (file) {
	// 		if (file.size > 5 * 1024 * 1024) {
	// 			avatar.error = 'Image must be less than 5MB';
	// 			return;
	// 		}

	// 		if (!file.type.startsWith('image/')) {
	// 			avatar.error = 'Please upload an image file';
	// 			return;
	// 		}

	// 		avatar.file = file;
	// 		avatar.preview = URL.createObjectURL(file);
	// 		avatar.error = '';
	// 	}
	// };
</script>

<form onsubmit={form.handleSubmit} class="bg-section flex-1 space-y-6 rounded-lg p-8 shadow">
	<h2 class="text-2xl font-bold">{i18n.t('settings.account.accountSettings')}</h2>

	<!-- Avatar Section -->
	<!-- <div class="flex-1">
		<h3 class="mb-4 text-lg font-medium">
			{i18n.t('settings.account.profilePicture')}
		</h3>
		<div class="flex items-center gap-4">
			<Avatar src={avatar.preview} alt={user.username} fallback={user?.username} size="xl" />
			<div class="flex flex-col space-y-2">
				<Button
					variant="outline"
					onclick={() => {
						const input = document.querySelector(
							'input#settings-account-changeProfilePicture'
						) as HTMLInputElement;
						input?.click();
					}}
					disabled={true}
				>
					{i18n.t('settings.account.changeProfilePicture')}
				</Button>
				<input
					id="settings-account-changeProfilePicture"
					type="file"
					accept="image/*"
					onchange={handleAvatarChange}
					class="hidden"
				/>
				{#if avatar.error}
					<p class="text-sm text-red-500">{avatar.error}</p>
				{/if}
			</div>
		</div>
	</div> -->

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
				disabled={form.state.isSubmitting}
				required={true}
				dir="ltr"
				class="placeholder-rtl"
				name="username"
				value={form.state.values.username}
				onchange={form.handleChange}
				error={form.state.touched.username ? form.state.errors.username : undefined}
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
			message={i18n.t('settings.account.updateAccountSuccess')}
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
			{i18n.t('settings.account.saveButton')}
		</Button>
	</div>
</form>

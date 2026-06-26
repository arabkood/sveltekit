<script lang="ts">
	import { scale } from 'svelte/transition';
	import { i18n } from '$i18n/i18n';
	import Input from '$ui/common/Input.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import Button from '$ui/common/Button.svelte';
	import { enhance } from '$app/forms';

	let { form } = $props();

	let status = $state('idle');
</script>

<section class="bg-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
		<a href="/" class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
			<img class="me-2 h-8 w-8" src="/logo.svg" alt="logo" />
			{i18n.t('site.logo')}
		</a>

		{#if form?.success || status === 'success'}
			<div
				transition:scale={{ duration: 400 }}
				class="text-primary-700 dark:text-primary-500 w-full rounded-lg py-6 text-center"
			>
				<Icon name="check-circle" class="me-2 inline h-7 w-7" />
				{i18n.t('resetPassword.success')}
			</div>
		{:else}
			<div
				class="bg-section w-full rounded-lg shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700"
			>
				<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
					<h1
						class="text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white"
					>
						{i18n.t('resetPassword.title')}
					</h1>

					<p class="text-sm text-gray-500 dark:text-gray-400">
						{i18n.t('resetPassword.description')}
					</p>

					<form class="space-y-4 md:space-y-6" method="POST" use:enhance={() => {
						status = 'loading';
						return async ({ result, update }) => {
							if (result.type === 'success') {
								status = 'success';
								setTimeout(() => {
									location.href = '/signin';
								}, 1500);
							} else {
								status = 'idle';
							}
							await update();
						};
					}}>
						<Input
							label={i18n.t('common.password')}
							icon="password"
							type="password"
							name="password"
							placeholder="••••••••"
							required={true}
							dir="ltr"
							error={form?.errors?.password ? i18n.t(form.errors.password[0]) : undefined}
							disabled={status === 'loading'}
						/>

						<Input
							label={i18n.t('common.repeatPassword')}
							icon="password"
							type="password"
							name="confirmPassword"
							placeholder="••••••••"
							required={true}
							dir="ltr"
							error={form?.errors?.confirmPassword ? i18n.t(form.errors.confirmPassword[0]) : undefined}
							disabled={status === 'loading'}
						/>

						{#if form?.error}
							<div
								transition:scale={{ duration: 400 }}
								class="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/50 dark:text-red-200"
							>
								{i18n.t(form.error)}
							</div>
						{/if}

						<Button
							type="submit"
							fullWidth={true}
							disabled={status === 'loading'}
						>
							{status === 'loading'
								? i18n.t('resetPassword.submiting')
								: i18n.t('resetPassword.submit')}
						</Button>

						<p class="text-sm font-light text-gray-500 dark:text-gray-400">
							{i18n.t('resetPassword.rememberPassword')}
							<a
								href="/signin"
								class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
							>
								{i18n.t('resetPassword.signinHere')}
							</a>
						</p>
					</form>
				</div>
			</div>
		{/if}
	</div>
</section>

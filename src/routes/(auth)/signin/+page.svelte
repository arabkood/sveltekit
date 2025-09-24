<script lang="ts">
	import { scale } from 'svelte/transition';
	import { i18n } from '$i18n/i18n';
	import Input from '$ui/common/Input.svelte';
	import { createForm, z } from '$utils/createForm.svelte';
	import { API_ENDPOINTS } from '$api/config';
	import type { ApiError } from '$types/api';
	import Icon from '$ui/common/Icon.svelte';
	import Button from '$ui/common/Button.svelte';
	import { SITE_NAME_AR } from '$config';
	import Seo from '$ui/others/SEO.svelte';

	let status = $state('idle');
	let submitError = $state<null | string>(null);

	const schema = z.object({
		identifier: z
			.string()
			.min(1, i18n.t('validation.identifier.required'))
			.max(100, i18n.t('validation.identifier.maxLength')),
		password: z
			.string()
			.min(1, i18n.t('validation.password.required'))
			.max(100, i18n.t('validation.password.maxLength')),
		rememberMe: z.boolean().optional()
	});

	const form = createForm(
		{
			identifier: '',
			password: '',
			rememberMe: false
		},
		schema,
		async (values) => {
			if (!form.state.isValid) return;
			status = 'loading';
			submitError = null;

			const response = await fetch(API_ENDPOINTS.auth.signin, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
				credentials: 'include'
			});

			if (!response.ok) {
				const error: ApiError = await response.json();
				submitError = error.error;
				status = 'idle';
				return;
			}

			const data = {
				authenticated: true,
				...(await response.json())
			};

			status = 'success';

			setTimeout(() => {
				const storedRedirect = sessionStorage.getItem('redirectTo');
				sessionStorage.removeItem('redirectTo');
				// Security Check: Ensure the path is internal to our site
				let finalRedirectUrl = '/dashboard';
				if (storedRedirect && storedRedirect.startsWith('/')) {
					finalRedirectUrl = storedRedirect;
				}

				if (!data.emailVerified) {
					location.href = '/auth/verify-email';
				} else {
					location.href = finalRedirectUrl;
				}
			}, 1500);
		}
	);

	const signinTitle = `تسجيل الدخول إلى ${SITE_NAME_AR} | واصل تعلم البرمجة`;
	const signinDescription = `سجل دخولك إلى ${SITE_NAME_AR} لمواصلة رحلتك في تعلم البرمجة التفاعلية. تابع تقدمك في الكورسات والتحديات البرمجية.`;
</script>

<Seo title={signinTitle} description={signinDescription} lang="ar" />

<section class="bg-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
		<div class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
			<img class="me-2 h-8 w-8" src="/logo.svg" alt="logo" />
			{i18n.t('site.logo')}
		</div>

		{#if status === 'success'}
			<div
				transition:scale={{ duration: 400 }}
				class="x-4 text-primary-700 dark:text-primary-500 w-full rounded-lg py-6 text-center"
			>
				<Icon name="check-circle" class="me-2 inline h-7 w-7" />
				{i18n.t('signin.success')}
			</div>
		{:else}
			<div
				class="bg-section w-full rounded-lg shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700"
			>
				<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
					<h1
						class="text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white"
					>
						{i18n.t('signin.title')}
					</h1>

					<form class="space-y-4 md:space-y-6" onsubmit={form.handleSubmit}>
						<Input
							label={i18n.t('signin.identifier')}
							icon="user"
							type="text"
							name="identifier"
							placeholder="username"
							required={true}
							dir="ltr"
							value={form.state.values.identifier}
							onchange={form.handleChange}
							error={form.state.touched.identifier ? form.state.errors.identifier : undefined}
							disabled={status === 'loading' || form.state.isSubmitting}
						/>

						<Input
							label={i18n.t('common.password')}
							icon="password"
							type="password"
							name="password"
							placeholder="••••••••"
							required={true}
							dir="ltr"
							value={form.state.values.password}
							onchange={form.handleChange}
							error={form.state.touched.password ? form.state.errors.password : undefined}
							disabled={status === 'loading' || form.state.isSubmitting}
						/>

						<div class="flex items-center justify-between">
							<a
								href="/forgot-password"
								class="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
							>
								{i18n.t('signin.forgotPassword')}
							</a>
						</div>

						{#if submitError}
							<div
								transition:scale={{ duration: 400 }}
								class="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/50 dark:text-red-200"
							>
								{i18n.error(submitError)}
							</div>
						{/if}

						<Button
							type="submit"
							disabled={status === 'loading' || form.state.isSubmitting}
							fullWidth={true}
						>
							{status === 'loading' ? i18n.t('signin.submiting') : i18n.t('signin.submit')}
						</Button>

						<p class="text-sm font-light text-gray-500 dark:text-gray-400">
							{i18n.t('signin.noAccount')}
							<a
								href="/signup"
								class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
							>
								{i18n.t('signin.signupHere')}
							</a>
						</p>
					</form>
				</div>
			</div>
		{/if}
	</div>
</section>

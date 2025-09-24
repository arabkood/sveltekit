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

	const schema = z
		.object({
			email: z
				.string()
				.min(1, i18n.t('validation.email.required'))
				.email(i18n.t('validation.email.invalid'))
				.max(100, i18n.t('validation.email.maxLength')),
			username: z
				.string()
				.min(4, i18n.t('validation.username.minLength'))
				.max(40, i18n.t('validation.username.maxLength'))
				.regex(/^[a-zA-Z0-9_-]+$/, i18n.t('validation.username.pattern')),
			password: z
				.string()
				.min(8, i18n.t('validation.password.minLength'))
				.max(100, i18n.t('validation.password.maxLength'))
				.regex(/[0-9]/, i18n.t('validation.password.number')),
			confirmPassword: z.string().min(1, i18n.t('validation.confirmPassword.required'))
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: i18n.t('validation.confirmPassword.match'),
			path: ['confirmPassword']
		});

	const form = createForm(
		{
			username: '',
			email: '',
			password: '',
			confirmPassword: ''
		},
		schema,
		async (values) => {
			if (!form.state.isValid) return;
			status = 'loading';
			submitError = null;

			const response = await fetch(API_ENDPOINTS.auth.signup, {
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
				canResendCodeAt: Date.now() + 60 * 1000,
				...(await response.json())
			};

			status = 'success';

			setTimeout(() => {
				if (data.emailVerified) {
					location.href = '/signin';
				} else {
					location.href = '/signup/verify-email';
				}
			}, 2000);
		}
	);

	const signupTitle = `انضم إلى ${SITE_NAME_AR} مجاناً | ابدأ تعلم البرمجة تفاعلياً`;
	const signupDescription = `سجل في ${SITE_NAME_AR} مجاناً وابدأ رحلتك في تعلم البرمجة بالممارسة العملية. أكثر من 50 تمرين تفاعلي، تحديات برمجية، وتطبيق مباشر بدون فيديوهات.`;
</script>

<Seo title={signupTitle} description={signupDescription} lang="ar" />

<section class="bg-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
		<div class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
			<img class="me-2 h-8 w-8" src="/logo.svg" alt="logo" />
			{i18n.t('site.logo')}
		</div>

		{#if status === 'success'}
			<div
				in:scale={{ duration: 400 }}
				class="x-4 text-primary-700 dark:text-primary-500 w-full rounded-lg py-6 text-center"
			>
				<Icon name="check-circle" class="me-2 inline h-7 w-7" />
				{i18n.t('signup.success')}
			</div>
		{:else}
			<div
				class="bg-section w-full rounded-lg shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700"
			>
				<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
					<h1
						class="text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white"
					>
						{i18n.t('signup.title')}
					</h1>

					<form class="space-y-4 md:space-y-6" onsubmit={form.handleSubmit}>
						<Input
							label={i18n.t('common.username')}
							icon="user"
							type="text"
							name="username"
							placeholder="username"
							required={true}
							dir="ltr"
							value={form.state.values.username}
							onchange={form.handleChange}
							error={form.state.touched.username ? form.state.errors.username : undefined}
							disabled={status === 'loading' || form.state.isSubmitting}
						/>

						<Input
							label={i18n.t('common.email')}
							icon="email"
							type="email"
							name="email"
							placeholder="name@example.com"
							required={true}
							dir="ltr"
							value={form.state.values.email}
							onchange={form.handleChange}
							error={form.state.touched.email ? form.state.errors.email : undefined}
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

						<Input
							label={i18n.t('common.repeatPassword')}
							icon="password"
							type="password"
							name="confirmPassword"
							placeholder="••••••••"
							required={true}
							dir="ltr"
							value={form.state.values.confirmPassword}
							onchange={form.handleChange}
							error={form.state.touched.confirmPassword
								? form.state.errors.confirmPassword
								: undefined}
							disabled={status === 'loading' || form.state.isSubmitting}
						/>

						<div class="col-span-6">
							<p class="text-sm text-gray-500 dark:text-gray-400">
								{i18n.t('signup.terms')}
							</p>
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
							fullWidth={true}
							disabled={status === 'loading' || form.state.isSubmitting}
						>
							{status === 'loading' ? i18n.t('signup.submiting') : i18n.t('signup.submit')}
						</Button>

						<p class="text-sm font-light text-gray-500 dark:text-gray-400">
							{i18n.t('signup.haveAccount')}
							<a
								href="/signin"
								class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
							>
								{i18n.t('signup.signinHere')}
							</a>
						</p>
					</form>
				</div>
			</div>
		{/if}
	</div>
</section>

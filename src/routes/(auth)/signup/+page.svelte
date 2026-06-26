<script lang="ts">
	import { scale } from 'svelte/transition';
	import { i18n } from '$i18n/i18n';
	import Input from '$ui/common/Input.svelte';
	import Button from '$ui/common/Button.svelte';
	import { SITE_NAME_AR } from '$config';
	import Seo from '$ui/others/SEO.svelte';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	let { form } = $props();

	let status = $state('idle');

	onMount(() => {
		window.posthog?.capture('signup_started', {
			method: 'email'
		});
	});

	const signupTitle = `انضم إلى ${SITE_NAME_AR} مجاناً | ابدأ تعلم البرمجة تفاعلياً`;
	const signupDescription = `سجل في ${SITE_NAME_AR} مجاناً وابدأ رحلتك في تعلم البرمجة بالممارسة العملية. أكثر من 50 تمرين تفاعلي، تحديات برمجية، وتطبيق مباشر بدون فيديوهات.`;
</script>

<Seo title={signupTitle} description={signupDescription} lang="ar" />

<section class="bg-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
		<a href="/" class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
			<img class="me-2 h-8 w-8" src="/logo.svg" alt="logo" />
			{i18n.t('site.logo')}
		</a>

		<div
			class="bg-section w-full rounded-lg shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700"
		>
			<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
				<h1
					class="text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white"
				>
					{i18n.t('signup.title')}
				</h1>

				<form
					class="space-y-4 md:space-y-6"
					method="POST"
					use:enhance={() => {
						status = 'loading';
						return async ({ result, update }) => {
							if (result.type === 'redirect') {
								status = 'success';
								window.posthog?.capture('signup_completed', { method: 'email' });
							} else {
								status = 'idle';
							}
							await update();
						};
					}}
				>
					<Input
						label={i18n.t('common.username')}
						icon="user"
						type="text"
						name="username"
						placeholder="username"
						required={true}
						dir="ltr"
						value={form?.values?.username ?? ''}
						error={form?.errors?.username ? i18n.t(form.errors.username[0]) : undefined}
						disabled={status === 'loading'}
					/>

					<Input
						label={i18n.t('common.email')}
						icon="email"
						type="email"
						name="email"
						placeholder="name@example.com"
						required={true}
						dir="ltr"
						value={form?.values?.email ?? ''}
						error={form?.errors?.email ? i18n.t(form.errors.email[0]) : undefined}
						disabled={status === 'loading'}
					/>

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
						error={form?.errors?.confirmPassword
							? i18n.t(form.errors.confirmPassword[0])
							: undefined}
						disabled={status === 'loading'}
					/>

					<div class="col-span-6">
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{i18n.t('signup.terms')}
						</p>
					</div>

					{#if form?.error}
						<div
							transition:scale={{ duration: 400 }}
							class="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/50 dark:text-red-200"
						>
							{i18n.t(form.error, { retryAfterSecs: String(form?.retryAfterSecs ?? '') })}
						</div>
					{/if}

					<Button type="submit" fullWidth={true} disabled={status === 'loading'}>
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
	</div>
</section>

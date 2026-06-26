<script lang="ts">
	import { scale } from 'svelte/transition';
	import { i18n } from '$i18n/i18n';
	import Icon from '$ui/common/Icon.svelte';
	import CodeInput from '$ui/common/CodeInput.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Button from '$ui/common/Button.svelte';
	import { enhance } from '$app/forms';

	let status = $state('idle');
	let verificationCode = $state<string[]>(Array(6).fill(''));

	const { data, form }: { data: PageData, form: any } = $props();
	const { user } = data;

	if (!user || user.emailVerified || !user.email) {
		location.href = '/';
	}
	
	let cooldown = $state<number>(30);

	onMount(() => {
		const i = setInterval(() => {
			if (cooldown > 0) cooldown--;
		}, 1000);

		window.posthog?.capture('email_verification_started', {
			email: user?.email
		});

		return () => clearInterval(i);
	});

	const handleCodeChange = (code: string[]) => {
		verificationCode = code;
	};
</script>

<section class="bg-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
		<div class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
			<img class="me-2 h-8 w-8" src="/logo.svg" alt="logo" />
			{i18n.t('site.logo')}
		</div>

		{#if form?.success || status === 'success'}
			<div
				transition:scale={{ duration: 400 }}
				class="text-primary-700 dark:text-primary-500 w-full rounded-lg py-6 text-center"
			>
				<Icon name="check-circle" class="me-2 inline h-7 w-7" />
				{i18n.t('verifyEmail.success')}
			</div>
		{:else}
			<div
				class="bg-section w-full rounded-lg shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700"
			>
				<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
					<h1
						class="text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white"
					>
						{i18n.t('verifyEmail.title')}
					</h1>

					<p class="text-sm text-gray-500 dark:text-gray-400">
						{i18n.t('verifyEmail.description')}
					</p>

					<form class="space-y-4 md:space-y-6" method="POST" action="?/default" use:enhance={() => {
						status = 'loading';
						return async ({ result, update }) => {
							if (result.type === 'success') {
								status = 'success';
								window.posthog?.capture('email_verification_completed', { email: user?.email });
								setTimeout(() => {
									location.href = '/dashboard';
								}, 1500);
							} else {
								status = 'idle';
							}
							await update();
						};
					}}>
						<input type="hidden" name="code" value={verificationCode.join('')} />
						<CodeInput
							length={6}
							value={verificationCode}
							onChange={handleCodeChange}
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

						<Button type="submit" fullWidth={true} disabled={status === 'loading'}>
							{status === 'loading'
								? i18n.t('verifyEmail.verifying')
								: i18n.t('verifyEmail.verify')}
						</Button>
					</form>

					<form method="POST" action="?/resend" use:enhance={() => {
						return async ({ result, update }) => {
							if (result.type === 'success') {
								cooldown = 60;
							}
							await update();
						};
					}}>
						<p class="text-center text-sm font-light text-gray-500 dark:text-gray-400 mt-4">
							{i18n.t('verifyEmail.noCode')}
							<button
								type="submit"
								disabled={cooldown > 0}
								class={cooldown > 0
									? 'cursor-default font-medium text-gray-700 dark:text-gray-300'
									: 'text-primary-600 dark:text-primary-500 cursor-pointer font-medium hover:underline'}
							>
								{i18n.t('verifyEmail.resend')}
								{#if cooldown > 0}
									({cooldown})
								{/if}
							</button>
						</p>
					</form>
				</div>
			</div>
		{/if}
	</div>
</section>

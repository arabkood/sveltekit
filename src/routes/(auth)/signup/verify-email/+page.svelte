<script lang="ts">
	import { scale } from 'svelte/transition';
	import { i18n } from '$i18n/i18n';
	import { API_ENDPOINTS } from '$api/config';
	import type { ApiError } from '$types/api';
	import Icon from '$ui/common/Icon.svelte';
	import CodeInput from '$ui/common/CodeInput.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let status = $state('idle');
	let submitError = $state<null | string>(null);
	let verificationCode = $state<string[]>(Array(6).fill(''));

	const { data }: { data: PageData } = $props();
	const { user } = data;

	if (!user || user.emailVerified) {
		location.href = '/';
		goto('/', {
			invalidateAll: true
		});
	}
	let cooldown = $state<number>(30);

	onMount(() => {
		const i = setInterval(() => {
			cooldown--;
		}, 1000);

		return () => clearInterval(i);
	});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		if (verificationCode.some((v) => !v)) {
			submitError = 'validation.verificationCode.incomplete';
			return;
		}

		status = 'loading';
		submitError = null;

		const code = verificationCode.join('');

		try {
			const response = await fetch(API_ENDPOINTS.auth.verifyEmail, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code: code, email: user.email }),
				credentials: 'include'
			});

			if (!response.ok) {
				const error: ApiError = await response.json();
				console.log(error);
				submitError = error.error;
				status = 'idle';
				return;
			}

			status = 'success';
			setTimeout(() => {
				location.href = '/';
			}, 1500);
		} catch {
			submitError = 'SOMETHING_WENT_WRONG';
			status = 'idle';
		}
	};

	const handleCodeChange = (code: string[]) => {
		verificationCode = code;
	};

	const resendCode = async () => {
		if (cooldown > 0) return;
		try {
			await fetch(API_ENDPOINTS.auth.resendEmailVerification, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: user.email })
			});

			const canResendCodeAt = Date.now() + 60 * 1000;
			cooldown = Math.floor((canResendCodeAt - Date.now()) / 1000);
		} catch {
			// Handle error silently
		}
	};
</script>

<section class="bg-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
		<div class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
			<img class="me-2 h-8 w-8" src="/logo.svg" alt="logo" />
			{i18n.t('site.logo')}
		</div>

		{#if status === 'success'}
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

					<form class="space-y-4 md:space-y-6" onsubmit={handleSubmit}>
						<CodeInput
							length={6}
							value={verificationCode}
							onChange={handleCodeChange}
							disabled={status === 'loading'}
						/>

						{#if submitError}
							<div
								transition:scale={{ duration: 400 }}
								class="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/50 dark:text-red-200"
							>
								{i18n.error(submitError)}
							</div>
						{/if}

						<button
							type="submit"
							class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-black focus:ring-4 focus:outline-none disabled:opacity-50"
							disabled={status === 'loading'}
						>
							{status === 'loading'
								? i18n.t('verifyEmail.verifying')
								: i18n.t('verifyEmail.verify')}
						</button>

						<p class="text-center text-sm font-light text-gray-500 dark:text-gray-400">
							{i18n.t('verifyEmail.noCode')}
							<button
								type="button"
								onclick={resendCode}
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

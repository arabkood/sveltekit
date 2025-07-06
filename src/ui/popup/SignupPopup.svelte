<script lang="ts">
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let {
		onClose,
		redirectUrl
	}: {
		onClose: () => void;
		redirectUrl: string;
	} = $props();

	function handleNavigation(authPath: '/signup' | '/signin') {
		if (typeof window !== 'undefined') {
			sessionStorage.setItem('redirectTo', redirectUrl);
			location.href = authPath;
		}
	}
</script>

<!-- The main container with an overlay -->
<div
	dir="rtl"
	class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
	aria-modal="true"
	role="dialog"
	aria-labelledby="signup-title"
	transition:scale={{ duration: 150, start: 0.95, opacity: 0.5, easing: quintOut }}
>
	<!-- eslint-disable-next-line svelte/valid-compile -->
	<div class="absolute inset-0" onclick={onClose}></div>

	<!-- The popup card -->
	<div
		class="relative z-10 w-full max-w-md rounded-3xl border border-slate-200/50 bg-white/80 p-8 shadow-2xl shadow-green-500/10 backdrop-blur-2xl dark:border-white/10 dark:bg-gray-800/80 dark:shadow-black/50"
	>
		<!-- Close Button -->
		<button
			onclick={onClose}
			class="absolute end-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200/50 hover:text-gray-600 dark:hover:bg-gray-700/50 dark:hover:text-gray-200"
			aria-label="إغلاق"
		>
			<Icon name="x" size={20} />
		</button>

		<!-- Icon and Content -->
		<div class="text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-teal-500 text-white shadow-lg shadow-green-500/40"
			>
				<Icon name="rocket" class="h-10 w-10" />
			</div>

			<h3 id="signup-title" class="text-2xl font-bold text-gray-800 dark:text-gray-100">
				لحفظ تقدمك، سجل دخولك!
			</h3>

			<p class="mt-2 text-gray-600 dark:text-gray-400">
				يبدو أنك لم تسجل دخولك. أنشئ حسابًا مجانيًا لحفظ إجاباتك وكسب نقاط الخبرة ومتابعة رحلتك
				التعليمية.
			</p>
		</div>

		<!-- Action Buttons -->
		<div class="mt-8 flex flex-col gap-3">
			<Button
				onclick={() => handleNavigation('/signup')}
				variant="attention"
				size="lg"
				class="w-full"
			>
				إنشاء حساب جديد
			</Button>
			<Button onclick={() => handleNavigation('/signin')} variant="ghost" size="lg" class="w-full">
				لدي حساب بالفعل
			</Button>
		</div>
	</div>
</div>

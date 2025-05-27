<script lang="ts">
	import Markdown from '$ui/common/Markdown.svelte';
	import Icon from '$ui/common/Icon.svelte';
	import { fade } from 'svelte/transition';

	let {
		visible = false,
		onClose = () => {},
		explanation = '',
		title = ''
	} = $props<{
		visible: boolean;
		onClose: () => void;
		explanation?: string;
		title?: string;
	}>();
</script>

{#if visible}
	<div
		class="fixed inset-0 z-50 m-0 flex items-center justify-center overflow-y-auto"
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
		aria-describedby="modal-description"
		transition:fade={{ duration: 50 }}
	>
		<button
			type="button"
			class="absolute inset-0 bg-black/60 backdrop-blur-sm"
			aria-label="Close modal"
			onclick={onClose}
			tabindex="-1"
		></button>

		<div
			class="relative z-10 w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all dark:bg-gray-800"
		>
			<div class="px-6 py-5 sm:py-6">
				<button
					type="button"
					class="absolute top-3 left-3 rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:text-gray-500 dark:hover:text-gray-300 dark:focus:ring-offset-gray-800"
					aria-label="Close"
					onclick={onClose}
				>
					<Icon name="x" />
				</button>

				{#if title}
					<h3
						class="pe-6 text-lg leading-6 font-semibold text-gray-900 dark:text-white"
						id="modal-title"
					>
						{title}
					</h3>
				{/if}

				<!-- Content -->
				<div class="mt-4 text-sm text-gray-600 dark:text-gray-300" id="modal-description">
					{#if explanation}
						<Markdown evalPublicAssets={true} markdown={explanation} />
					{:else}
						<p>No explanation provided.</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

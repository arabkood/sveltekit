<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import Icon from '$ui/common/Icon.svelte';
	import { cn } from '$utils/classnames';

	interface BannerAction {
		label: string;
		onClick: () => void;
		iconName?: string;
	}

	let {
		variant = 'info',
		title,
		message,
		iconName,
		action,
		class: className = '',
		dismissible = false
	} = $props<{
		variant?: 'warning' | 'success' | 'error' | 'info';
		title?: string;
		message: string;
		iconName?: string;
		action?: BannerAction;
		class?: string;
		dismissible?: boolean;
	}>();

	let dismissed = $state(false);

	const variantStyles = {
		warning: {
			container: 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500',
			icon: 'text-orange-600',
			text: 'text-orange-800',
			action:
				'text-orange-700 hover:text-orange-600 hover:bg-orange-100 px-3 py-1 rounded-full transition-colors',
			dismissButton:
				'text-orange-500 hover:text-orange-700 hover:bg-orange-100 rounded-full p-1 transition-colors'
		},
		success: {
			container: 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500',
			icon: 'text-green-600',
			text: 'text-green-800',
			action:
				'text-green-700 hover:text-green-600 hover:bg-green-100 px-3 py-1 rounded-full transition-colors',
			dismissButton:
				'text-green-500 hover:text-green-700 hover:bg-green-100 rounded-full p-1 transition-colors'
		},
		error: {
			container: 'bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500',
			icon: 'text-red-600',
			text: 'text-red-800',
			action:
				'text-red-700 hover:text-red-600 hover:bg-red-100 px-3 py-1 rounded-full transition-colors',
			dismissButton:
				'text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors'
		},
		info: {
			container: 'bg-gradient-to-r from-blue-50 to-sky-50 border-l-4 border-blue-500',
			icon: 'text-blue-600',
			text: 'text-blue-800',
			action:
				'text-blue-700 hover:text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors',
			dismissButton:
				'text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full p-1 transition-colors'
		}
	};

	const defaultIcons: Record<string, string> = {
		warning: 'alert-triangle',
		success: 'check-circle',
		error: 'x-circle',
		info: 'info-circle'
	};

	const styles = variantStyles[variant as keyof typeof variantStyles];
	const defaultIconName = defaultIcons[variant as keyof typeof defaultIcons];
</script>

{#if !dismissed}
	<div
		transition:slide={{ duration: 200, delay: 100 }}
		class={cn('mb-8 rounded-2xl p-6 shadow-md backdrop-blur-sm', styles.container, className)}
	>
		<div transition:fade={{ duration: 100 }} class="flex items-start">
			<Icon name={iconName || defaultIconName} class={cn('h-6 w-6', styles.icon)} />

			<!-- Content Section -->
			<div class="ms-4 flex-1 md:flex md:items-center md:justify-between">
				<div class="space-y-1">
					{#if title}
						<h3
							class={cn('font-semibold tracking-tight', styles.text)}
							in:fade={{ duration: 200, delay: 200 }}
						>
							{title}
						</h3>
					{/if}
					<p
						class={cn('text-sm leading-relaxed', styles.text)}
						in:fade={{ duration: 200, delay: 250 }}
					>
						{message}
					</p>
				</div>

				<!-- Action and Dismiss Buttons -->
				<div
					class="mt-4 flex items-center gap-4 md:ms-6 md:mt-0"
					in:fade={{ duration: 200, delay: 300 }}
				>
					{#if action}
						<button
							onclick={action.onClick}
							class={cn('inline-flex items-center gap-2 text-sm font-medium', styles.action)}
						>
							{action.label}
							{#if action.iconName}
								<Icon name={action.iconName} class="h-4 w-4" />
							{/if}
						</button>
					{/if}

					{#if dismissible}
						<button
							onclick={() => (dismissed = true)}
							class={cn('flex-shrink-0 transition-transform', styles.dismissButton)}
							aria-label="Dismiss"
						>
							<Icon name="x" class="h-5 w-5" />
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser as BROWSER } from '$app/environment';
	import type {
		createPopper as CreatePopperType,
		Instance as PopperInstanceType,
		Options as PopperOptions
	} from '@popperjs/core';

	let popperCreateFn: typeof CreatePopperType | null = null;
	let tooltipNode: HTMLDivElement | null = null;
	let popperInstance: PopperInstanceType | null = null;
	let currentTargetElement: Element | null = null;
	let layoutRootElement: HTMLDivElement | null = null;

	async function loadPopperJs(): Promise<void> {
		if (BROWSER && !popperCreateFn) {
			const popperModule = await import('@popperjs/core');
			popperCreateFn = popperModule.createPopper;
		}
	}

	function showTooltip(target: Element, title?: string, description?: string): void {
		if (!BROWSER || !popperCreateFn || !target) return;

		if (!tooltipNode) {
			tooltipNode = document.createElement('div');
			tooltipNode.setAttribute('role', 'tooltip');
			tooltipNode.className =
				'px-3 py-2 rounded-lg shadow-xl text-sm \
            bg-white text-gray-700 \
            dark:bg-neutral-800 dark:text-neutral-300 \
            border border-gray-200 dark:border-neutral-700 \
            pointer-events-none z-[10000] max-w-xs';
			document.body.appendChild(tooltipNode);
		}

		let contentHTML = '';

		if (title) {
			contentHTML += `<strong dir="auto" class="font-semibold mb-1 block text-gray-900 dark:text-neutral-100">${title}</strong>`;
		}
		if (description) {
			contentHTML += `<span dir="auto" class="block text-gray-600 dark:text-neutral-400">${description}</span>`;
		}
		tooltipNode.innerHTML = contentHTML;
		tooltipNode.style.display = 'block';

		if (popperInstance) {
			popperInstance.destroy();
		}

		const popperOptions: Partial<PopperOptions> = {
			placement: 'top',
			modifiers: [
				{ name: 'offset', options: { offset: [0, 10] } },
				{ name: 'preventOverflow', options: { padding: 10 } },
				{ name: 'arrow', options: { padding: 5 } }
			]
		};
		popperInstance = popperCreateFn(target, tooltipNode, popperOptions);
		currentTargetElement = target;
	}

	function hideTooltip(): void {
		if (!BROWSER) return;

		if (tooltipNode) {
			tooltipNode.style.display = 'none';
		}
		if (popperInstance) {
			popperInstance.destroy();
			popperInstance = null;
		}
		currentTargetElement = null;
	}

	function handleInteractionStart(event: Event): void {
		const eventTarget = event.target as Element | null;
		if (!eventTarget) return;

		const target = eventTarget.closest<HTMLElement>('[data-glossary]');
		if (target) {
			const title = target.dataset.glossaryT;
			const description = target.dataset.glossaryD;

			if (title || description) {
				if (target === currentTargetElement) return;
				if (currentTargetElement) hideTooltip();
				showTooltip(target, title, description);
			}
		}
	}

	function handleInteractionEnd(event: Event): void {
		if (currentTargetElement && event.target === currentTargetElement) {
			const relatedTarget = (event as MouseEvent | FocusEvent).relatedTarget as Node | null;
			if (tooltipNode && relatedTarget && tooltipNode.contains(relatedTarget)) {
				return;
			}
			hideTooltip();
		}
	}

	onMount(async () => {
		if (BROWSER && layoutRootElement) {
			await loadPopperJs();
			layoutRootElement.addEventListener('mouseover', handleInteractionStart);
			layoutRootElement.addEventListener('mouseout', handleInteractionEnd);
			layoutRootElement.addEventListener('focusin', handleInteractionStart);
			layoutRootElement.addEventListener('focusout', handleInteractionEnd);
		}
	});

	onDestroy(() => {
		if (BROWSER && layoutRootElement) {
			layoutRootElement.removeEventListener('mouseover', handleInteractionStart);
			layoutRootElement.removeEventListener('mouseout', handleInteractionEnd);
			layoutRootElement.removeEventListener('focusin', handleInteractionStart);
			layoutRootElement.removeEventListener('focusout', handleInteractionEnd);
		}
		if (popperInstance) {
			popperInstance.destroy();
		}
		if (tooltipNode) {
			tooltipNode.remove();
		}
	});
</script>

<div bind:this={layoutRootElement}>
	<slot />
</div>

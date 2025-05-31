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

	function showTooltip(target: Element, title: string, description?: string): void {
		if (!BROWSER || !popperCreateFn || !target) return;

		if (!tooltipNode) {
			tooltipNode = document.createElement('div');
			tooltipNode.setAttribute('role', 'tooltip');
			tooltipNode.className =
				'p-2 px-3 rounded-md shadow-lg text-sm \
                                    bg-white text-slate-700 \
                                    dark:bg-slate-800 dark:text-slate-200 \
                                    pointer-events-none z-[10000] max-w-xs';
			document.body.appendChild(tooltipNode);
		}

		let contentHTML = `<strong dir="auto" class="font-semibold block text-slate-900 dark:text-white">${title}</strong>`;
		if (description) {
			contentHTML += `<span dir="auto" class="block mt-1 text-slate-600 dark:text-slate-300">${description}</span>`;
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
				{ name: 'arrow', options: { padding: 5 } } // Optional: if you add an arrow element
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

			if (title) {
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser as BROWSER } from '$app/environment';

	let wrapperElement: HTMLDivElement | null = null;

	const copyIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
	const checkIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

	const activeCopyTimeouts = new Map<HTMLButtonElement, number>();

	function addCopyButtonToPreElement(preEl: HTMLPreElement): void {
		if (preEl.querySelector('.code-copy-button-wrapper')) {
			return;
		}

		preEl.classList.add('relative', 'group');

		const buttonWrapper = document.createElement('div');
		buttonWrapper.className =
			'code-copy-button-wrapper absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200';

		const button = document.createElement('button');
		button.innerHTML = copyIconSVG;
		button.setAttribute('aria-label', 'Copy code');
		button.className =
			'cursor-copy p-1.5 rounded-md bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50';

		button.addEventListener('click', async () => {
			const existingTimeout = activeCopyTimeouts.get(button);
			if (existingTimeout) {
				clearTimeout(existingTimeout);
			}

			try {
				await navigator.clipboard.writeText(preEl.textContent?.trim() || '');
				button.innerHTML = checkIconSVG;
				button.classList.add('text-green-500', 'dark:text-green-400');
				button.setAttribute('aria-label', 'Copied!');

				const timeoutId = window.setTimeout(() => {
					button.innerHTML = copyIconSVG;
					button.classList.remove('text-green-500', 'dark:text-green-400');
					button.setAttribute('aria-label', 'Copy code');
					activeCopyTimeouts.delete(button);
				}, 2000);
				activeCopyTimeouts.set(button, timeoutId);
			} catch (err) {
				button.setAttribute('aria-label', 'Copy failed');
				button.classList.add('text-red-500', 'dark:text-red-400');

				const errorTimeoutId = window.setTimeout(() => {
					button.classList.remove('text-red-500', 'dark:text-red-400');
					button.setAttribute('aria-label', 'Copy code');
					activeCopyTimeouts.delete(button);
				}, 2000);
				activeCopyTimeouts.set(button, errorTimeoutId);
			}
		});

		buttonWrapper.appendChild(button);
		preEl.appendChild(buttonWrapper);
	}

	function handleMouseOver(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		if (target) {
			const preEl = target.closest('pre[data-copy-button]') as HTMLPreElement | null;
			if (preEl) {
				addCopyButtonToPreElement(preEl);
			}
		}
	}

	onMount(() => {
		if (BROWSER && wrapperElement) {
			wrapperElement.addEventListener('mouseover', handleMouseOver);
		}
	});

	onDestroy(() => {
		if (BROWSER) {
			if (wrapperElement) {
				wrapperElement.removeEventListener('mouseover', handleMouseOver);
			}
			activeCopyTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
			activeCopyTimeouts.clear();
		}
	});
</script>

<div bind:this={wrapperElement}>
	<slot />
</div>

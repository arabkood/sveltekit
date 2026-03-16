<script lang="ts">
	import { browser } from '$app/environment';
	import hljs from 'highlight.js';

	/**
	 * A list of code blocks that the user can reorder via drag-and-drop.
	 * @props
	 * @property {string[]} code - An array of all available code block strings.
	 * @property {number[]} order - A bindable array of numbers representing the display order of blocks from the 'code' prop.
	 * @property {string} lang - The language for syntax highlighting.
	 * @property {boolean} [disabled=false] - If true, disables the drag-and-drop functionality.
	 * @property {boolean[]} [incorrectPositions=[]] - Array indicating which positions are incorrect.
	 */
	let {
		code = [],
		order = $bindable([]),
		lang,
		disabled = false,
		incorrectPositions = []
	}: {
		code: string[];
		order: number[];
		lang: string;
		disabled?: boolean;
		incorrectPositions?: boolean[];
	} = $props();

	// All state and derived values are only needed on the client,
	// so their initialization can safely stay here.
	let draggedIndex: number | null = $state(null);
	let dragOverIndex: number | null = $state(null);
	let isDragging: boolean = $state(false);
	let isTouchDevice: boolean = $state(false);

	let touchStartY: number = 0;
	let touchStartX: number = 0;
	let touchCurrentIndex: number | null = null;

	// This effect will only run on the client, where 'window' is available.
	$effect(() => {
		if (browser) {
			isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		}
	});

	const displayedBlocks = $derived(
		order.map((originalIndex) => {
			const blockContent = code[originalIndex] ?? '';
			let html: string;
			if (blockContent.trim() === '') {
				html = ' ';
			} else if (lang && hljs.getLanguage(lang)) {
				html = hljs.highlight(blockContent, { language: lang, ignoreIllegals: true }).value;
			} else {
				html = blockContent.replace(/</g, '<').replace(/>/g, '>');
			}
			return {
				id: originalIndex,
				html
			};
		})
	);

	function handleDragStart(index: number) {
		draggedIndex = index;
		isDragging = true;
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		dragOverIndex = index;
	}

	function handleDragLeave(index: number) {
		if (dragOverIndex === index) dragOverIndex = null;
	}

	function handleDrop(dropIndex: number) {
		if (draggedIndex === null || draggedIndex === dropIndex) return;
		reorderBlocks(draggedIndex, dropIndex);
		resetDragState();
	}

	function handleDragEnd() {
		resetDragState();
	}

	function resetDragState() {
		draggedIndex = null;
		dragOverIndex = null;
		isDragging = false;
	}

	function reorderBlocks(fromIndex: number, toIndex: number) {
		const reorderedOrder = [...order];
		const draggedItem = reorderedOrder.splice(fromIndex, 1)[0];
		reorderedOrder.splice(toIndex, 0, draggedItem);
		order = reorderedOrder;
	}

	function handleTouchStart(e: TouchEvent, index: number) {
		if (disabled) return;
		const touch = e.touches[0];
		touchStartY = touch.clientY;
		touchStartX = touch.clientX;
		touchCurrentIndex = index;
		document.body.style.overflow = 'hidden';
		document.body.style.position = 'fixed';
		document.body.style.width = '100%';
		draggedIndex = index;
		isDragging = true;
	}

	function handleTouchMove(e: TouchEvent) {
		if (disabled || touchCurrentIndex === null) return;
		e.preventDefault();
		e.stopPropagation();
		const touch = e.touches[0];
		const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
		const codeBlockBelow = elementBelow?.closest('.code-body');
		if (codeBlockBelow) {
			const allCodeBlocks = Array.from(codeBlockBelow.parentElement?.children || []);
			const targetIndex = allCodeBlocks.indexOf(codeBlockBelow);
			if (targetIndex !== -1 && targetIndex !== touchCurrentIndex) {
				dragOverIndex = targetIndex;
			}
		}
	}

	function handleTouchEnd(e: TouchEvent) {
		if (disabled || touchCurrentIndex === null) return;
		document.body.style.overflow = '';
		document.body.style.position = '';
		document.body.style.width = '';
		const touch = e.changedTouches[0];
		const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
		const codeBlockBelow = elementBelow?.closest('.code-body');
		if (codeBlockBelow) {
			const allCodeBlocks = Array.from(codeBlockBelow.parentElement?.children || []);
			const dropIndex = allCodeBlocks.indexOf(codeBlockBelow);
			if (dropIndex !== -1 && dropIndex !== touchCurrentIndex) {
				reorderBlocks(touchCurrentIndex, dropIndex);
			}
		}
		touchCurrentIndex = null;
		resetDragState();
	}

	function handleKeyDown(e: KeyboardEvent, index: number) {
		if (disabled) return;
		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				if (index > 0) reorderBlocks(index, index - 1);
				break;
			case 'ArrowDown':
				e.preventDefault();
				if (index < order.length - 1) reorderBlocks(index, index + 1);
				break;
			case 'Home':
				e.preventDefault();
				if (index > 0) reorderBlocks(index, 0);
				break;
			case 'End':
				e.preventDefault();
				if (index < order.length - 1) reorderBlocks(index, order.length - 1);
				break;
		}
	}
</script>

{#if browser}
	<!-- This entire block will only render on the client, avoiding SSR/hydration issues. -->
	<div
		class="cb-container overflow-hidden py-3 {disabled ? 'cursor-not-allowed opacity-60' : ''}"
		style="-webkit-overflow-scrolling: touch;"
	>
		{#each displayedBlocks as block, i (block.id)}
			{@const isIncorrect = incorrectPositions[i] || false}
			<div
				class="code-body relative mb-2 flex min-h-12 items-start rounded-lg border p-3 transition-all duration-200
               ease-in-out select-none last:mb-0
               {disabled ? '' : 'cursor-grab hover:-translate-y-0.5 hover:shadow-md'}
               {draggedIndex === i ? 'z-1000 scale-[0.98] rotate-1 opacity-50 shadow-xl' : ''}
               {dragOverIndex === i && draggedIndex !== i ? 'drag-over' : ''}
               {dragOverIndex === i && draggedIndex !== null && draggedIndex > i
					? 'drag-above'
					: ''}
               {dragOverIndex === i && draggedIndex !== null && draggedIndex < i
					? 'drag-below'
					: ''}
               {isTouchDevice ? 'mb-3 min-h-14 p-4' : ''}
               {isIncorrect
					? 'border-red-400 bg-red-50 hover:border-red-500 hover:bg-red-100 dark:border-red-500 dark:bg-red-900/30 dark:hover:border-red-400 dark:hover:bg-red-900/40'
					: 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'}
               {draggedIndex === i ? 'border-blue-500 bg-blue-100 dark:bg-blue-900' : ''}"
				draggable={!disabled}
				tabindex={disabled ? -1 : 0}
				role="button"
				aria-label="Code block {i + 1} of {order.length}. {isIncorrect
					? 'Incorrect position. '
					: ''}{isTouchDevice ? 'Touch and drag to reorder' : 'Use arrow keys or drag to reorder'}"
				ondragstart={() => handleDragStart(i)}
				ondragover={(e) => handleDragOver(e, i)}
				ondragleave={() => handleDragLeave(i)}
				ondrop={(e) => {
					e.preventDefault();
					handleDrop(i);
				}}
				ondragend={handleDragEnd}
				ontouchstart={(e) => handleTouchStart(e, i)}
				ontouchmove={handleTouchMove}
				ontouchend={handleTouchEnd}
				onkeydown={(e) => handleKeyDown(e, i)}
				dir="ltr"
				style="touch-action: none;"
			>
				<!-- {#if isIncorrect} -->
				<!-- 	<div -->
				<!-- 		class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white" -->
				<!-- 	> -->
				<!-- 		<svg -->
				<!-- 			class="h-3 w-3" -->
				<!-- 			fill="currentColor" -->
				<!-- 			viewBox="0 0 20 20" -->
				<!-- 			xmlns="http://www.w3.org/2000/svg" -->
				<!-- 		> -->
				<!-- 			<path -->
				<!-- 				fill-rule="evenodd" -->
				<!-- 				d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" -->
				<!-- 				clip-rule="evenodd" -->
				<!-- 			></path> -->
				<!-- 		</svg> -->
				<!-- 	</div> -->
				<!-- {/if} -->
				<div
					class="my-auto flex min-w-[32px] items-center justify-center rounded-md pr-5 transition-all duration-200 ease-in-out
				       {isTouchDevice ? 'pr-6' : ''}
				       {isIncorrect ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}"
					title={isTouchDevice ? 'Touch and drag to reorder' : 'Drag to reorder'}
				>
					<svg
						class="pointer-events-none h-5 w-5 {isTouchDevice ? 'h-6 w-6' : ''}"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						aria-hidden="true"
					>
						<circle cx="4" cy="4" r="1.5" /><circle cx="8" cy="4" r="1.5" /><circle
							cx="12"
							cy="4"
							r="1.5"
						/><circle cx="4" cy="8" r="1.5" /><circle cx="8" cy="8" r="1.5" /><circle
							cx="12"
							cy="8"
							r="1.5"
						/><circle cx="4" cy="12" r="1.5" /><circle cx="8" cy="12" r="1.5" /><circle
							cx="12"
							cy="12"
							r="1.5"
						/>
					</svg>
				</div>
				<pre
					class="overflow-wrap-anywhere m-0 min-h-[1.5em] grow p-0 wrap-break-word whitespace-pre-wrap"><code
						class="hljs language-{lang} font-mono text-sm leading-relaxed antialiased md:text-base
						{isIncorrect ? 'text-red-900 dark:text-red-100' : 'text-gray-900 dark:text-gray-100'}"
						><!-- eslint-disable-next-line svelte/no-at-html-tags --><!--
          -->{@html block.html}</code
					></pre>
			</div>
		{/each}
	</div>
{:else}
	<div class="cb-container overflow-hidden py-3">
		{#each Array(order.length) as _, i (i)}
			<div
				class="relative mb-2 min-h-12 animate-pulse flex-col items-start space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 last:mb-0 md:min-h-14 md:p-4 dark:border-gray-600 dark:bg-gray-700"
				dir="ltr"
			>
				<div class="ms-8 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-600"></div>
				<div class="ms-8 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-600"></div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.drag-over::before {
		content: '';
		position: absolute;
		left: -2px;
		right: -2px;
		height: 4px;
		background: linear-gradient(90deg, #3b82f6, #06b6d4);
		border-radius: 2px;
		z-index: 1;
		animation: pulse 1s ease-in-out infinite;
	}
	.drag-above::before {
		top: -6px;
	}
	.drag-below::before {
		bottom: -6px;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 0.8;
		}
		50% {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.code-body,
		.code-body svg {
			transition: none !important;
		}
		@keyframes pulse {
			0%,
			100% {
				opacity: 0.8;
			}
		}
	}
	@media (max-width: 768px) {
		code {
			font-size: 0.85rem;
			line-height: 1.5;
		}
	}
</style>

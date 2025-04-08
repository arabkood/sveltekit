<script lang="ts">
	import { i18n } from '$i18n/i18n';

	type Variant = 'withText' | 'iconOnly' | 'withTextMobile';
	type Size = 'sm' | 'md' | 'lg' | 'xl' | number;

	let {
		variant = 'iconOnly',
		size = 'md',
		color = 'currentColor',
		class: className = ''
	} = $props<{
		variant?: Variant;
		size?: Size;
		color?: string;
		class?: string;
	}>();

	// Size mapping in pixels
	const sizeMap = {
		sm: 24,
		md: 30,
		lg: 36,
		xl: 42
	};

	const sizeValue = $derived(
		typeof size === 'number' ? size : sizeMap[size as keyof typeof sizeMap]
	);

	const combinedClass = `inline-block ${className}`;
</script>

<div class={combinedClass}>
	{#if variant === 'withText' || variant === 'withTextMobile'}
		<div class="align-center flex items-center gap-2">
			<svg
				aria-hidden="true"
				viewBox="0 0 223 223"
				width={sizeValue}
				height={sizeValue}
				fill={color}
				class="flex-shrink-0"
			>
				<path
					d="M223 111.5C223 49.9119 173.088 0 111.5 0C49.9119 0 0 49.9119 0 111.5C0 130.674 4.8374 148.716 13.3586 164.472C17.0745 151.364 21.7156 138.571 27.459 128.105C35.3079 113.802 43.0718 101.004 50.0852 90.2123C50.4214 84.2374 51.761 77.6925 54.2632 70.5509C81.1226 0.417786 152.82 25.165 154.513 62.6382C210.504 75.0438 200.616 124.652 164.126 134.41C143.136 142.308 115.652 144.439 92.9158 138.916C85.1675 161.597 77.0168 192.933 79.8789 218.454C89.9033 221.412 100.516 223 111.5 223C173.088 223 223 173.088 223 111.5L223 111.5ZM94 57.5C94 62.1944 97.8057 66 102.5 66C107.194 66 111 62.1944 111 57.5C111 52.8056 107.194 49 102.5 49C97.8057 49 94 52.8056 94 57.5L94 57.5ZM126 57.5C126 62.1944 129.806 66 134.5 66C139.194 66 143 62.1944 143 57.5C143 52.8056 139.194 49 134.5 49C129.806 49 126 52.8056 126 57.5L126 57.5Z"
					fill-rule="evenodd"
					stroke="none"
				/>
			</svg>
			<span
				class={'font-semibold ' + (variant === 'withTextMobile' ? 'sm:hidden' : '')}
				style="color: {color};"
			>
				{i18n.t('site.logo')}
			</span>
		</div>
	{:else}
		<svg aria-hidden="true" viewBox="0 0 223 223" width={sizeValue} height={sizeValue} fill={color}>
			<path
				d="M223 111.5C223 49.9119 173.088 0 111.5 0C49.9119 0 0 49.9119 0 111.5C0 130.674 4.8374 148.716 13.3586 164.472C17.0745 151.364 21.7156 138.571 27.459 128.105C35.3079 113.802 43.0718 101.004 50.0852 90.2123C50.4214 84.2374 51.761 77.6925 54.2632 70.5509C81.1226 0.417786 152.82 25.165 154.513 62.6382C210.504 75.0438 200.616 124.652 164.126 134.41C143.136 142.308 115.652 144.439 92.9158 138.916C85.1675 161.597 77.0168 192.933 79.8789 218.454C89.9033 221.412 100.516 223 111.5 223C173.088 223 223 173.088 223 111.5L223 111.5ZM94 57.5C94 62.1944 97.8057 66 102.5 66C107.194 66 111 62.1944 111 57.5C111 52.8056 107.194 49 102.5 49C97.8057 49 94 52.8056 94 57.5L94 57.5ZM126 57.5C126 62.1944 129.806 66 134.5 66C139.194 66 143 62.1944 143 57.5C143 52.8056 139.194 49 134.5 49C129.806 49 126 52.8056 126 57.5L126 57.5Z"
				fill-rule="evenodd"
				stroke="none"
			/>
		</svg>
	{/if}
</div>

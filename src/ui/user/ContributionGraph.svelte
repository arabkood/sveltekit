<script lang="ts">
	import type { Contribution } from '$types/user';
	const { contributions } = $props<{ contributions: Contribution[] }>();

	const levelColors = [
		'bg-gray-200 dark:bg-gray-600',
		'bg-green-200 dark:bg-green-900',
		'bg-green-400 dark:bg-green-700',
		'bg-green-600 dark:bg-green-500',
		'bg-green-800 dark:bg-green-300'
	];

	// Simple month labels at the top
	const monthLabels = [
		'يناير',
		'فبراير',
		'مارس',
		'أبريل',
		'مايو',
		'يونيو',
		'يوليو',
		'أغسطس',
		'سبتمبر',
		'أكتوبر',
		'نوفمبر',
		'ديسمبر'
	];
</script>

<section class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
	<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">نشاط المساهمات</h2>

	<div class="overflow-x-auto">
		<!-- Month labels -->
		<div
			style={`grid-template-columns: repeat(12, 1fr); margin-right: 60px; width: ${(contributions.length / 7) * 16}px`}
			class="mb-2 grid min-w-full text-center text-xs text-gray-500 dark:text-gray-400"
		>
			{#each monthLabels as month}
				<div class="w-14 text-center">{month}</div>
			{/each}
		</div>

		<div class="mb-4 flex gap-2">
			<!-- Day labels -->
			<div
				class="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400"
				style="width: 50px;"
			>
				<div class="flex h-3 items-center">الأحد</div>
				<div class="flex h-3 items-center">الإثنين</div>
				<div class="flex h-3 items-center">الثلاثاء</div>
				<div class="flex h-3 items-center">الأربعاء</div>
				<div class="flex h-3 items-center">الخميس</div>
				<div class="flex h-3 items-center">الجمعة</div>
				<div class="flex h-3 items-center">السبت</div>
			</div>

			<!-- Grid -->
			<div
				class="grid"
				style="gap: 4px; grid-template-rows: repeat(7, 12px); grid-auto-flow: column; grid-auto-columns: 12px;"
			>
				{#each contributions as contribution, i}
					<div
						class="rounded-sm transition-all hover:scale-110 {levelColors[contribution.level] ||
							levelColors[0]}"
						style="width: 12px; height: 12px;"
						title="{contribution.level} مساهمة{contribution.date ? ` في ${contribution.date}` : ''}"
					></div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Legend -->
	<div class="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
		<div class="text-xs">
			{contributions.reduce((sum, c) => sum + (c.level || 0), 0)} مساهمة في السنة الماضية
		</div>
		<div class="flex items-center gap-2">
			<span>أقل</span>
			<div class="flex gap-1">
				{#each levelColors as color}
					<div class="h-3 w-3 rounded-sm transition-all hover:scale-110 {color}"></div>
				{/each}
			</div>
			<span>أكثر</span>
		</div>
	</div>
</section>

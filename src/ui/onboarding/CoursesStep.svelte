<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';

	interface Course {
		slug: string;
		titleAr: string;
		descriptionAr: string;
		emoji: string;
		lessons: number;
		hours: number;
		level: 'beginner' | 'intermediate' | 'advanced';
		available: boolean;
	}

	const {
		availableCourses,
		onCourseSelect,
		onSkip
	}: {
		availableCourses: Course[];
		onCourseSelect: (courseSlug: string) => void;
		onSkip: () => void;
	} = $props();
</script>

<div>
	<h2 class="mb-3 text-2xl font-bold text-slate-900 dark:text-white">ما الذي تريد تعلمه؟</h2>
	<p class="text-base text-slate-600 dark:text-slate-400">اختر دورة واحدة لتبدأ بها</p>

	<!-- Available Courses -->
	<div class="mt-8 grid gap-3">
		{#each availableCourses as course}
			<button
				onclick={() => onCourseSelect(course.slug)}
				class="group cursor-pointer rounded-xl border-2 border-slate-200 bg-gradient-to-br from-emerald-50/80 to-white p-4 text-right transition-all duration-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-slate-700 dark:from-emerald-950/20 dark:to-slate-900/50 dark:hover:border-emerald-400"
			>
				<div class="mb-3 flex items-start gap-3">
					<div class="flex-shrink-0 text-3xl">{course.emoji}</div>
					<div class="min-w-0 flex-1">
						<h3 class="mb-1 text-lg font-bold text-slate-900 dark:text-white">
							{course.titleAr}
						</h3>
						<p class="text-sm leading-snug text-slate-600 dark:text-slate-400">
							{course.descriptionAr}
						</p>
					</div>
				</div>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
						<div class="flex items-center gap-1.5">
							<Icon name="book-open" size={14} />
							<span>{course.lessons} درس</span>
						</div>
						<div class="flex items-center gap-1.5">
							<Icon name="clock" size={14} />
							<span>{course.hours} ساعة</span>
						</div>
					</div>
					<div
						class="flex items-center gap-1.5 text-emerald-600 transition-colors dark:text-emerald-400"
					>
						<span class="text-sm font-semibold">ابدأ</span>
						<Icon name="arrow-left" size={16} />
					</div>
				</div>
			</button>
		{/each}
	</div>

	<!-- After the courses grid -->
	<div
		class="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
	>
		<div class="flex items-start gap-3">
			<Icon name="sparkles" class="mt-1" />
			<div>
				<h3 class="mb-1 font-semibold text-blue-900 dark:text-blue-100">دورات جديدة قريبا</h3>
				<p class="text-sm text-blue-700 dark:text-blue-300">
					نعمل على إضافة {availableCourses.length} دورات جديدة قريبا.
				</p>
			</div>
		</div>
	</div>

	<button
		onclick={onSkip}
		class="mt-12 w-full cursor-pointer text-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
	>
		تخطي
	</button>
</div>

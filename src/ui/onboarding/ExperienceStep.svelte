<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';

	type Experience = 'complete-beginner' | 'basic' | 'intermediate' | 'advanced';

	const {
		onExperienceSelect,
		onSkip
	}: {
		onExperienceSelect: (experience: Experience) => void;
		onSkip: () => void;
	} = $props();

	const experiences = [
		{
			id: 'complete-beginner',
			emoji: '🌱',
			title: 'مبتدئ تماماً',
			subtitle: 'لم أكتب أي كود من قبل'
		},
		{
			id: 'basic',
			emoji: '📚',
			title: 'خبرة أساسية',
			subtitle: 'تعلمت بعض الأساسيات سابقاً'
		},
		{
			id: 'intermediate',
			emoji: '⚡',
			title: 'متوسط',
			subtitle: 'أستطيع كتابة برامج بسيطة'
		},
		{
			id: 'advanced',
			emoji: '🚀',
			title: 'متقدم',
			subtitle: 'لدي خبرة في عدة مشاريع'
		}
	];
</script>

<div class="space-y-10">
	<h2 class="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
		ما هو مستوى خبرتك في البرمجة؟
	</h2>
	<!-- <p class="text-base text-slate-600 dark:text-slate-400">سنقترح عليك المحتوى المناسب</p> -->

	<div class="mt-8 grid gap-3 sm:gap-4">
		{#each experiences as exp}
			<button
				onclick={() => onExperienceSelect(exp.id as Experience)}
				class="group transform-gpu cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 text-right transition-all duration-200 hover:scale-[1.02] hover:border-emerald-500 hover:bg-emerald-50/50 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/20"
			>
				<div class="flex items-center gap-4">
					<div
						class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl transition-colors group-hover:bg-emerald-100 dark:bg-slate-700 dark:group-hover:bg-emerald-900/30"
					>
						{exp.emoji}
					</div>
					<div class="flex-1">
						<h3 class="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
							{exp.title}
						</h3>
						<p class="text-sm text-slate-600 dark:text-slate-400">
							{exp.subtitle}
						</p>
					</div>
					<Icon
						name="arrow-left"
						class="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
						size={20}
					/>
				</div>
			</button>
		{/each}
	</div>

	<button
		onclick={onSkip}
		class="w-full cursor-pointer text-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
	>
		تخطي
	</button>
</div>

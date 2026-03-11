<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';

	type Goal =
		| 'career'
		| 'projects'
		| 'understand-tech'
		| 'university-prep'
		| 'curious'
		| 'exploring';

	let {
		onGoalSelect,
		onSkip
	}: {
		onGoalSelect: (goal: Goal) => void;
		onSkip: () => void;
	} = $props();

	const goals = [
		{
			id: 'career',
			emoji: '💼',
			title: 'بناء مسار مهني',
			subtitle: 'البحث عن وظيفة أو تطوير مهاراتي'
		},
		{
			id: 'projects',
			emoji: '🚀',
			title: 'بناء مشاريع شخصية',
			subtitle: 'تحويل أفكاري إلى واقع'
		},
		{
			id: 'understand-tech',
			emoji: '🧠',
			title: 'فهم التكنولوجيا',
			subtitle: 'معرفة كيف تعمل الأشياء من حولي'
		},
		{
			id: 'university-prep',
			emoji: '🎓',
			title: 'الاستعداد للجامعة',
			subtitle: 'تعلم الأساسيات قبل الدراسة الأكاديمية'
		},
		{
			id: 'curious',
			emoji: '🔍',
			title: 'فضول معرفي',
			subtitle: 'أحب التعلم واكتشاف أشياء جديدة'
		},
		{
			id: 'exploring',
			emoji: '🌟',
			title: 'استكشاف الخيارات',
			subtitle: 'لست متأكداً بعد، أريد الاستكشاف'
		}
	];
</script>

<div class="space-y-10">
	<div class="space-y-3 text-center">
		<div class="animate-wave mx-auto mb-2 text-6xl">👋</div>
		<h2 class="text-3xl font-bold text-gray-900 dark:text-white">مرحباً بك في رحلتك التعليمية!</h2>
		<p class="text-lg text-gray-600 dark:text-gray-400">ما هو هدفك من تعلم البرمجة؟</p>
	</div>

	<div class="grid gap-3 sm:gap-4">
		{#each goals as goal}
			<button
				onclick={() => onGoalSelect(goal.id as Goal)}
				class="group transform-gpu cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 text-right transition-all duration-200 hover:scale-[1.02] hover:border-emerald-500 hover:bg-emerald-50/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/20"
			>
				<div class="flex items-center gap-4">
					<div
						class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl transition-colors group-hover:bg-emerald-100 dark:bg-gray-700 dark:group-hover:bg-emerald-900/30"
					>
						{goal.emoji}
					</div>
					<div class="flex-1">
						<h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
							{goal.title}
						</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							{goal.subtitle}
						</p>
					</div>
					<Icon
						name="arrow-left"
						class="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
						size={20}
					/>
				</div>
			</button>
		{/each}
	</div>

	<button
		onclick={onSkip}
		class="w-full cursor-pointer text-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
	>
		تخطي
	</button>
</div>

<style>
	@keyframes wave {
		0%,
		60%,
		100% {
			transform: rotate(0deg);
		}
		10% {
			transform: rotate(14deg);
		}
		20% {
			transform: rotate(-8deg);
		}
		30% {
			transform: rotate(14deg);
		}
		40% {
			transform: rotate(-4deg);
		}
		50% {
			transform: rotate(10deg);
		}
	}

	.animate-wave {
		animation: wave 2.5s infinite;
	}
</style>

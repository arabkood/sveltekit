<script lang="ts">
	import { fade } from 'svelte/transition';
	import Icon from '$ui/common/Icon.svelte';
	import GoalStep from './GoalStep.svelte';
	import ExperienceStep from './ExperienceStep.svelte';
	import CoursesStep from './CoursesStep.svelte';
	import FutureInterestsStep from './FutureInterestsStep.svelte';

	// ============================================================================
	// TYPES
	// ============================================================================

	type Step = 'goal' | 'experience' | 'courses' | 'future-interests';
	type Goal =
		| 'career'
		| 'projects'
		| 'understand-tech'
		| 'university-prep'
		| 'curious'
		| 'exploring';
	type Experience = 'complete-beginner' | 'basic' | 'intermediate' | 'advanced';

	interface OnboardingData {
		marketingConsent: boolean;
		goal: Goal | null;
		experience: Experience | null;
		interests: string[];
		selectedCourse: string | null;
	}

	interface InterestOption {
		id: string;
		emoji: string;
		label: string;
		description: string;
		available: boolean;
		courseSlug?: string;
		priority: 'high' | 'medium' | 'low';
	}

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

	// ============================================================================
	// PROPS
	// ============================================================================

	const {
		onComplete
	}: {
		onComplete: (data: OnboardingData) => void;
	} = $props();

	// ============================================================================
	// STATE
	// ============================================================================

	let currentStep = $state<Step>('goal');
	let stepHistory = $state<Step[]>(['goal']);

	let data = $state<OnboardingData>({
		marketingConsent: true, // Default to checked
		goal: null,
		experience: null,
		interests: [],
		selectedCourse: null
	});

	let futureInterests = $state<string[]>([]); // Track interests in unavailable courses

	// ============================================================================
	// CONSTANTS
	// ============================================================================

	const STEPS: Step[] = ['goal', 'experience', 'courses', 'future-interests'];
	const TOTAL_STEPS = STEPS.length;

	// More strategic interest options to help prioritize course development
	const ALL_INTEREST_OPTIONS: InterestOption[] = [
		{
			id: 'python-fundamentals',
			emoji: '🐍',
			label: 'أساسيات البرمجة بلغة Python',
			description: 'تعلم البرمجة من الصفر',
			available: true,
			courseSlug: 'python-beginners',
			priority: 'high'
		},
		{
			id: 'web-fullstack',
			emoji: '🌐',
			label: 'تطوير مواقع الويب (Full-Stack)',
			description: 'بناء مواقع تفاعلية كاملة',
			available: false,
			priority: 'high'
		},
		{
			id: 'data-science',
			emoji: '📊',
			label: 'علم البيانات والتحليل',
			description: 'تحليل البيانات واستخراج الأفكار',
			available: false,
			priority: 'high'
		},
		{
			id: 'ai-machine-learning',
			emoji: '🤖',
			label: 'الذكاء الاصطناعي والتعلم الآلي',
			description: 'بناء نماذج ذكية وتطبيقات AI',
			available: false,
			priority: 'high'
		},
		{
			id: 'mobile-development',
			emoji: '📱',
			label: 'تطوير تطبيقات الهاتف',
			description: 'تطبيقات iOS و Android',
			available: false,
			priority: 'medium'
		},
		{
			id: 'game-development',
			emoji: '🎮',
			label: 'تطوير الألعاب',
			description: 'تصميم وبرمجة الألعاب',
			available: false,
			priority: 'medium'
		},
		{
			id: 'cybersecurity',
			emoji: '🔒',
			label: 'الأمن السيبراني',
			description: 'حماية الأنظمة والشبكات',
			available: false,
			priority: 'medium'
		},
		{
			id: 'cloud-devops',
			emoji: '☁️',
			label: 'الحوسبة السحابية و DevOps',
			description: 'نشر وإدارة التطبيقات السحابية',
			available: false,
			priority: 'low'
		},
		{
			id: 'blockchain',
			emoji: '⛓️',
			label: 'البلوك تشين والعملات الرقمية',
			description: 'تطوير تطبيقات لامركزية',
			available: false,
			priority: 'low'
		},
		{
			id: 'ui-ux-design',
			emoji: '🎨',
			label: 'تصميم واجهات المستخدم (UI/UX)',
			description: 'تصميم تجارب مستخدم مميزة',
			available: false,
			priority: 'medium'
		}
	];

	// Show only available options during onboarding
	const INTEREST_OPTIONS = ALL_INTEREST_OPTIONS.filter((option) => option.available);

	const ALL_COURSES: Course[] = [
		{
			slug: 'how-internet-works',
			titleAr: 'كيف يعمل الإنترنت',
			descriptionAr: 'افهم البنية التحتية للويب وكيف تتواصل الأجهزة عبر الشبكة',
			emoji: '🌐',
			lessons: 16,
			hours: 8,
			level: 'beginner',
			available: true
		},
		{
			slug: 'python-beginners',
			titleAr: 'بايثون من الصفر',
			descriptionAr: 'انطلق في عالم البرمجة مع أساسيات لغة بايثون بطريقة عملية',
			emoji: '🐍',
			lessons: 24,
			hours: 12,
			level: 'beginner',
			available: true
		},
		{
			slug: 'python-challenges',
			titleAr: 'تحديات بايثون',
			descriptionAr: 'طور مهاراتك في حل المشكلات بتحديات عملية وممتعة',
			emoji: '💪',
			lessons: 40,
			hours: 20,
			level: 'intermediate',
			available: true
		},
		{
			slug: 'web-development',
			titleAr: 'تطوير الويب الشامل',
			descriptionAr: 'تعلم HTML, CSS, JavaScript وبناء مواقع تفاعلية',
			emoji: '🕸️',
			lessons: 50,
			hours: 30,
			level: 'beginner',
			available: false
		},
		{
			slug: 'data-analysis',
			titleAr: 'تحليل البيانات بـ Python',
			descriptionAr: 'استخدم Pandas و NumPy لتحليل البيانات واستخراج الأفكار',
			emoji: '📊',
			lessons: 35,
			hours: 20,
			level: 'intermediate',
			available: false
		},
		{
			slug: 'machine-learning',
			titleAr: 'التعلم الآلي للمبتدئين',
			descriptionAr: 'ابدأ رحلتك في الذكاء الاصطناعي وبناء نماذج تنبؤية',
			emoji: '🤖',
			lessons: 45,
			hours: 25,
			level: 'intermediate',
			available: false
		}
	];

	// ============================================================================
	// DERIVED STATE
	// ============================================================================

	let stepNumber = $derived(STEPS.indexOf(currentStep));
	let progress = $derived.by(() => {
		if (stepNumber + 1 === TOTAL_STEPS) {
			return 96;
		}
		return ((stepNumber + 1) / TOTAL_STEPS) * 100;
	});

	let availableCourses = $derived(ALL_COURSES.filter((course) => course.available));
	let upcomingCourses = $derived(ALL_COURSES.filter((course) => !course.available));

	let recommendedCourses = $derived(() => {
		// Filter by experience level
		const userLevel = data.experience || 'complete-beginner';
		const isBeginner = userLevel === 'complete-beginner' || userLevel === 'basic';

		return availableCourses.filter((course) => {
			if (isBeginner) {
				return course.level === 'beginner';
			}
			return true; // Show all for intermediate/advanced
		});
	});

	// ============================================================================
	// NAVIGATION FUNCTIONS
	// ============================================================================

	function goToStep(step: Step): void {
		currentStep = step;
		if (stepHistory[stepHistory.length - 1] !== step) {
			stepHistory = [...stepHistory, step];
		}
	}

	function goBack(): void {
		if (stepHistory.length > 1) {
			const newHistory = stepHistory.slice(0, -1);
			stepHistory = newHistory;
			currentStep = newHistory[newHistory.length - 1];
		}
	}

	// ============================================================================
	// STEP HANDLERS
	// ============================================================================

	function handleGoalSelect(goal: Goal): void {
		data.goal = goal;
		goToStep('experience');
	}

	function handleSkipGoal(): void {
		data.goal = null;
		goToStep('experience');
	}

	function handleExperienceSelect(experience: Experience): void {
		data.experience = experience;
		goToStep('courses');
	}

	function handleSkipExperience(): void {
		data.experience = null;
		goToStep('courses');
	}

	function handleCourseSelect(courseSlug: string): void {
		data.selectedCourse = courseSlug;
		goToStep('future-interests');
	}

	function handleSkipToAllCourses(): void {
		data.selectedCourse = null;
		onComplete(data);
	}

	function handleFutureInterestsComplete(): void {
		onComplete(data);
	}
</script>

<!-- ============================================================================ -->
<!-- TEMPLATE -->
<!-- ============================================================================ -->

<div
	class="relative flex min-h-screen w-full flex-col items-center bg-slate-50 pt-[7vh] text-slate-800 dark:bg-slate-950 dark:text-slate-200"
	dir="rtl"
>
	<!-- Background gradients -->
	<div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
		<div
			class="absolute -top-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10"
			style="animation-duration: 5s;"
		></div>
		<div
			class="absolute -right-40 -bottom-40 h-96 w-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10"
			style="animation-duration: 7s;"
		></div>
	</div>

	<!-- Progress bar -->
	<div class="fixed top-0 right-0 left-0 z-50 h-1 bg-slate-200 dark:bg-slate-800">
		<div
			class="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500 ease-out"
			style="width: {progress}%"
		></div>
	</div>

	<!-- Back button -->
	{#if stepHistory.length > 1}
		<button
			onclick={goBack}
			class="fixed start-6 top-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition-all hover:bg-slate-50 hover:shadow-lg dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
			aria-label="رجوع"
		>
			<Icon name="arrow-right" size={20} />
		</button>
	{/if}

	<main class="relative z-10 w-full max-w-2xl px-6 py-12">
		{#key currentStep}
			<div in:fade={{ duration: 300, delay: 150 }} out:fade={{ duration: 200 }}>
				<!-- Goal Step -->
				{#if currentStep === 'goal'}
					<GoalStep onGoalSelect={handleGoalSelect} onSkip={handleSkipGoal} />

					<!-- Experience Step -->
				{:else if currentStep === 'experience'}
					<ExperienceStep
						onExperienceSelect={handleExperienceSelect}
						onSkip={handleSkipExperience}
					/>

					<!-- Courses Step -->
				{:else if currentStep === 'courses'}
					<CoursesStep
						{availableCourses}
						onCourseSelect={handleCourseSelect}
						onSkip={handleSkipToAllCourses}
					/>

					<!-- Future Interests Step -->
				{:else if currentStep === 'future-interests'}
					<FutureInterestsStep
						allInterestOptions={ALL_INTEREST_OPTIONS}
						bind:futureInterests
						onComplete={handleFutureInterestsComplete}
						bind:marketingConsent={data.marketingConsent}
					/>
				{/if}
			</div>
		{/key}
	</main>
</div>

<style>
	* {
		-webkit-tap-highlight-color: transparent;
	}
</style>

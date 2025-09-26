<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import { onMount } from 'svelte';
	import Button from '$ui/common/Button.svelte';
	import IconPng from '$ui/common/IconPng.svelte';

	const {
		userTracks,
		name,
		is_user_premium,
		handleContinueLearning,
		currentStreak = 0,
		completedLessons = 0
	}: {
		userTracks: any[];
		name: string;
		is_user_premium: boolean;
		handleContinueLearning?: () => void;
		currentStreak?: number;
		completedLessons?: number;
	} = $props();

	const hasAnyTracks = userTracks.length > 0;

	const WELCOME_MESSAGES = [
		'أهلاً {name}، وصلت في الوقت المناسب',
		'مرحباً {name}، جاهز للإنجاز؟',
		'{name} سعيد برؤيتك هنا',
		'{name} أهلاً وسهلاً',
		'تشرفنا يا {name}',
		'{name} نورت المنصة',
		'{name} جاهز للعمل؟',
		'أهلاً {name}، وقت الإبداع',
		'{name} مستعد للتحدي؟',
		'{name} حان وقت البرمجة'
	];

	const MOTIVATION_MESSAGES = [
		'كل bug تحله، تصير أقوى',
		'التقدم الصغير اليوم = فرق كبير غداً',
		'الاستمرارية أهم من السرعة',
		'كود نظيف > كود كثير',
		'البرمجة مهارة تُبنى بالممارسة',
		'الخبرة تأتي من الأخطاء المصححة',
		'كل سطر كود خطوة للأمام',
		'لا تستعجل. الجودة تحتاج وقت',
		'المبرمج الجيد يتعلم كل يوم',
		'الصبر مفتاح الإتقان',
		'التكرار يصنع الاحتراف',
		'فشل اليوم = درس الغد',
		'الكود السيء اليوم أفضل من لا كود',
		'كل مشروع رحلة تعلم جديدة',
		'التحدي يبني الخبرة',
		'لا يوجد كود مثالي من أول مرة',
		'الممارسة تحول المعرفة إلى مهارة'
	];

	const ACTION_MESSAGES = [
		'المشروع في بالك؟ حان الوقت',
		'الـ syntax errors لن تحل نفسها',
		'بناء > قراءة. وقت التطبيق',
		'// TODO: اكتب كود عظيم',
		'مشروعك التالي ينتظر أول commit',
		'الأفكار بدون تنفيذ = صفر',
		'ctrl+s ثم نكمل',
		'جرب، اخطئ، تعلم، كرر',
		'الـ IDE مفتوح؟ لنبدأ',
		'git init && git commit -m "البداية"',
		'npm start الحماس',
		'وقت تحويل الخطة إلى كود',
		'الـ terminal ينتظرك',
		'F5 وشاهد النتيجة',
		'الكود لن يكتب نفسه',
		'localhost:3000 جاهز؟',
		'وقت كتابة شيء تفتخر به'
	];

	const TIME_BASED_MESSAGES = {
		morning: [
			'صباح الإنتاجية. القهوة جاهزة؟',
			'أفضل وقت للكود هو الآن',
			'الصباح للـ debugging الصعب',
			'صباح الخير والكود النظيف',
			'العقل صافي، الكود أصفى',
			'قبل زحمة اليوم، وقت الإنجاز',
			'صباح البناء والتطوير',
			'أول الصباح = أفضل تركيز'
		],
		afternoon: [
			'وقت مثالي لحل التحديات',
			'بعد الظهر = وقت البناء',
			'استراحة الغداء خلصت؟ لنكمل',
			'الطاقة عادت. وقت الإنتاج',
			'بعد الظهر للمهام الصعبة'
		],
		evening: [
			'المساء للمشاريع الجانبية',
			'وقت هادئ للتركيز العميق',
			'مساء الإبداع والابتكار',
			'الهدوء يساعد على التفكير',
			'المساء للأفكار الجديدة',
			'وقت مثالي للتعلم'
		],
		night: [
			'برمجة الليل لها سحر خاص',
			'الـ bugs تختبئ في الليل. اصطدها',
			'سهر البرمجة، قهوة وإنجاز',
			'الليل للمبرمجين الحقيقيين',
			'الهدوء والكود، مزيج مثالي',
			'منتصف الليل = ذروة الإبداع',
			'النجوم تشهد على كودك'
		]
	};

	const STREAK_MESSAGES = [
		'{streak} يوم متواصل! استمر',
		'سلسلة {streak} يوم. لا توقف الآن',
		'{streak} يوم من التقدم المستمر',
		'{streak} يوم بدون توقف. أسطورة!',
		'الإصرار: {streak} يوم متتالي',
		'{streak} يوم والعد مستمر',
		'رقم قياسي: {streak} يوم!',
		'{streak} يوم من الالتزام',
		'قوة الإرادة: {streak} يوم'
	];

	const PROGRESS_MESSAGES = [
		'{lessons} درس مكتمل. كل درس إنجاز',
		'أكملت {lessons} درس. الطريق واضح',
		'{lessons} درس في جعبتك',
		'تقدم ملحوظ: {lessons} درس',
		'{lessons} خطوة نحو الاحتراف',
		'{lessons} درس = {lessons} انتصار',
		'المعرفة تتراكم: {lessons} درس',
		'{lessons} درس والرحلة مستمرة'
	];

	const NEW_USER_MESSAGES = [
		'أهلاً {name}. كل رحلة عظيمة تبدأ بسطر الكود الأول',
		'مرحباً {name}. لنحوّل الأفكار إلى أكواد',
		'جاهز {name}؟ لنبدأ ببناء أساسك البرمجي',
		'أول سطر كود هو الأصعب. الباقي متعة',
		'ابدأ صغير. ابني كبير'
	];

	// Very rare troll messages (1% chance)
	const TROLL_MESSAGES = [
		'海賊王に俺はなる！ 🏴‍☠️', // One Piece reference
		'༄࿋࿆࿃࿇࿊࿈ ⍟⌾⍀⍜⎅⟒ ⌿⍀⍜⋏⟒⍑ 🛸', // Alien language
		'هل جربت إطفاء الجهاز وتشغيله مرة أخرى؟ 🔌',
		'sudo اصنع لي شطيرة 🥪',
		'01001000 01100101 01101100 01101100 01101111', // Binary "Hello"
		'الكود يعمل على جهازي ¯\\_(ツ)_/¯',
		'console.log("ليش فاتحني وانت ما ناوي تبرمج؟")',
		'جارٍ تثبيت فيروسات... ⏳',
		'⚠️ تحذير: تم استهلاك كمية مفرطة من القهوة',
		'اليوم مثالي لإضافة bug جديد',
		'الي يكتب كود بدون bugs؟ هذا ابن خالتك اللي بالهندسة 👀',
		'أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! أكود! 💥',
		'البرمجة سهلة قالوا... متعة قالوا... 😭',
		'🦕 الديناصورات كانت تبرمج بـ COBOL',
		'⚠️ تحذير: هذه الرسالة ستدمر نفسها خلال 5...4...3..',
		'༼ つ ◕_◕ ༽つ خذ طاقتي'
	];

	function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' | null {
		const hour = new Date().getHours();

		// Early morning (5-8 AM)
		if (hour >= 5 && hour < 8) return 'morning';

		// Late morning (11 AM - 12 PM) - pre-lunch productivity
		if (hour >= 11 && hour < 12) return 'morning';

		// Afternoon (2-4 PM) - post-lunch coding
		if (hour >= 14 && hour < 16) return 'afternoon';

		// Evening (6-8 PM) - after work/school
		if (hour >= 18 && hour < 20) return 'evening';

		// Late night (11 PM - 2 AM) - night owl hours
		if (hour >= 23 || hour < 2) return 'night';

		// Return null for all other times (8-11 AM, 12-2 PM, 4-6 PM, 8-11 PM, 2-5 AM)
		return null;
	}

	function getDaysSinceLastVisit(): number | null {
		if (typeof window === 'undefined') return null;

		const lastVisit = localStorage.getItem('lastVisit');
		if (!lastVisit) return null;

		const diff = Date.now() - new Date(lastVisit).getTime();
		return Math.floor(diff / (1000 * 60 * 60 * 24));
	}

	function updateLastVisit() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('lastVisit', new Date().toISOString());
		}
	}

	function selectMessage(): string {
		// Message type probabilities (must sum to 1.0)
		const MESSAGE_WEIGHTS = {
			troll: 0.01, // 1% - rare easter eggs
			absence: 0.15, // - returning after absence
			sameDay: 0.05, // - multiple sessions same day
			streak: 0.15, // - streak celebration
			progress: 0.1, // - progress milestone
			timeOfDay: 0.1, // - time-specific
			welcome: 0.1, // - generic welcome
			motivation: 0.1, // - generic motivation
			action: 0.1 // - call to action
		};

		// New users get welcome messages
		if (!hasAnyTracks) {
			return NEW_USER_MESSAGES[Math.floor(Math.random() * NEW_USER_MESSAGES.length)];
		}

		// Build available message pools with their weights
		const availablePools: { messages: string[]; weight: number }[] = [];

		// Troll messages (always available for returning users)
		availablePools.push({
			messages: TROLL_MESSAGES,
			weight: MESSAGE_WEIGHTS.troll
		});

		// Check days since last visit
		const daysSince = getDaysSinceLastVisit();
		if (daysSince !== null && daysSince > 7) {
			availablePools.push({
				messages: [
					'طولت الغيبة! وقت العودة للكود',
					'اشتقنا لك. الكود اشتاق لك أكثر',
					'{name}، رجعت في الوقت المناسب'
				],
				weight: MESSAGE_WEIGHTS.absence
			});
		} else if (daysSince === 0) {
			availablePools.push({
				messages: ['رجعت سريع! هذا الحماس', 'ما كفاك اليوم؟ ممتاز', 'جلسة ثانية؟ هذا الإصرار نحبه'],
				weight: MESSAGE_WEIGHTS.sameDay
			});
		}

		// Streak messages
		if (currentStreak > 2) {
			availablePools.push({
				messages: STREAK_MESSAGES.map((msg) => msg.replace('{streak}', currentStreak.toString())),
				weight: MESSAGE_WEIGHTS.streak
			});
		}

		// Progress messages
		if (completedLessons > 5) {
			availablePools.push({
				messages: PROGRESS_MESSAGES.map((msg) =>
					msg.replace('{lessons}', completedLessons.toString())
				),
				weight: MESSAGE_WEIGHTS.progress
			});
		}

		// Time-based messages
		const timeOfDay = getTimeOfDay();
		if (timeOfDay !== null) {
			availablePools.push({
				messages: TIME_BASED_MESSAGES[timeOfDay],
				weight: MESSAGE_WEIGHTS.timeOfDay
			});
		}

		// Always available generic messages
		availablePools.push(
			{ messages: WELCOME_MESSAGES, weight: MESSAGE_WEIGHTS.welcome },
			{ messages: MOTIVATION_MESSAGES, weight: MESSAGE_WEIGHTS.motivation },
			{ messages: ACTION_MESSAGES, weight: MESSAGE_WEIGHTS.action }
		);

		// Normalize weights based on available pools
		const totalWeight = availablePools.reduce((sum, pool) => sum + pool.weight, 0);
		const normalizedPools = availablePools.map((pool) => ({
			...pool,
			weight: pool.weight / totalWeight
		}));

		// Select pool based on weighted random
		const random = Math.random();
		let cumulativeWeight = 0;

		for (const pool of normalizedPools) {
			cumulativeWeight += pool.weight;
			if (random <= cumulativeWeight + Number.EPSILON) {
				return pool.messages[Math.floor(Math.random() * pool.messages.length)];
			}
		}

		// Fallback (shouldn't reach here)
		return ACTION_MESSAGES[Math.floor(Math.random() * ACTION_MESSAGES.length)];
	}
	let welcomeMessage = $state('');

	onMount(() => {
		// Update last visit time
		updateLastVisit();

		const selectedMessage = selectMessage();
		const targetMessage = selectedMessage.replace('{name}', name ? `@${name}` : '');

		let charIndex = 0;
		welcomeMessage = '';

		const typingInterval = setInterval(() => {
			if (charIndex < targetMessage.length) {
				welcomeMessage += targetMessage[charIndex];
				charIndex++;
			} else {
				clearInterval(typingInterval);
			}
		}, 10);

		return () => {
			clearInterval(typingInterval);
		};
	});
</script>

<div
	class="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl p-6 transition-all duration-300 md:flex-row
	{is_user_premium
		? 'bg-gradient-to-br from-purple-50 via-white to-indigo-50 shadow-xl ring-2 shadow-purple-100/25 ring-purple-400/30 dark:from-purple-950/30 dark:via-slate-800 dark:to-indigo-950/20 dark:shadow-purple-900/20 dark:ring-purple-500/20'
		: 'bg-slate-100 dark:bg-slate-800'}"
>
	<div
		class="flex flex-1 flex-col items-center gap-4 text-center md:flex-row md:gap-6 md:text-start"
	>
		{#if is_user_premium}
			<div class="relative flex h-20 w-20 flex-shrink-0 items-center justify-center">
				<div
					class="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 opacity-15 blur-2xl dark:from-purple-500 dark:to-indigo-600 dark:opacity-10"
				></div>
				<div
					class="absolute inset-2 rounded-full bg-gradient-to-br from-purple-400/10 to-indigo-500/10 blur-lg"
				></div>
				<div
					class="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/80 ring-1 ring-purple-400/30 backdrop-blur-sm dark:bg-gray-950/50 dark:ring-purple-500/30"
				>
					<IconPng name="premium" size={28} />
				</div>
			</div>
		{/if}

		<div class="flex min-h-[2.25rem] items-center gap-3">
			<h2
				class="text-2xl font-bold {is_user_premium
					? 'bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400'
					: 'text-gray-900 dark:text-white'}"
				dir="auto"
			>
				{welcomeMessage}
			</h2>
		</div>
	</div>

	<div class="shrink-0">
		{#if hasAnyTracks && handleContinueLearning}
			<Button
				onclick={handleContinueLearning}
				startIcon="play"
				class="px-8 {is_user_premium ? 'transition-all hover:scale-105 hover:brightness-110' : ''}"
				variant="attention"
			>
				{i18n.t('dashboard.continue_learning')}
			</Button>
		{:else if !hasAnyTracks}
			<Button
				href="/courses"
				startIcon="plus"
				variant="attention"
				class="px-8 {is_user_premium ? 'transition-all hover:scale-105 hover:brightness-110' : ''}"
			>
				{i18n.t('dashboard.start_learning')}
			</Button>
		{/if}
	</div>
</div>

export default {
	lessons: {
		answerHere: 'اكتب هنا',
		expectedOutput: 'الناتج المتوقع',
		actualOutput: 'الناتج الفعلي',
		selectLine: 'اختر سطراً للمتابعة',
		correctAnswer: 'إجابة صحيحة!',
		tryAgain: 'حاول مرة أخرى',
		tryAgainKeepGoing: 'ليس تماما بعد - استمر!',
		gettingCloser: 'واصل المحاولة!',
		letMeHelp: 'هل تريد بعض المساعدة؟',
		hint: 'تلميح',
		showHint: 'عرض التلميح',
		hideHint: 'إخفاء التلميح',
		continue: 'متابعة',
		checkAnswer: 'تحقق من الإجابة',
		checking: 'جار التحقق...',
		getAnswer: 'أحصل على الإجابة',
		why: 'شرح الإجابة'
	},
	forgotPassword: {
		success: 'إذا كان البريد الإلكتروني صحيحاً، سنرسل لك رابطاً لإعادة تعيين كلمة المرور',
		title: 'نسيت كلمة المرور',
		description: 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور',
		submiting: 'جاري الإرسال...',
		submit: 'إرسال',
		rememberPassword: 'تتذكر كلمة المرور؟',
		signinHere: 'تسجيل الدخول هنا'
	},
	resetPassword: {
		title: 'إعادة تعيين كلمة المرور',
		description: 'الرجاء إدخال كلمة المرور الجديدة',
		success: 'تم إعادة تعيين كلمة المرور بنجاح',
		submiting: 'جاري إعادة التعيين...',
		submit: 'إعادة تعيين كلمة المرور',
		rememberPassword: 'تتذكر كلمة المرور؟',
		signinHere: 'تسجيل الدخول هنا'
	},
	site: {
		logo: 'أكود',
		name: 'أكود'
	},
	signup: {
		title: 'إنشاء حساب جديد',
		submit: 'إنشاء حساب',
		submiting: 'جاري إنشاء حساب...',
		haveAccount: 'لديك حساب؟',
		signinHere: 'تسجيل الدخول هنا',
		// success: 'رمز التفعيل في طريقه إلى بريدك الإلكتروني...',
		success: 'تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول للبدء.',
		terms: 'من خلال المتابعة، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.'
	},
	signin: {
		title: 'تسجيل الدخول',
		submit: 'تسجيل الدخول',
		submiting: 'جاري تسجيل الدخول...',
		noAccount: 'ليس لديك حساب؟',
		signupHere: 'إنشاء حساب جديد',
		success: 'تم تسجيل الدخول بنجاح! جاري تحويلك...',
		identifier: 'البريد الإلكتروني أو اسم المستخدم',
		identifierPlaceholder: 'أدخل بريدك الإلكتروني أو اسم المستخدم',
		rememberMe: 'تذكرني',
		forgotPassword: 'نسيت كلمة المرور؟'
	},
	verifyEmail: {
		title: 'تحقق من بريدك الإلكتروني',
		description: 'يرجى إدخال رمز التحقق المكون من 6 أرقام المرسل إلى بريدك الإلكتروني',
		verify: 'تحقق من البريد',
		verifying: 'جارِ التحقق...',
		success: 'تم التحقق من البريد الإلكتروني بنجاح!',
		noCode: 'لم يصلك الرمز؟',
		resend: 'إعادة إرسال الرمز',
		incomplete: 'يرجى إدخال رمز التحقق كاملاً'
	},
	validation: {
		required: 'هذا الحقل مطلوب',
		identifier: {
			required: 'البريد الإلكتروني أو اسم المستخدم مطلوب',
			maxLength: 'يجب ألا يتجاوز البريد الإلكتروني أو اسم المستخدم 100 حرف'
		},
		email: {
			required: 'البريد الإلكتروني مطلوب',
			invalid: 'الرجاء إدخال بريد إلكتروني صحيح',
			maxLength: 'يجب ألا يتجاوز البريد الإلكتروني 100 حرف'
		},
		username: {
			minLength: 'يجب أن يحتوي اسم المستخدم على 4 أحرف على الأقل',
			maxLength: 'يجب ألا يتجاوز اسم المستخدم 40 حرف',
			pattern: 'يمكن أن يحتوي اسم المستخدم على أحرف وأرقام وشرطات سفلية وواصلات فقط'
		},
		password: {
			minLength: 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل',
			maxLength: 'يجب ألا تتجاوز كلمة المرور 100 حرف',
			number: 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل',
			required: 'كلمة المرور مطلوبة'
		},
		confirmPassword: {
			required: 'الرجاء تأكيد كلمة المرور',
			match: 'كلمات المرور غير متطابقة'
		}
	},
	common: {
		track_content: 'المسار الدراسي',
		streak: {
			broken: 'انقطع الستريك',
			start: 'ابدأ ستريكك اليوم',
			highscore: 'رقم قياسي جديد!',
			continue: 'استمر في ستريكك',
			label: 'الستريك'
		},
		consecutive_days: 'أيام متتالية',
		your_longest_streak: 'رقمك القياسي',
		completedItems: 'تمارين مكتملة',
		share: 'مشاركة',
		copyLink: 'نسخ الرابط',
		shareOn: 'مشاركة على',
		twitter: 'تويتر',
		linkedin: 'لينكد إن',
		facebook: 'فيسبوك',
		joined: 'انضم في',
		choose_correct_answer: 'اختر الإجابة الصحيحة',
		progress: 'التقدم',
		solution_explanation: 'شرح الحل',

		track: 'المسار',
		challenges_completed: 'التحديات المنجزة',
		lessons_completed: 'الدروس المنجزة',
		your_progress: 'تقدمك',
		xp_earned: 'خبرتك المكتسبة',

		done: 'تم!',
		upgrade_to_unlock_content: 'قم بالترقية لفتح المحتوى',
		coming_soon: 'قريباً',
		find_other_tracks: 'استكشف مسارات أخرى',
		continue_learning: 'متابعة التعلم',
		copied: 'تم نسخ',
		copy: 'نسخ',
		locked: 'مغلق',
		username: 'اسم المستخدم',
		email: 'البريد الإلكتروني',
		password: 'كلمة المرور',
		repeatPassword: 'تأكيد كلمة المرور',
		usernamePlaceholder: 'اسم المستخدم',
		identifier: 'المعرف',
		identifierPlaceholder: 'البريد الإلكتروني أو اسم المستخدم',
		passwordPlaceholder: 'كلمة المرور',
		emailPlaceholder: 'البريد الالكتروني',
		currentPassword: 'كلمة المرور الحالية',
		currentPasswordPlaceholder: 'ادخل كلمة المرور الحالية',
		newPassword: 'كلمة المرور الجديدة',
		newPasswordPlaceholder: 'ادخل كلمة المرور الجديدة',
		confirmPassword: 'تأكيد كلمة المرور',
		confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور الجديدة',
		solutions: 'حلول',
		clear_filters: 'مسح التصفية',
		loading: 'جاري التحميل...',
		error: 'حدث خطأ',
		retry: 'إعادة المحاولة',
		upgrade: 'ترقية العضوية',
		learn_more: 'اعرف المزيد',
		start_now: 'ابدأ الآن',
		online: 'متصل',
		offline: 'غير متصل',
		success: 'تم بنجاح',
		continue: 'متابعة',
		upgrade_now: 'ترقية الآن',
		view_all: 'عرض الكل',
		cancel: 'إلغاء',
		save: 'حفظ',
		edit: 'تعديل',
		delete: 'حذف',
		more: 'المزيد',
		less: 'أقل',
		back: 'رجوع',
		next: 'التالي',
		false_answer: 'الإجابة خاطئة',
		days: '{days} يوم',
		today: 'اليوم',
		completed: 'منجز',
		premium_only: 'العضوية المميزة فقط',
		premium: 'عضوية مميزة',
		xp: {
			xp: 'نقطة خبرة',
			xpLeftToLevel: '{xp} نقطة خبرة متبقية للوصول إلى المستوى {level}'
		},
		modules: 'وحدات',
		module: 'وحدة'
	},
	errors: {
		USERNAME_CONFLICT: 'اسم المستخدم مستخدم بالفعل',
		EMAIL_CONFLICT: 'البريد الإلكتروني مستخدم بالفعل',
		MISSING_AUTHORIZATION_TOKEN: 'الرجاء تسجيل الدخول',
		INVALID_AUTHORIZATION_TOKEN: 'جلسة غير صالحة، الرجاء تسجيل الدخول مرة أخرى',
		INVALID_AUTHORIZATION_TOKEN_CLAIMS: 'جلسة غير صالحة، الرجاء تسجيل الدخول مرة أخرى',
		INTERNAL_ERROR: 'حدث خطأ داخلي',
		SOMETHING_WENT_WRONG: 'حدث خطأ ما',
		INVALID_EMAIL_VERIFICATION_TOKEN: 'رمز التحقق غير صالح',
		INVALID_INPUT: 'البيانات المدخلة غير صحيحة',
		BAD_CREDENTIALS: 'اسم المستخدم/البريد الإلكتروني أو كلمة المرور غير صحيحة'
	},
	navigation: {
		dashboard: 'لوحة التحكم ',
		exploreTracks: 'المسارات التعليمية',
		upgradePlan: 'ترقية العضوية',
		settings: 'الإعدادات',
		signout: 'تسجيل الخروج',
		glossary: 'المصطلحات البرمجية',
		signin: 'تسجيل الدخول',
		signup: 'إنشاء حساب جديد',
		viewProfile: 'عرض حسابي'
	},
	tracks: {
		explore: {
			title: 'استكشف المسارات التعليمية',
			description: 'اكتشف مسارات تعليمية مصممة خصيصًا لمساعدتك على تطوير مهاراتك البرمجية',
			search_placeholder: 'ابحث عن مسار تعليمي...',
			all_difficulties: 'جميع المستويات',
			all_languages: 'جميع لغات البرمجة',
			premium_only: 'المسارات المميزة فقط',
			no_results: 'لم يتم العثور على نتائج',
			try_different_filters: 'جرب تصفية مختلفة أو قم بإزالة المرشحات الحالية'
		},
		difficulty: {
			all: 'جميع المستويات',
			novice: 'لا خبرة',
			beginner: 'مبتدئ',
			intermediate: 'متوسط',
			advanced: 'متقدم',
			expert: 'خبير'
		},
		modules: 'تمرين',
		xp: 'نقطة خبرة',
		learners: 'متعلم',
		start_track: 'بدء المسار',
		continue_track: 'متابعة المسار',
		review_track: 'مراجعة المسار',
		estimated_hours: 'ساعة تقديرية',
		total_xp: 'مجموع نقاط الخبرة',
		exercises_completed: 'التمارين المكتملة',
		enrolled_users: 'المتعلمون المسجلون',
		prerequisites: 'المتطلبات الأساسية',
		what_you_learn: 'ماذا ستتعلم',
		tags: 'الوسوم',
		community: 'المجتمع',
		join_discussion: 'انضم إلى النقاش',
		join_discussion_desc: 'شارك في النقاشات مع المتعلمين الآخرين واحصل على المساعدة',
		view_discussions: 'عرض النقاشات',
		module_types: {
			quiz: 'اختبار',
			lesson: 'درس',
			coding: 'برمجة',
			project: 'مشروع'
		},
		start_exercise: 'بدء التمرين',
		review_exercise: 'مراجعة التمرين'
	},
	settings: {
		title: 'الإعدادات',
		account: {
			title: 'الحساب',
			accountSettings: 'إعدادات الحساب',
			profilePicture: 'الصورة الشخصية',
			changeProfilePicture: 'تغيير الصورة الشخصية',
			saveButton: 'حفظ التغييرات',
			updateAccountSuccess: 'تم تحديث الحساب بنجاح'
		},
		password: {
			changePassword: 'تغيير كلمة المرور',
			changePasswordSuccess: 'تم تغيير كلمة المرور بنجاح',
			saveButton: 'حفظ كلمة المرور'
		},
		billing: {
			title: 'الفوترة و الاشتراك'
		}
	},
	dashboard: {
		continue_learning: 'أكمل التعلّم',
		achievements: 'إنجازاتك',
		highest_streak: 'أطول فترة متتالية',
		highest_rank: 'أعلى رتبة',
		completed_tracks: 'مسارات مكتملة',
		start_learning: 'ابدأ التعلم',
		no_active_track: 'لا يوجد مسار نشط',
		tracks_empty_state: 'لم تبدأ أي مسار بعد',
		no_tracks: 'لا يوجد مسار',
		start_track_prompt: 'ابدأ مسارك الأول',
		browse_tracks: 'تصفح المسارات',
		premium_offer: 'العضوية المميزة',
		unlock_premium: 'ارتقِ بتعلمك إلى المستوى التالي',
		premium_description:
			'تمتع بوصول فوري وغير محدود لجميع المسارات المتقدمة والمشاريع الحصرية لتسريع رحلتك الاحترافية.',
		level: 'المستوى',
		toLevel: 'إلى المستوى',
		xp: 'نقاط الخبرة',
		streak: 'شعلة النشاط',
		rank: {
			rank: 'رتبة',
			title: 'ترتيبك العالمي',
			top: 'ضمن أفضل',
			viewLeaderboard: 'عرض لوحة المتصدرين',
			noRank: 'ليس لديك ترتيب بعد',
			earnXpToRank: 'اكسب نقاط خبرة للظهور في لوحة المتصدرين'
		},
		solved: 'تمارين محلولة',
		tracks: 'مسارات مكتملة',
		exercises: 'تمرين',
		resume_learning: 'استئناف التعلم',
		current_tracks: 'مساراتك الحالية',
		your_tracks: 'مساراتك',
		daily_challenge: 'تحدي اليوم',
		challenge: 'تحدي',
		daily_challenge_desc: 'حل تحدي البرمجة اليومي واكسب نقاط إضافية',
		community: 'المجتمع',
		join_community: 'انضم إلى مجتمعنا',
		join_community_desc: 'تواصل مع المبرمجين الآخرين وشارك تجربتك',
		join_now: 'انضم الآن',
		greeting: {
			morning: 'صباح الخير',
			evening: 'مساء الخير',
			hi: 'مرحبا'
		}
	},
	date: {
		format: {
			today: 'EEEE، dd MMMM yyyy - hdd hMMMM hyyyy'
		},
		// Days
		monday: 'الإثنين',
		tuesday: 'الثلاثاء',
		wednesday: 'الأربعاء',
		thursday: 'الخميس',
		friday: 'الجمعة',
		saturday: 'السبت',
		sunday: 'الأحد',

		// Months
		january: 'يناير',
		february: 'فبراير',
		march: 'مارس',
		april: 'أبريل',
		may: 'مايو',
		june: 'يونيو',
		july: 'يوليو',
		august: 'أغسطس',
		september: 'سبتمبر',
		october: 'أكتوبر',
		november: 'نوفمبر',
		december: 'ديسمبر',

		hijri: {
			muharram: 'محرم',
			safar: 'صفر',
			rabiAlAwwal: 'ربيع الأول',
			rabiAlThani: 'ربيع الثاني',
			jumadaAlUla: 'جمادى الأولى',
			jumadaAlThani: 'جمادى الثانية',
			rajab: 'رجب',
			shaban: 'شعبان',
			ramadan: 'رمضان',
			shawwal: 'شوال',
			dhuAlQidah: 'ذو القعدة',
			dhuAlHijjah: 'ذو الحجة'
		}
	},
	leaderboard: {
		title: 'لوحة المتصدرين',
		description: 'تنافس مع المتعلمين حول العالم واصعد إلى القمة!',
		timeframe: {
			allTime: 'كل الأوقات',
			monthly: 'هذا الشهر',
			weekly: 'هذا الأسبوع'
		},
		stats: {
			totalLearners: 'إجمالي المتعلمين',
			yourRank: 'ترتيبك',
			topXp: 'أعلى نقاط خبرة'
		},
		labels: {
			level: 'المستوى',
			dayStreak: 'سلسلة أيام',
			tracks: 'مسارات',
			xp: 'نقاط خبرة',
			you: 'أنت',
			rank: 'المركز'
		},
		empty: {
			title: 'لا توجد بيانات للوحة المتصدرين',
			description: 'تحقق مرة أخرى لاحقاً لرؤية الترتيبات!'
		},
		cta: {
			title: 'هل تريد الصعود أعلى؟',
			description:
				'أكمل المزيد من المسارات، واحتفظ بسلسلة نشاطك، واكسب نقاط الخبرة للصعود في الترتيب!',
			browseTracks: 'تصفح المسارات',
			viewDashboard: 'عرض لوحة التحكم'
		}
	}
} as const;

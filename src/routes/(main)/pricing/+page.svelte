<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';
	import IconPng from '$ui/common/IconPng.svelte';
	import Footer from '$ui/shared/Footer.svelte';
	import type { LayoutServerData } from '../$types';

	const { data }: { data: LayoutServerData } = $props();

	const user = $derived({
		isAuthenticated: !!data.user,
		isPro: data.user?.isPro ?? false
	});

	let billingCycleYearly = $state(false);
	let openFaqIndex: number | null = $state(null);

	const monthlyPrice = 10;
	const yearlyPrice = 8;
	const currentPrice = $derived(billingCycleYearly ? yearlyPrice : monthlyPrice);

	const lockedFeatures = [
		{
			icon: 'layers',
			title: 'جميع المسارات',
			desc: 'بايثون، ويب، خوارزميات  وكل مسار جديد نطلقه مستقبلاً'
		},
		{
			icon: 'code',
			title: 'تحديات متقدمة',
			desc: 'أكثر من 500 تحدي لتحويل الفهم النظري إلى مهارة برمجية حقيقية'
		},
		{
			icon: 'zap',
			title: 'مشاريع كاملة',
			desc: 'ابنِ مشاريع حقيقية من الصفر تضيفها لملفك الاحترافي على GitHub'
		},
		{
			icon: 'award',
			title: 'شهادات معتمدة',
			desc: 'شهادات إتمام تُثبت مستواك وتضيفها مباشرة لـ LinkedIn'
		},
		{
			icon: 'eye-off',
			title: 'بدون إعلانات',
			desc: 'تركيز كامل على التعلم، بدون أي مشتتات أو انقطاع'
		},
		{
			icon: 'headphones',
			title: 'دعم ذو أولوية',
			desc: 'أسئلتك تُجاب أولاً  فريقنا في خدمتك قبل غيرك'
		}
	];

	const faqs = [
		{
			q: 'أنا أستخدم النسخة المجانية  هل يستحق الترقية؟',
			a: 'إذا وصلت لحدود المجاني وتريد الاستمرار  نعم تماماً. البرو يفتح كل شيء فوراً: المسارات الكاملة، التحديات، المشاريع. ما تعلمته حتى الآن يبقى، والآن تكمل بلا قيود.'
		},
		{
			q: 'هل يمكنني الإلغاء في أي وقت؟',
			a: 'نعم بالكامل، بضغطة زر من إعدادات حسابك. لا أسئلة، لا إجراءات معقدة. تحتفظ بالوصول حتى نهاية الفترة المدفوعة.'
		},
		{
			q: 'هل المسارات الجديدة مشمولة تلقائياً؟',
			a: 'نعم. كل مسار نبنيه ونطلقه يظهر فوراً في حسابك  بدون رسوم إضافية أو اشتراكات منفصلة.'
		},
		{
			q: 'ما طرق الدفع المتاحة؟',
			a: 'جميع بطاقات الائتمان العالمية (Visa، Mastercard، Amex). معالجة آمنة ومشفرة عبر Polar.sh.'
		}
	];

	function toggleFaq(i: number) {
		openFaqIndex = openFaqIndex === i ? null : i;
	}

	const checkoutUrl = $derived(
		billingCycleYearly
			? `/services/checkout?products=customerExternalId=${data.user?.id}&customerEmail=${data.user?.email}`
			: `/services/checkout?products=customerExternalId=${data.user?.id}&customerEmail=${data.user?.email}`
	);
</script>

<svelte:head>
	<title>أكود برو | أكود</title>
	<meta name="description" content="وصول كامل لجميع مسارات أكود. تعلّم البرمجة بجدية بدون قيود." />
</svelte:head>

<div class="min-h-screen bg-[#FAFAF8] transition-colors duration-300 dark:bg-gray-950">
	<div class="mx-auto max-w-5xl px-6 sm:px-10 lg:px-12">
		<!-- ░░ HERO ░░ -->
		<section class="pt-4 pb-0 text-center">
			<div class="fade-up mb-2 flex justify-center">
				<IconPng name="premium" size={120} alt="Premium" />
			</div>

			<h1
				class="fade-up mx-auto font-black tracking-tight text-gray-950 delay-1 dark:text-white"
				style="font-size: clamp(2.4rem, 6vw, 4.4rem); max-width: 720px; line-height: 1.26;"
			>
				البرمجة الحقيقية<br />
				<span class="text-violet-600 dark:text-violet-400">تبدأ من هنا.</span>
			</h1>

			<!-- <p -->
			<!-- 	class="fade-up mx-auto mt-5 max-w-[460px] text-base leading-relaxed text-gray-500 delay-2 dark:text-gray-500" -->
			<!-- > -->
			<!-- 	وصول كامل لكل مسارات أكود، التحديات المتقدمة، والمشاريع التي تبني بها مستقبلك المهني. -->
			<!-- </p> -->

			<!-- Billing toggle -->
			<div class="fade-up mt-10 flex justify-center delay-3">
				<div
					class="inline-flex items-center gap-0.5 rounded-full bg-gray-200/80 p-1 dark:bg-gray-900"
				>
					<button
						onclick={() => (billingCycleYearly = false)}
						class="rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none
							{!billingCycleYearly
							? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
							: 'text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-400'}"
					>
						شهرياً
					</button>
					<button
						onclick={() => (billingCycleYearly = true)}
						class="flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none
							{billingCycleYearly
							? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
							: 'text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-400'}"
					>
						سنوياً
						<span
							class="rounded-md bg-violet-600 px-1.5 pt-1 text-xs leading-tight font-extrabold text-white"
						>
							−20%
						</span>
					</button>
				</div>
			</div>
		</section>

		<!-- ░░ MAIN LAYOUT ░░ -->
		<section class="mt-12 pb-0">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
				<!-- PRICE CARD -->
				<div class="w-full lg:w-100 lg:shrink-0">
					<div
						class="relative overflow-hidden rounded-3xl bg-gray-950 ring-1 ring-white/[0.07]"
						style="box-shadow: 0 24px 60px rgb(0 0 0 / 0.22);"
					>
						<!-- Ambient violet bloom -->
						<div
							class="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-violet-700/25 blur-3xl"
						></div>

						<div class="relative p-8 sm:p-9">
							<!-- Badge row -->
							<div class="mb-7 flex items-center justify-between">
								<span
									class="rounded-full bg-violet-500/15 px-3 py-1 text-[11px] font-black tracking-widest text-violet-400 uppercase ring-1 ring-violet-500/25"
								>
									برو
								</span>
								{#if billingCycleYearly}
									<span class="text-xs text-gray-400">
										يُدفع <strong class="text-violet-400">${yearlyPrice * 12}</strong> سنوياً
									</span>
								{/if}
							</div>

							<!-- Price -->
							<div class="mb-1 flex items-baseline gap-2">
								<span
									class="leading-none font-black text-white"
									style="font-size: 4.8rem; letter-spacing: -0.04em;"
								>
									${currentPrice}
								</span>
								<span class="mb-1 text-sm text-gray-400">/ شهرياً</span>
							</div>

							{#if billingCycleYearly}
								<p class="mb-8 text-xs text-gray-400">
									بدلاً من $10
									<span class="font-semibold text-violet-400">توفر $24 سنوياً</span>
								</p>
							{:else}
								<p class="mb-8 text-xs text-gray-400">ادفع سنوياً ووفر $24</p>
							{/if}

							<!-- Divider -->
							<div class="mb-7 border-t border-white/6"></div>

							<!-- Includes -->
							<ul class="mb-8 space-y-3">
								{#each ['جميع المسارات الحالية والمستقبلية', 'تحديات ومشاريع برمجية متقدمة', 'شهادات إتمام معتمدة', 'تجربة بدون إعلانات', 'دعم فني ذو أولوية'] as item}
									<li class="flex items-center gap-3">
										<span
											class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 ring-1 ring-violet-500/30"
										>
											<Icon name="check" class="h-3 w-3 text-violet-400" />
										</span>
										<span class="text-sm text-gray-400">{item}</span>
									</li>
								{/each}
							</ul>

							<!-- CTA -->
							{#if user.isPro}
								<div
									class="rounded-2xl bg-violet-500/10 py-4 text-center text-sm font-bold text-violet-400 ring-1 ring-violet-500/20"
								>
									أنت مشترك بالفعل ✓
								</div>
							{:else}
								<form action="/services/payments/create-checkout-session" method="POST">
									<input type="hidden" name="key" value="pro_monthly" />
									<button
										type="submit"
										class="cta-btn block w-full rounded-2xl bg-violet-600 py-4 text-center text-sm font-bold tracking-[-0.01em] text-white shadow-lg shadow-violet-700/30 hover:bg-violet-500"
									>
										{user.isAuthenticated ? 'ابدأ أكود برو الآن' : 'سجّل وابدأ فوراً'}
									</button>
								</form>
							{/if}

							<p class="mt-4 text-center text-xs text-gray-400">لا رسوم خفية · إلغاء في أي وقت</p>
						</div>
					</div>
				</div>

				<!-- CONTENT COLUMN -->
				<div class="min-w-0 flex-1 space-y-4">
					<!-- What you unlock -->
					<div
						class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800/60 dark:bg-gray-950"
					>
						<div class="border-b border-gray-100 px-6 py-4 dark:border-gray-800/60">
							<p class="text-sm font-bold text-gray-950 uppercase dark:text-gray-500">
								ما الذي تفتحه مع الترقية
							</p>
						</div>
						<div class="divide-y divide-gray-100 dark:divide-gray-800/60">
							{#each lockedFeatures as feat}
								<div
									class="px-6 py-4 transition-colors duration-150 hover:bg-violet-50/60 dark:hover:bg-violet-950/20"
								>
									<p class="text-sm font-bold text-gray-900 dark:text-white">{feat.title}</p>
									<p class="mt-0.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
										{feat.desc}
									</p>
								</div>
							{/each}
						</div>
					</div>

					<!-- FAQ -->
					<div
						class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800/60 dark:bg-gray-950"
					>
						<div class="border-b border-gray-100 px-6 py-4 dark:border-gray-800/60">
							<p class="text-sm font-bold text-gray-950 uppercase dark:text-gray-500">
								أسئلة شائعة
							</p>
						</div>
						<div>
							{#each faqs as faq, i}
								<div class={i > 0 ? 'border-t border-gray-100 dark:border-gray-800/60' : ''}>
									<button
										onclick={() => toggleFaq(i)}
										class="flex w-full items-center justify-between gap-4 px-6 py-4 text-right transition-colors duration-150 hover:bg-gray-50 focus:outline-none dark:hover:bg-gray-900/50"
									>
										<span class="text-sm font-semibold text-gray-900 dark:text-white">{faq.q}</span>
										<span
											class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-200
												{openFaqIndex === i
												? 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400'
												: 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-400'}"
										>
											<Icon
												name="plus"
												class="h-3 w-3 transition-transform duration-200 {openFaqIndex === i
													? 'rotate-45'
													: ''}"
											/>
										</span>
									</button>

									<div class="faq-body {openFaqIndex === i ? 'open' : ''}">
										<div class="faq-body-inner">
											<div class="border-t border-gray-100 px-6 pt-4 pb-5 dark:border-gray-800/60">
												<p class="text-sm leading-relaxed text-gray-500 dark:text-gray-500">
													{faq.a}
												</p>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- ░░ Trust bar ░░ -->
		<div
			class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-14 text-xs text-gray-400 dark:text-gray-500"
		>
			<span class="flex items-center gap-1.5">
				<Icon name="shield" class="h-3.5 w-3.5" />
				دفع آمن عبر Polar.sh
			</span>
			<span class="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-800"></span>
			<span>إلغاء في أي وقت</span>
			<span class="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-800"></span>
			<span>بدون رسوم خفية</span>
			<span class="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-800"></span>
			<span>يشمل جميع التحديثات</span>
		</div>
	</div>

	<Footer />
</div>

<style>
	/* Smooth accordion via CSS grid */
	.faq-body {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.26s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.faq-body.open {
		grid-template-rows: 1fr;
	}
	.faq-body-inner {
		overflow: hidden;
	}

	/* CTA micro-interaction */
	.cta-btn {
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}
	.cta-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 10px 30px rgb(124 58 237 / 0.45);
	}
	.cta-btn:active {
		transform: translateY(0);
	}

	/* Staggered entrance */
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.fade-up {
		animation: fade-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
	}
	.fade-up.delay-1 {
		animation-delay: 0.08s;
	}
	.fade-up.delay-2 {
		animation-delay: 0.16s;
	}
	.fade-up.delay-3 {
		animation-delay: 0.24s;
	}
</style>

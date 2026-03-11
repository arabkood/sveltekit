<script lang="ts">
	import { POLAR_PRODUCTS } from '$config';
	import Icon from '$ui/common/Icon.svelte';
	import Footer from '$ui/shared/Footer.svelte';
	import type { LayoutServerData } from '../$types';
	import PricingCard from './PricingCard.svelte';

	const { data }: { data: LayoutServerData } = $props();

	const user = {
		isAuthenticated: !!data.user,
		currentPlan: data.user?.premiumActive ? 'pro' : 'free'
	};

	let billingCycleYearly = $state(false);

	const features = [
		{ name: 'الوصول للمحتوى الأساسي', free: true, pro: true },
		{ name: 'بيئة برمجية تفاعلية', free: true, pro: true },
		{ name: 'مسار "كيف يعمل الإنترنت"', free: true, pro: true },
		{ name: 'وصول كامل لجميع المسارات', free: false, pro: true },
		{ name: 'تحديات برمجية متقدمة', free: false, pro: true },
		{ name: 'مشاريع تطبيقية', free: false, pro: true },
		{ name: 'شهادات إتمام', free: false, pro: true },
		{ name: 'إزالة الإعلانات', free: false, pro: true },
		{ name: 'دعم ذو أولوية', free: false, pro: true }
	];

	const faqs = [
		{
			q: 'هل يمكنني إلغاء اشتراكي في أي وقت؟',
			a: 'نعم. يمكنك إلغاء اشتراكك في أي وقت من خلال صفحة حسابك. تظل لديك صلاحية الوصول حتى نهاية فترة الفوترة.'
		},
		{
			q: 'ما هي طرق الدفع المقبولة؟',
			a: 'نقبل جميع بطاقات الائتمان الرئيسية. تتم معالجة المدفوعات بشكل آمن عبر الوسيط Polar.sh.'
		},
		{
			q: 'هل سأحصل على تحديثات مستقبلية؟',
			a: 'بالتأكيد! كل المسارات الحالية والجديدة مشمولة ضمن اشتراكك طالما أنه فعال.'
		},
		{
			q: 'ماذا بعد انتهاء الفترة المجانية؟',
			a: 'الباقة المجانية دائمة. يمكنك الترقية فقط عندما تكون مستعداً.'
		}
	];

	let openFaqIndex: number | null = $state(null);

	function toggleFaq(index: number) {
		openFaqIndex = openFaqIndex === index ? null : index;
	}

	const plans = [
		{
			id: 'free',
			name: 'المجانية',
			description: 'مثالية للمبتدئين والتجربة الأولى.',
			price: { monthly: 0, yearly: 0 },
			priceSuffix: '/ للأبد',
			features: [
				'الوحدات الأولى من كل مسار',
				'مسار كامل: كيف يعمل الإنترنت',
				'تمارين أساسية وبيئة تفاعلية'
			],
			isPopular: false,
			iconName: 'users'
		},
		{
			id: 'pro',
			name: 'أكوود برو',
			description: 'الوصول الكامل مع تحديات ومشاريع متقدمة.',
			price: { monthly: 10, yearly: 8 }, // Price per month
			priceSuffix: '/ شهرياً',
			features: [
				'<strong>كل شيء في المجانية</strong> بالإضافة إلى:',
				'وصول كامل لجميع المسارات الحالية والمستقبلية',
				'تحديات ومشاريع متقدمة لتطبيق المهارات',
				'شهادات إتمام معتمدة',
				'دعم فني ذو أولوية'
			],
			isPopular: true,
			iconName: 'zap',
			checkout: {
				yearly: `/services/checkout?products=${POLAR_PRODUCTS.premium_yearly}&customerExternalId=${data.user?.id}&customerEmail=${data.user?.email}`,
				monthly: `/services/checkout?products=${POLAR_PRODUCTS.premium_monthly}&customerExternalId=${data.user?.id}&customerEmail=${data.user?.email}`
			}
		}
	];
</script>

<svelte:head>
	<title>الأسعار | أكوود</title>
	<meta name="description" content="اختر خطة أكوود: مجاناً أو برو للوصول الكامل." />
</svelte:head>

<div class="bg-page min-h-screen">
	<main class="mx-auto max-w-7xl p-6 lg:p-8">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="mx-auto mb-16 max-w-4xl text-center">
				<div class="mb-6 inline-block rounded-full bg-emerald-100 px-4 py-2 dark:bg-emerald-900/30">
					<span class="text-sm font-semibold text-emerald-700 dark:text-emerald-300">الأسعار</span>
				</div>
				<h1
					class="mb-6 text-4xl leading-tight font-black text-gray-900 sm:text-5xl lg:text-6xl dark:text-white"
				>
					اختر الخطة التي تناسبك
				</h1>
				<p
					class="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-300"
				>
					ابدأ رحلتك التعليمية مجاناً، أو قم بالترقية لفتح كامل إمكانيات المنصة والحصول على تجربة
					تعلم متقدمة.
				</p>
			</div>

			<div class="mb-16 flex flex-col items-center gap-6">
				<div
					class="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800"
				>
					<!-- Monthly Button -->
					<button
						onclick={() => (billingCycleYearly = false)}
						class="relative cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
						class:bg-white={!billingCycleYearly}
						class:text-gray-900={!billingCycleYearly}
						class:dark:bg-gray-700={!billingCycleYearly}
						class:dark:text-white={!billingCycleYearly}
						class:bg-transparent={billingCycleYearly}
						class:text-gray-500={billingCycleYearly}
						class:dark:text-gray-400={billingCycleYearly}
					>
						شهرياً
					</button>

					<!-- Yearly Button -->
					<button
						onclick={() => (billingCycleYearly = true)}
						class="relative flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
						class:bg-white={billingCycleYearly}
						class:text-gray-900={billingCycleYearly}
						class:dark:bg-gray-700={billingCycleYearly}
						class:dark:text-white={billingCycleYearly}
						class:bg-transparent={!billingCycleYearly}
						class:text-gray-500={!billingCycleYearly}
						class:dark:text-gray-400={!billingCycleYearly}
					>
						<span>سنوياً</span>
						<span
							class="animate-pulse rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white"
						>
							وفر 20%
						</span>
					</button>
				</div>
			</div>

			<!-- Simplified Pricing Grid -->
			<div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
				{#each plans as plan (plan.id)}
					<PricingCard {plan} {billingCycleYearly} {user} />
				{/each}
			</div>

			<!-- Enhanced Features Table -->
			<div class="mx-auto mt-28 max-w-6xl">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
						مقارنة للميزات
					</h2>
					<p class="text-lg text-gray-600 dark:text-gray-400">تعرف على كل ما تحصل عليه في كل خطة</p>
				</div>
				<div
					class="overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 shadow-lg backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-900/80"
				>
					<table class="w-full text-right text-gray-600 dark:text-gray-300">
						<thead
							class="bg-gradient-to-r from-gray-50 to-gray-100 text-sm font-semibold text-gray-900 dark:from-gray-800 dark:to-gray-700 dark:text-gray-200"
						>
							<tr>
								<th class="px-8 py-6 text-start">الميزة</th>
								<th class="w-48 px-6 py-6 text-center">
									<div class="flex flex-col items-center gap-1">
										<span class="font-bold">المجانية</span>
										<span class="text-xs opacity-75">لتجربة المنصة</span>
									</div>
								</th>
								<th class="w-48 px-6 py-6 text-center">
									<div class="flex flex-col items-center gap-1">
										<span class="rounded-lg bg-emerald-700 px-3 py-1 font-bold text-white">
											أكوود برو
										</span>
										<span class="text-xs opacity-75">للمبتدئين و المحترفين</span>
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{#each features as feature, i}
								<tr
									class="border-t border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-gray-700/50 dark:hover:bg-gray-800/30"
								>
									<td class="px-8 py-5 font-medium text-gray-900 dark:text-white">{feature.name}</td
									>
									<td class="px-6 py-5 text-center">
										{#if feature.free}
											<div
												class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
											>
												<Icon name="check" class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
											</div>
										{:else}
											<div
												class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
											>
												<Icon name="minus" class="h-4 w-4 text-gray-400" />
											</div>
										{/if}
									</td>
									<td class="px-6 py-5 text-center">
										{#if feature.pro}
											<div
												class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
											>
												<Icon name="check" class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
											</div>
										{:else}
											<div
												class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
											>
												<Icon name="minus" class="h-4 w-4 text-gray-400" />
											</div>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Enhanced FAQ Section -->
			<div class="mx-auto mt-28 max-w-4xl">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
						أسئلة شائعة
					</h2>
					<p class="text-lg text-gray-600 dark:text-gray-400">
						إجابات على أهم الأسئلة التي قد تخطر ببالك
					</p>
				</div>
				<div class="space-y-4">
					{#each faqs as faq, index}
						<div
							class="overflow-hidden rounded-xl border border-gray-200/60 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900/80"
						>
							<button
								class="flex w-full items-center justify-between gap-4 p-6 text-right transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
								onclick={() => toggleFaq(index)}
								aria-expanded={openFaqIndex === index}
							>
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{faq.q}</h3>
								<Icon
									name="chevron-down"
									class={'h-5 w-5 text-gray-500 transition-transform duration-300' +
										(openFaqIndex === index ? 'rotate-180' : '')}
								/>
							</button>
							{#if openFaqIndex === index}
								<div class="animate-in slide-in-from-top-2 px-6 pb-6 duration-300">
									<div
										class="border-t border-gray-200/50 pt-4 leading-relaxed text-gray-600 dark:border-gray-700/50 dark:text-gray-300"
									>
										{faq.a}
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</main>
	<br />
	<br />
	<Footer />
</div>

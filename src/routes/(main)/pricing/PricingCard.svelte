<script lang="ts">
	import { slide } from 'svelte/transition';
	import Icon from '$ui/common/Icon.svelte';

	type Plan = {
		id: 'free' | 'pro' | string;
		name: string;
		description: string;
		iconName: 'users' | 'zap';
		price: { monthly: number; yearly: number };
		priceSuffix: string;
		features: string[];
		isPopular: boolean;
		checkout?: {
			monthly: string;
			yearly: string;
		};
	};

	type User = {
		isAuthenticated: boolean;
		currentPlan: 'free' | 'pro';
	};

	let { plan, billingCycleYearly, user }: { plan: Plan; billingCycleYearly: boolean; user?: User } =
		$props();

	const isFreePlan = $derived(plan.id === 'free');
	const isCurrentPlan = $derived(user?.isAuthenticated && user.currentPlan === plan.id);
	const displayedPrice = $derived(billingCycleYearly ? plan.price.yearly : plan.price.monthly);
</script>

<div
	class={'group relative flex flex-col overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] ' +
		(plan.isPopular
			? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white shadow-2xl hover:shadow-emerald-500/20 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-900'
			: 'border border-slate-200/60 bg-white/80 shadow-lg backdrop-blur-sm hover:shadow-slate-500/10 dark:border-slate-700/60 dark:bg-gray-900/80')}
>
	<!-- Decorative Overlays -->
	{#if plan.isPopular}
		<div
			class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-600/10"
		></div>
	{:else}
		<div
			class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 dark:to-slate-800/50"
		></div>
	{/if}

	<!-- Main content is relative to be on top of overlays -->
	<div class="relative flex flex-grow flex-col">
		<!-- Card Header -->
		<header>
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-2xl font-bold" class:dark:text-white={!plan.isPopular}>{plan.name}</h3>
				<div
					class={'rounded-lg p-2 ' +
						(plan.isPopular ? 'bg-emerald-500/20' : 'bg-gray-100 dark:bg-gray-800')}
				>
					<Icon name={plan.iconName} size={24} class="text-slate-600 dark:text-slate-400" />
				</div>
			</div>
			<p
				class={'mb-8 ' + (plan.isPopular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400')}
			>
				{plan.description}
			</p>
		</header>

		<!-- Price Section with Smooth Transition -->
		<div class="mb-10 min-h-[100px]">
			{#key displayedPrice}
				<div in:slide={{ duration: 300, axis: 'y' }}>
					{#if isFreePlan}
						<span class="text-5xl font-black text-slate-900 dark:text-white">مجاناً</span>
						<span class="text-lg font-medium text-slate-500 dark:text-slate-400"
							>{plan.priceSuffix}</span
						>
					{:else}
						<div class="flex items-baseline gap-2">
							<span class="text-5xl font-black">${displayedPrice}</span>
							<span class="text-lg font-medium text-slate-400">{plan.priceSuffix}</span>
						</div>
						{#if billingCycleYearly}
							<div class="mt-2 flex items-center gap-2">
								<span class="text-sm text-emerald-400"
									>تُدفع سنوياً (${plan.price.yearly * 12})</span
								>
								<span
									class="rounded-md bg-emerald-500/20 px-2 py-1 text-xs font-bold text-emerald-300"
								>
									-20%
								</span>
							</div>
						{/if}
					{/if}
				</div>
			{/key}
		</div>

		<!-- Features List (flex-grow pushes footer to the bottom) -->
		<ul class="flex-grow space-y-5">
			{#each plan.features as feature}
				<li class="flex items-start">
					<div
						class={'me-3 mt-1 rounded-full p-1 ' +
							(plan.isPopular ? 'bg-emerald-400/20' : 'bg-emerald-100 dark:bg-emerald-900/30')}
					>
						<svg
							class={'h-3 w-3 ' +
								(plan.isPopular ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-400')}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg
						>
					</div>
					<span
						class={'leading-relaxed ' +
							(plan.isPopular ? '' : 'text-slate-700 dark:text-slate-300')}
					>
						{@html feature}
					</span>
				</li>
			{/each}
		</ul>

		<!-- Footer / Call to Action -->
		<footer class="mt-12">
			{#if isCurrentPlan}
				<div
					class={'flex items-center justify-center rounded-xl py-4 text-center font-bold ' +
						(isFreePlan ? '' : 'bg-emerald-600/20')}
					class:bg-gray-100={isFreePlan}
					class:dark:bg-gray-800={isFreePlan}
					class:text-slate-700={isFreePlan}
					class:dark:text-slate-300={isFreePlan}
					class:text-white={!isFreePlan}
				>
					{isFreePlan ? 'خطتك الحالية' : 'إدارة الاشتراك'}
				</div>
			{:else}
				<a
					href={user?.isAuthenticated && !isFreePlan && plan.checkout
						? billingCycleYearly
							? plan.checkout.yearly
							: plan.checkout.monthly
						: '/signup'}
					class={'group/btn block w-full rounded-xl py-4 text-center font-bold transition-all duration-300 ' +
						(isFreePlan
							? 'border-2 border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-gray-50 dark:border-slate-700 dark:bg-gray-800 dark:text-white dark:hover:border-slate-600 dark:hover:bg-gray-700'
							: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-400 hover:to-emerald-500 hover:shadow-xl')}
				>
					{#if isFreePlan}
						ابدأ مجاناً
					{:else if user?.isAuthenticated}
						الترقية الآن
					{:else}
						ابدأ النسخة المميزة
					{/if}
				</a>
			{/if}
		</footer>
	</div>
</div>

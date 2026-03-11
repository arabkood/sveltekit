<script lang="ts">
	import { i18n } from '$i18n/i18n';
	import Button from '$ui/common/Button.svelte';
	import Icon from '$ui/common/Icon.svelte';
</script>

<section class="overflow-hidden dark:bg-gray-950">
	<div
		class="relative mx-auto max-w-7xl border-x border-t border-black/10 px-6 py-24 sm:py-32 lg:px-8 dark:border-white/10"
	>
		<div class="relative z-10 mx-auto max-w-2xl text-center">
			<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
				جاهز لكتابة <span class="text-primary-500">أول سطر كود؟</span>
			</h2>

			<p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
				انضم للنسخة التجريبية وكن من أوائل المساهمين في بناء مستقبل البرمجة العربية.
			</p>

			<div class="mt-10 flex flex-col items-center justify-center gap-6">
				<!-- Modern Glowing Button -->
				<Button href="/signup" rounded variant="attention" size="lg" class="mt-6">
					{i18n.t('navigation.signup')}
				</Button>

				<!-- Trust Signals -->
				<div
					class="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-500 dark:text-gray-400"
				>
					<div class="flex items-center gap-2">
						<div
							class="dark:bg-primary-900/30 flex h-6 w-6 items-center justify-center rounded-full"
						>
							<Icon name="check" size={12} class="text-primary-600 dark:text-primary-400" />
						</div>
						<span>مجاني 100% للبدء</span>
					</div>
					<div class="flex items-center gap-2">
						<div
							class="dark:bg-primary-900/30 flex h-6 w-6 items-center justify-center rounded-full"
						>
							<Icon name="check" size={12} class="text-primary-600 dark:text-primary-400" />
						</div>
						<span>لا حاجة لبطاقة بنكية</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

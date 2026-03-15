<script>
	import Icon from '$ui/common/Icon.svelte';
	import Logo from '$ui/common/Logo.svelte';
</script>

<footer
	class="border-t border-black/10 bg-white pt-16 pb-8 sm:pt-24 dark:border-white/10 dark:bg-gray-950"
>
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="xl:grid xl:grid-cols-3 xl:gap-8">
			<!-- Brand & Social -->
			<div class="space-y-8 xl:col-span-1">
				<Logo
					variant="withText"
					size="md"
					class="transition-opacity hover:opacity-80"
					color="var(--color-emerald-600)"
				/>
				<p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
					منصة تعليم البرمجة باللغة العربية. نساعدك على تعلم البرمجة من خلال التطبيق العملي
					والتمارين التفاعلية.
				</p>
				<div class="flex gap-x-6">
					<a
						href="https://x.com/akood_com"
						target="_blank"
						class="text-gray-400 transition-colors hover:text-emerald-500 dark:text-gray-500 dark:hover:text-emerald-400"
					>
						<span class="sr-only">X (Twitter)</span>
						<Icon name="twitter" size={20} />
					</a>
					<a
						href="https://www.linkedin.com/company/arabkood"
						target="_blank"
						class="text-gray-400 transition-colors hover:text-emerald-500 dark:text-gray-500 dark:hover:text-emerald-400"
					>
						<span class="sr-only">LinkedIn</span>
						<Icon name="linkedin" size={20} />
					</a>
					<a
						href="https://facebook.com/akood_com"
						target="_blank"
						class="text-gray-400 transition-colors hover:text-emerald-500 dark:text-gray-500 dark:hover:text-emerald-400"
					>
						<span class="sr-only">Facebook</span>
						<Icon name="facebook" size={20} />
					</a>
				</div>
			</div>

			<!-- Links -->
			<div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
				<div class="md:grid md:grid-cols-2 md:gap-8">
					<!-- Column 1 -->
					<div>
						<h3 class="text-sm leading-6 font-semibold text-gray-900 dark:text-gray-50">المنصة</h3>
						<ul class="mt-6 space-y-4">
							<li>
								<a
									href="/blog"
									class="text-sm leading-6 text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
									>مدونة أكود</a
								>
							</li>
							<li>
								<a
									href="/courses"
									class="text-sm leading-6 text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
									>المسارات</a
								>
							</li>
							<li>
								<a
									href="/signup"
									class="text-sm leading-6 text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
									>ابدأ مجاناً</a
								>
							</li>
						</ul>
					</div>
					<!-- Column 2 -->
					<div class="mt-10 md:mt-0">
						<h3 class="text-sm leading-6 font-semibold text-gray-900 dark:text-gray-50">الدعم</h3>
						<ul class="mt-6 space-y-4">
							<li>
								<a
									href="https://x.com/akood_com"
									class="text-sm leading-6 text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
									>تواصل معنا</a
								>
							</li>
							<!-- FIX: -->
							<!-- <li><a href="/privacy" class="text-sm leading-6 text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400">سياسة الخصوصية</a></li> -->
							<!-- <li><a href="/terms" class="text-sm leading-6 text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400">شروط الخدمة</a></li> -->
						</ul>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24 dark:border-white/10">
			<p class="text-xs leading-5 text-gray-500 dark:text-gray-400">
				&copy; {new Date().getFullYear()} أكود. جميع الحقوق محفوظة.
			</p>
		</div>
	</div>
</footer>

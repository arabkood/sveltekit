<script>
	import Icon from '$ui/common/Icon.svelte';
	import Logo from '$ui/common/Logo.svelte';
</script>

<footer class="bg-gray-900 text-white">
	<div class="container mx-auto px-6 py-12">
		<div class="grid gap-8 md:grid-cols-4">
			<!-- Brand -->
			<div class="md:col-span-2">
				<div class="mb-6 flex items-center space-x-3 space-x-reverse">
					<Logo
						variant="withText"
						size="md"
						class="transition-opacity group-hover:opacity-80"
						color="var(--color-emerald-600)"
					/>
				</div>
				<p class="mb-6 max-w-md leading-relaxed text-gray-400">
					منصة تعليم البرمجة باللغة العربية. نساعدك على تعلم البرمجة من خلال التطبيق العملي
					والتمارين التفاعلية.
				</p>
				<div class="flex gap-4">
					<a
						href="https://x.com/arabkood"
						target="_blank"
						class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-emerald-500"
					>
						<Icon name="twitter" size={20} />
					</a>
					<a
						href="https://www.linkedin.com/company/arabkood"
						target="_blank"
						class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-emerald-500"
					>
						<Icon name="linkedin" size={22} />
					</a>
					<a
						href="https://facebook.com/arabkood"
						target="_blank"
						class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-emerald-500"
					>
						<Icon name="facebook" size={20} />
					</a>
				</div>
			</div>

			<!-- Links -->
			<div>
				<h4 class="mb-4 font-bold">المنصة</h4>
				<ul class="space-y-2 text-gray-400">
					<li><a href="/courses" class="transition-colors hover:text-white">المسارات</a></li>
					<li><a href="/signup" class="transition-colors hover:text-white">ابدأ مجاناً</a></li>
				</ul>
			</div>

			<div>
				<h4 class="mb-4 font-bold">الدعم</h4>
				<ul class="space-y-2 text-gray-400">
					<li>
						<a href="https://x.com/arabkood" class="transition-colors hover:text-white"
							>تواصل معنا</a
						>
					</li>
					<li>
						<a href="/privacy" class="transition-colors hover:text-white">سياسة الخصوصية</a>
					</li>
					<li><a href="/terms" class="transition-colors hover:text-white">شروط الخدمة</a></li>
				</ul>
			</div>
		</div>

		<div class="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
			<p>&copy; {new Date().getFullYear()} أكود. جميع الحقوق محفوظة.</p>
		</div>
	</div>
</footer>

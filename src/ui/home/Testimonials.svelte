<script lang="ts">
	const testimonials = [
		{
			text: 'برنامج تحفه ربنا يباركلكم بجد، طريقة سهله وبسيطه وجميل.. وإن شاء الله ربنا يكرمني وأقدر أخلص كله وأوصل لحاجه عاليه.',
			author: 'Abood_2875'
		},
		{
			text: 'والله بداية في التعلم جيدة وممتازة، وأتوقع الكثير منكم عند إتمام الدروس.. شكراً لكم.',
			author: 'aibout001'
		},
		{
			text: 'تبارك الله عليكم منصة زوينة بزاف وعاوناتني نفهم الكود مزيان بالتطبيق ماشي غير نتفرج الله يوفقكم',
			author: 'yass_dev'
		},
		{
			text: 'يعطيكم العافيه مجهود جبار صراحه بس ياليت تكثرون التطبيق هو الي يثبت المعلومه وشكررا',
			author: 'Bilal_2600'
		}
	];
</script>

<section class="dark:bg-zinc-950">
	<div
		class="relative mx-auto max-w-7xl border-x border-t border-black/10 pt-24 sm:pt-32 dark:border-white/10"
	>
		<span class="corners-t text-zinc-400 [--corner-offset:1px]"></span>
		<!-- Header -->
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
				ماذا يقول المتعلمون الأوائل؟
			</h2>
			<p class="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
				آراء من انضموا للنسخة التجريبية وساهموا في بناء أكوود.
			</p>
		</div>

		<!-- Testimonials Grid (Loop) -->
		<div
			class="mx-auto mt-20 grid max-w-2xl grid-cols-1 border-t border-l border-black/10 lg:mx-0 lg:max-w-none lg:grid-cols-2 dark:border-white/10"
		>
			{#each testimonials as { text, author }}
				<div
					class="relative flex flex-col border-r border-b border-black/10 px-6 py-8 text-center lg:text-right dark:border-white/10"
				>
					<span class="corners-t text-zinc-400 [--corner-offset-y:1px] [--corner-offset:1px]"
					></span>
					<span class="corners-b text-zinc-400 [--corner-offset-y:1px] [--corner-offset:1px]"
					></span>

					<blockquote class="flex-auto text-lg/loose text-zinc-600 dark:text-zinc-300">
						<p>"{text}"</p>
					</blockquote>
					<span class="mt-6 text-sm font-medium text-zinc-400 dark:text-zinc-500">
						&mdash; {author}
					</span>
				</div>
			{/each}
		</div>
	</div>
</section>

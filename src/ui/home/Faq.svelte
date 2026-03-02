<script lang="ts">
	import Icon from '$ui/common/Icon.svelte';

	const faqs = [
		{
			question: 'هل أحتاج إلى أي خبرة برمجية سابقة؟',
			answer:
				'إطلاقاً! مساراتنا مصممة لتبدأ معك من الصفر. كل ما تحتاجه هو حاسوب، اتصال بالإنترنت، ورغبة حقيقية في التعلم.'
		},
		{
			question: 'ما الذي يجعل أكود مختلفة عن مشاهدة الفيديوهات؟',
			answer:
				'في أكود، أنت لا تشاهد فقط، بل تطبق. التعلم التفاعلي بكتابة الكود وحل التحديات يرسخ المعلومة بشكل أعمق ويمنحك ثقة حقيقية بمهاراتك.'
		},
		{
			question: 'هل الخطة المجانية كافية للبدء؟',
			answer:
				'بالتأكيد. الخطة المجانية تمنحك وصولاً لوحدات تمهيدية أساسية ومسار "كيف يعمل الإنترنت" بالكامل، وهي طريقة ممتازة لتجربة منصتنا والبدء في رحلتك البرمجية.'
		}
	];
</script>

<section class="dark:bg-zinc-950">
	<div
		class=" mx-auto max-w-7xl border-x border-black/10 px-6 py-24 sm:py-32 lg:px-8 dark:border-white/10"
	>
		<!-- Header -->
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
				الأسئلة الشائعة
			</h2>
			<p class="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
				هل لديك سؤال؟ لقد قمنا بالإجابة على أكثر الاستفسارات شيوعاً.
			</p>
		</div>

		<!-- FAQs -->
		<div class="mx-auto mt-20 max-w-3xl space-y-4">
			{#each faqs as faq, i}
				<details
					class="group rounded-3xl bg-zinc-50 p-6 dark:bg-zinc-800/20 [&_summary::-webkit-details-marker]:hidden"
					open={i === 0}
				>
					<summary
						class="flex cursor-pointer items-center justify-between gap-4 text-zinc-900 dark:text-zinc-50"
					>
						<h3 class="text-lg font-medium">{faq.question}</h3>
						<span class="relative h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400">
							<Icon
								name="plus"
								class="absolute inset-0 opacity-100 transition-opacity duration-200 group-open:opacity-0"
								size={20}
							/>
							<Icon
								name="minus"
								class="absolute inset-0 opacity-0 transition-opacity duration-200 group-open:opacity-100"
								size={20}
							/>
						</span>
					</summary>
					<p class="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
						{faq.answer}
					</p>
				</details>
			{/each}
		</div>
	</div>
</section>

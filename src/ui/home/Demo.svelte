<script lang="ts">
	import Video from '$ui/common/Video.svelte';
</script>

<section class=" bg-white dark:bg-zinc-950" id="features">
	<div
		class="relative mx-auto max-w-7xl border-x border-b border-black/10 px-6 py-12 lg:py-16 dark:border-white/10"
	>
		<span class="corners-t text-zinc-400 [--corner-offset:1px]"></span>
		<span class="corners-b text-zinc-400 [--corner-offset:1px]"></span>

		<div class="relative z-10 mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold text-zinc-900 lg:text-4xl dark:text-zinc-100">
				طوّر مهاراتك البرمجية عبر تحديات تفاعلية ممتعة.
			</h2>
			<p class="mx-auto max-w-2xl text-lg text-zinc-600 lg:text-xl dark:text-zinc-300">
				تدرّب، اختبر نفسك، وطوّر مستواك خطوة بخطوة للمبتدئين والمتقدمين.
			</p>
		</div>
		<div class="mx-auto max-w-6xl">
			<div class="relative bg-zinc-100 p-4 dark:bg-zinc-800">
				<span class="corners-t text-zinc-400 [--corner-offset:1px]"></span>
				<span class="corners-b text-zinc-400 [--corner-offset:1px]"></span>
				<Video
					width="1272px"
					height="855px"
					src="/video/akood-demo.mp4"
					poster="/video/akood-demo.png"
					class="w-full"
				/>
			</div>
		</div>
	</div>
</section>

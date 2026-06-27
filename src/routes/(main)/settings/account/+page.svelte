<script lang="ts">
	import type { LayoutServerData } from '../../$types';
	import ChangePassword from './ChangePassword.svelte';
	import ChangeAccount from './ChangeAccount.svelte';

	let { data, form }: { data: LayoutServerData, form: any } = $props();
</script>

<div class="flex flex-1 flex-col gap-4">
	<ChangeAccount user={data.user!} form={form} />
	<ChangePassword form={form} />
</div>

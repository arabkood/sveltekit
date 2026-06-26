<script lang="ts">
	import { API_ENDPOINTS } from '$api/config';
	import { browser } from '$app/environment';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if (browser) {
			setTimeout(() => {
				window.posthog?.reset();
			}, 100);
		}
	});

	async function handleSignOut() {
		try {
			const signoutResponse = await fetch('/api/v1/auth/signout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});

			if (signoutResponse.ok) {
				await invalidateAll();
				await goto('/');
			} else {
				console.error('Sign-out failed');
				alert('There was a problem signing out.');
			}
		} catch (error) {
			console.error('Error during sign-out:', error);
			alert('An error occurred. Please try again.');
		}
	}

	onMount(handleSignOut);
</script>

Bye 👋

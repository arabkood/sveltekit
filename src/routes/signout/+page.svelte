<script lang="ts">
	import { API_ENDPOINTS } from '$api/config';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	async function handleSignOut() {
		try {
			const [signoutResponse, logResponse] = await Promise.all([
				fetch(API_ENDPOINTS.auth.signout, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				}),
				fetch('/signout', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				})
			]);

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

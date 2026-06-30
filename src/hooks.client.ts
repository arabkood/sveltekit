import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = async ({ error, event, status, message }) => {
	// Send to PostHog if initialized
	if (typeof window !== 'undefined' && window.posthog) {
		window.posthog.capture('$exception', {
			$exception_message: (error as Error)?.message || String(error),
			$exception_type: (error as Error)?.name || 'Error',
			$exception_stack_trace_raw: (error as Error)?.stack,
			status,
			url: event.url.href
		});
	}
	
	// Let SvelteKit do its default console logging
	console.error(error);
};

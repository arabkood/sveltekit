import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { APP_ENV } from '$config';

export const load = async () => {
	if (browser && APP_ENV === 'production') {
		window.posthog = posthog.init('phc_XzgJDy16KOk6p0vYtoRxOtetjOfhoIjgbzT50chF7RR', {
			api_host: 'https://tatabo3.akood.com',
			ui_host: 'https://eu.posthog.com',
			person_profiles: 'identified_only',
			capture_pageview: false
		});
	}
	return {};
};

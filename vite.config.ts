import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), enhancedImages()],
	server: {
		allowedHosts: ['akood.local', 'host.docker.internal', 'dev.akood.com', 'akood.com', 'sveltekit'],
		watch: {
			usePolling: true
		}
	}
});

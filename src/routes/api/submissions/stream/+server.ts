import type { RequestHandler } from './$types';
import { nats } from '$lib/server/nats';

export const GET: RequestHandler = async ({ request, url, locals }) => {
	// 1. Authenticate user
	const user = locals.user;
	if (!user) {
		return new Response('Unauthorized', { status: 401 });
	}

	// 2. Validate parameters
	const taskId = url.searchParams.get('taskId');
	if (!taskId) {
		return new Response('Missing taskId', { status: 400 });
	}

	// 3. Create Server-Sent Events Stream
	const stream = new ReadableStream({
		async start(controller) {
			const { nc } = await nats;

			// Subscribe to the ephemeral NATS Core subject for this specific task
			const sub = nc.subscribe(`results.${taskId}`);

			// Send an initial connected event so the frontend knows we are listening
			controller.enqueue('event: connected\ndata: {"status":"connected"}\n\n');

			// Ping every 15s to keep the HTTP connection alive through proxies/load balancers
			const keepAlive = setInterval(() => {
				controller.enqueue('event: ping\ndata: {}\n\n');
			}, 15000);

			// Automatically timeout after 2 minutes (120000 ms) to prevent hanging UI
			const timeout = setTimeout(() => {
				controller.enqueue(`data: {"status":"timeout", "error":"Execution timed out or dropped"}\n\n`);
				cleanup();
				controller.close();
			}, 120000);

			// Helper function to safely clean up resources
			const cleanup = () => {
				clearTimeout(timeout);
				clearInterval(keepAlive);
				if (!sub.isClosed()) {
					sub.unsubscribe();
				}
			};

			// Asynchronously process incoming NATS messages
			(async () => {
				for await (const m of sub) {
					const strData = new TextDecoder().decode(m.data);
					
					// Push the result to the browser
					controller.enqueue(`data: ${strData}\n\n`);

					try {
						const parsed = JSON.parse(strData);
						// If we receive a terminal state, we can safely close the connection
						if (parsed.status === 'pass' || parsed.status === 'fail' || parsed.status === 'internal' || parsed.status === 'timeout') {
							cleanup();
							controller.close();
							break;
						}
					} catch (e) {
						// Ignore parse errors, just keep streaming what we get
					}
				}
			})().catch(console.error);

			// Clean up when the user navigates away or closes the browser tab
			request.signal.addEventListener('abort', cleanup);
		},
		cancel() {
			// This is also called if the readable stream is cancelled by the consumer
		}
	});

	// 4. Return the stream with SSE headers
	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		}
	});
};

import { i18n } from '$i18n/i18n';

export class RateLimitError extends Error {
	public retryAfter: number;
	constructor(message: string, retryAfter: number) {
		super(message);
		this.retryAfter = retryAfter;
		this.name = 'RateLimitError';
	}
}

export class SubmissionService {
	constructor() {}

	async runCode(itemId: string, files: any, inputs: string[]): Promise<any> {
		const response = await fetch('/api/submissions/run', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				itemId,
				files,
				inputs: inputs.join('\n')
			}),
			credentials: 'include'
		});

		if (!response.ok) {
			const error = await response.json();
			if (response.status === 429 && error.retryAfter) {
				throw new RateLimitError(i18n.error(error.error) || i18n.error('TOO_FAST'), error.retryAfter);
			}
			throw new Error(i18n.error(error.error) || i18n.error('FAILED_RUN'));
		}

		const { task_id } = await response.json();
		return this.listenToStream(task_id);
	}

	async submitTests(itemId: string, files: any): Promise<any> {
		const response = await fetch('/api/submissions/test', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				itemId,
				files
			}),
			credentials: 'include'
		});

		if (!response.ok) {
			const error = await response.json();
			if (response.status === 429 && error.retryAfter) {
				throw new RateLimitError(i18n.error(error.error) || i18n.error('TOO_FAST'), error.retryAfter);
			}
			throw new Error(i18n.error(error.error) || i18n.error('FAILED_SUBMIT'));
		}

		const { submission } = await response.json();
		return this.listenToStream(submission.id);
	}

	private listenToStream(taskId: string): Promise<any> {
		return new Promise((resolve, reject) => {
			const eventSource = new EventSource(`/api/submissions/stream?taskId=${taskId}`);

			eventSource.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);

					// Ignore connection status pings
					if (data.status === 'connected') return;

					// Terminal states
					if (data.status === 'pass' || data.status === 'fail' || data.status === 'internal') {
						eventSource.close();
						resolve(data);
					} else if (data.status === 'timeout' || data.status === 'error') {
						eventSource.close();
						// Attempt to translate the backend error code, otherwise fallback to generic timeout
						reject(new Error(data.error ? (i18n.error(data.error) || data.error) : i18n.error('EXECUTION_TIMEOUT')));
					}
				} catch (e) {
					// Ignore parse errors, keep listening
				}
			};

			eventSource.onerror = (error) => {
				eventSource.close();
				reject(new Error(i18n.error('STREAM_LOST')));
			};
		});
	}
}

export const submissionService = new SubmissionService();

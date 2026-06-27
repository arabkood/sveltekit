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
			throw new Error(i18n.error(error.error) || 'Failed to run code');
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
			throw new Error(i18n.error(error.error) || 'Failed to submit solution');
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
					}
				} catch (e) {
					// Ignore parse errors, keep listening
				}
			};

			eventSource.onerror = (error) => {
				eventSource.close();
				reject(new Error('Connection to execution stream lost'));
			};
		});
	}
}

export const submissionService = new SubmissionService();

import { API_ENDPOINTS } from '$api/config';
import { i18n } from '$i18n/i18n';

export class SubmissionService {
  private readonly POLLING_CONFIG = {
    initialDelay: 1000,
    backoffFactor: 1.5,
    maxDelay: 4000,
    maxAttempts: 20
  };

  constructor() { }

  async runCode(itemId: string, files: any, inputs: string[]): Promise<any> {
    const response = await fetch(API_ENDPOINTS.item.run(itemId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: { files },
        inputs: inputs.join('\n'),
        mode: 'run'
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(i18n.error(error.error) || 'Failed to run code');
    }

    const res = await response.json();
    return this.pollForRunResult(res.task_id);
  }

  async submitTests(itemId: string, files: any): Promise<any> {
    const response = await fetch(API_ENDPOINTS.item.submit(itemId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: { files },
        mode: 'test'
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(i18n.error(error.error) || 'Failed to submit solution');
    }

    const { submission } = await response.json();
    return this.pollForTestResult(submission.id);
  }

  private async pollForRunResult(taskId: string, attempt = 0): Promise<any> {
    if (attempt >= this.POLLING_CONFIG.maxAttempts) {
      throw new Error('Execution timed out');
    }

    await this.delay(attempt);

    const response = await fetch(API_ENDPOINTS.item.get_run(taskId));
    if (!response.ok) {
      // throw new Error('Could not fetch execution status');
    }

    const res = await response.json();

    if (res.status === 'pending' || res.status === 'running') {
      return this.pollForRunResult(taskId, attempt + 1);
    }

    return res;
  }

  private async pollForTestResult(submissionId: string, attempt = 0): Promise<any> {
    if (attempt >= this.POLLING_CONFIG.maxAttempts) {
      throw new Error('Submission timed out');
    }

    await this.delay(attempt);

    const response = await fetch(`/server/submission?id=${submissionId}`);
    if (!response.ok) {
      throw new Error('Could not fetch submission status');
    }

    const { submission } = await response.json();

    if (submission.status === 'pending') {
      return this.pollForTestResult(submissionId, attempt + 1);
    }

    return submission;
  }

  private delay(attempt: number): Promise<void> {
    const ms = Math.min(
      this.POLLING_CONFIG.initialDelay * Math.pow(this.POLLING_CONFIG.backoffFactor, attempt),
      this.POLLING_CONFIG.maxDelay
    );
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const submissionService = new SubmissionService();

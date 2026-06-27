import { nats } from '$lib/server/nats';
import { RetentionPolicy, StorageType } from '@nats-io/jetstream';

export interface CodeExecutionPayload {
	task_id: string; // UUID of the submission
	user_id: string; // UUID of the user
	user_files: Record<string, string>; // Only what the user submitted
	s3_base_path: string; // Tell the Invoker where to download the tests and config
	metadata?: Record<string, string>;
	is_run_only: boolean;
	inputs?: string; // Stdin for run mode
}

export class QueueService {
	/**
	 * Provisions the JetStream queues automatically on app startup.
	 */
	static async initQueue() {
		const { jsm } = await nats;
		
		const config = {
			name: 'CODE_EXECUTIONS',
			subjects: ['code.execute.>'],
			retention: RetentionPolicy.Workqueue,
			storage: StorageType.File,
			max_age: 1000 * 60 * 5 // 5 minutes max
		};

		try {
			await jsm.streams.info(config.name);
			await jsm.streams.update(config.name, config);
			console.log(`[Queue] Stream ${config.name} updated.`);
		} catch (err: any) {
			if (err.message === 'stream not found' || err.code === '404') {
				await jsm.streams.add(config);
				console.log(`[Queue] Stream ${config.name} created.`);
			} else {
				console.warn(`[Queue] Failed to provision stream: ${err.message}`);
			}
		}
	}

	/**
	 * Enqueues a code execution job into NATS JetStream.
	 *
	 * @param payload The execution details
	 * @param priority Whether to put it in the vip queue or default
	 */
	static async enqueueCodeExecution(
		payload: CodeExecutionPayload,
		priority: 'default' | 'vip' = 'default'
	) {
		const { js } = await nats;

		// Convert payload to JSON string, then to a Buffer/Uint8Array for NATS
		const data = new TextEncoder().encode(JSON.stringify(payload));

		// Subject routing based on priority
		const subject = `code.execute.${priority}`;

		// Publish to JetStream.
		// Await ensures we receive the PubAck (JetStream confirmed the message is saved to disk)
		const ack = await js.publish(subject, data, {
			// Provide the task_id as the NATS msgID for deduplication
			msgID: payload.task_id
		});

		return ack;
	}
}

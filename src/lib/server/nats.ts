import { connect, type NatsConnection } from '@nats-io/transport-node';
import { jetstream, jetstreamManager, type JetStreamClient, type JetStreamManager } from '@nats-io/jetstream';
import { privateEnv } from './env';
import { dev } from '$app/environment';

// Use globalThis to avoid multiple connections in development mode
const globalForNats = globalThis as unknown as {
	natsPromise: Promise<{ nc: NatsConnection; js: JetStreamClient; jsm: JetStreamManager }>;
};

async function initNats() {
	const opts: Parameters<typeof connect>[0] = {
		servers: privateEnv.NATS_URL
	};

	if (privateEnv.NATS_USER && privateEnv.NATS_PASSWORD) {
		opts.user = privateEnv.NATS_USER;
		opts.pass = privateEnv.NATS_PASSWORD;
	}

	const nc = await connect(opts);
	const js = jetstream(nc);
	const jsm = await jetstreamManager(nc);

	return { nc, js, jsm };
}

// Export a singleton promise that resolves to the NATS clients
export const nats = globalForNats.natsPromise || initNats();

if (dev) {
	globalForNats.natsPromise = nats;
}


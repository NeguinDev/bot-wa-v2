import makeWASocket, {
	DisconnectReason,
	ConnectionState,
	WASocket,
	makeCacheableSignalKeyStore,
	useMultiFileAuthState
} from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import NodeCache from 'node-cache';

const logger = pino({ level: 'silent' });
const msgRetryCounterCache = new NodeCache();

export default async function whatsappConnection(callback: Function) {
	const { state, saveCreds } = await useMultiFileAuthState('auth');

	const client: WASocket = makeWASocket({
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, logger),
		},
		printQRInTerminal: true,
		logger,
		syncFullHistory: true,
		generateHighQualityLinkPreview: true,
		msgRetryCounterCache
	});

	client.ev.on('creds.update', saveCreds);
	client.ev.on('connection.update', (data) => onConnection(client, data, callback));
}

function onConnection(client: WASocket, { connection, lastDisconnect }: Partial<ConnectionState>, callback: Function) {
	if (connection === 'open') {
		console.log('WA-Connection: Connected success!');
		callback(client)
	}

	if (connection === 'close') {
		console.log('WA-Connection: Restarting');
		verifyAndReconnect(lastDisconnect, callback);
	}
}

function verifyAndReconnect(lastDisconnect: any, callback: Function) {
	const statusCode = lastDisconnect?.error?.output?.statusCode;

	if (statusCode === DisconnectReason.loggedOut) {
		console.log('WA-Connection: Logged out');

		fs.rmdirSync('auth', { recursive: true });
		return whatsappConnection(callback);
	}

	return whatsappConnection(callback);
}
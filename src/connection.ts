import makeWASocket, {
	DisconnectReason,
	ConnectionState,
	useMultiFileAuthState,
	WASocket,
} from "@adiwajshing/baileys";
import pino from 'pino';
import fs from 'fs';

export default async function whatsappConnection(callback: Function) {
	const { state, saveCreds } = await useMultiFileAuthState('auth');

	const client: WASocket = makeWASocket({
		auth: state,
		printQRInTerminal: true,
		logger: pino({ level: 'silent' })
	});

	client.ev.on('creds.update', saveCreds);
	client.ev.on('connection.update', (data) => onConnection(client, data, callback));
}

function onConnection(client: WASocket, { connection, lastDisconnect }: Partial<ConnectionState>, callback: Function) {
	if (connection === 'close') {
		verifyAndReconnect(lastDisconnect, callback);
	}

	if (connection === 'open') {
		console.log('WA-Connection: Connected success!');
		callback(client)
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
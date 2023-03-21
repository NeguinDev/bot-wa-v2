import 'dotenv/config';
import '@utils/fixed-bugs';
import whatsappConnection from './connection';
import { loadEvents } from '@events';
import { WASocket } from '@adiwajshing/baileys';
import { getDB } from '@utils/db';

const owner = getDB().owners[0] + '@s.whatsapp.net';

whatsappConnection((client: WASocket) => {
	client.sendMessage(owner, { text: 'To Online!' });
	
	loadEvents(client);
});
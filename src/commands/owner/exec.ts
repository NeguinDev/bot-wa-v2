import { WASocket } from '@adiwajshing/baileys';
import { ParsedMessage } from '@events/messages.upsert';
import { exec } from 'child_process';

export const alias = ['exec'];
export const category = ['owner'];

export async function run(client: WASocket, message: ParsedMessage) {
	if (!message.arg) {
		return client.sendMessage(message.chatId, { text: `Use: /${message.command} [COMANDO]` }, { quoted: message.pure })
	}

	exec(message.arg, async(error, stdout, stderr) => {
		await client.sendMessage(message.chatId, { text: stdout }, { quoted: message.pure });
	});
}
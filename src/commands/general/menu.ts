import { WASocket } from '@adiwajshing/baileys';
import { ParsedMessage } from '@events/messages.upsert';
import { commands } from '@utils/command';

export const alias = ['menu'];
export const category = ['general'];

export async function run(client: WASocket, message: ParsedMessage) {
	const strCmds = commands
		.map((cmd) => cmd.alias[0]);

	const text = '*🖥️ Comandos*\n\n' +
		`- /${strCmds.join('\n- /')}`;

	await client.sendMessage(message.chatId, { text }, { quoted: message.pure });
}
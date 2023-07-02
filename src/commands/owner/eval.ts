import { WASocket } from '@whiskeysockets/baileys';
import { ParsedMessage } from '@events/messages.upsert';

export const alias = ['eval'];
export const category = ['owner'];

export async function run(client: WASocket, message: ParsedMessage) {
	if (!message.arg) {
		return await message.reply(`Use: /${message.command} [CODIGO]`);
	}

	const code = `(async()=>{
		try {
			${message.arg}
		} catch(error) {
			await message.reply(error.message);
		}
	})()`;

	try {
		eval(code);
	} catch (error: any) {
		await message.reply(error.message);
	}
}
import { WASocket } from '@whiskeysockets/baileys';
import { ParsedMessage } from '@events/messages.upsert';
import { Pitboss } from 'pitboss-ng';

export const alias = ['eval2'];
export const category = ['general'];

export async function run(client: WASocket, message: ParsedMessage) {
	if (!message.arg) {
		return await message.reply(`Use: /${message.command} [CODIGO]`);
	}

	const sandbox = new Pitboss(message.arg, { timeout: 1000, memoryLimit: 10 * 1024 });

	sandbox.run({
		context: {
			message
		},
		libraries: {
			'console': 'console'
		}
	}, async (err, result) => {
		sandbox.kill();

		if (err) {
			return await message.reply(err);
		}

		await message.reply(String(result));
	});
}
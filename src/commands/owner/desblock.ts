import { WASocket } from "@adiwajshing/baileys";
import { ParsedMessage } from "@events/messages.upsert";
import { getDB, updateDB } from "@utils/db";

export const alias = ['desblock'];
export const category = ['owner'];

export async function run(client: WASocket, message: ParsedMessage) {
	const { mentions, quotedUser, arg } = message;
	const numberArg = arg.replace(/\D/g, '') + '@s.whatsapp.net';

	const victims = mentions?.length > 0 ? mentions :
		quotedUser !== undefined ? [quotedUser] :
			arg ? [numberArg] :
				[];

	if (victims.length === 0) {
		return await message.reply(`Use: /${message.command} [MARQUE OU MENSIONE UM USUARIO]`);
	}

	for (const victim of victims) {
		const db = getDB();
		if (!db.blackList.includes(victim)) {
			const text = `*Usuário @${victim.replace(/\D/g, '')} não está na Black List!*`;
			return await client.sendMessage(message.chatId, { text, mentions: [victim] });
		}

		db.blackList.splice(db.blackList.indexOf(victim), 1);
		updateDB(db);

		const text = `*🏴 Usuário @${victim.replace(/\D/g, '')} removido com sucesso da Black List!*`;
		await client.sendMessage(message.chatId, { text, mentions: [victim] });
	}
}
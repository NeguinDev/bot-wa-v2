import { WASocket } from "@whiskeysockets/baileys";
import { ParsedMessage } from "@events/messages.upsert";
import { isOwner } from "@utils/db";

export const alias = ['add', 'adicionar'];
export const category = ['admin'];

export async function run(client: WASocket, message: ParsedMessage) {
	const { mentions, quotedUser, arg } = message;
	
	if (!message.isBotGroupAdmin) {
		return await message.reply('Não sou um administrador do Grupo!');
	}
	
	const numberArg = arg.replace(/\D/g, '') + '@s.whatsapp.net';
	const victims = mentions?.length > 0 ? mentions :
		quotedUser !== undefined ? [quotedUser] :
			arg ? [numberArg] :
				[];

	if (victims.length === 0) {
		return await message.reply(`Use: /${message.command} [MARQUE OU MENSIONE UM USUARIO]`);
	}

	for (const victim of victims) {
		if (message.groupParticipants?.includes(victim)) {
			return await message.reply('Usuário já participa do Grupo!');
		}

		await client.groupParticipantsUpdate(message.chatId, [victim], 'add');

		const text = `*✅ Usuário @${victim.replace(/\D/g, '')} adicionado com sucesso do Grupo!*`;
		await client.sendMessage(message.chatId, { text, mentions: [victim] }, { quoted: message.pure });
	}
}
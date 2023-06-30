import { WASocket } from "@whiskeysockets/baileys";
import { ParsedMessage } from "@events/messages.upsert";

export const alias = ['delete'];
export const category = ['owner'];

export async function run(client: WASocket, message: ParsedMessage) {
	if (!message.isQuoted) {
		return await message.reply('Marque uma mensagem');
	}

	await client.sendMessage(message.chatId, {
		delete: {
			fromMe: true,
			id: message.quoted.stanzaId,
			participant: message.quoted.participant,
			remoteJid: message.quoted.remoteJid
		}
	})
}
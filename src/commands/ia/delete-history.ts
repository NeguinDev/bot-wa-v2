import { WASocket } from "@adiwajshing/baileys";
import { ParsedMessage } from "@events/messages.upsert";
import { getDB, updateDB } from "@utils/db";

export const alias = ['deletarhistorico', 'delete-history', 'deletehistory'];
export const category = ['general'];

export async function run(client: WASocket, message: ParsedMessage) {
	const db = getDB();

	if (!db.messagesIa[message.fromId]) {
		return await message.reply('*Você não possui historico de mensagens da inteligencia artificial!*');
	}

	db.messagesIa[message.fromId] = [];
	await message.reply('*Historico de mensagens da inteligencia artificial deletado!*');
	updateDB(db);
}
import { WASocket } from "@adiwajshing/baileys";
import { ParsedMessage } from "@events/messages.upsert";

export const alias = ['ping'];
export const category = ['general'];

export async function run(client: WASocket, message: ParsedMessage) {
	await client.sendMessage(message.chatId, { text: 'Pong!' }, { quoted: message.pure })
}
import { WASocket } from "@whiskeysockets/baileys";
import { ParsedMessage } from "@events/messages.upsert";
import instagramGetUrl from "instagram-url-direct";

export const alias = ['insta'];
export const category = ['download'];

export async function run(client: WASocket, message: ParsedMessage) {
	if (!message.arg) {
		return client.sendMessage(message.chatId, { text: `Use: /${message.command} [LINK DO VIDEO/IMAGEM]` }, { quoted: message.pure })
	}

	try {
		const response = await instagramGetUrl(message.arg);
		const url = response?.url_list?.[0];
		if (!url) return message.reply('Não foi possivel encontrar o video')
		
		await client.sendMessage(message.chatId, {
			video: { url }
		}, { quoted: message.pure });
	} catch (err: any) {
		console.log(err.stack);
		await message.reply('Error ao fazer download do video!');
	}
}
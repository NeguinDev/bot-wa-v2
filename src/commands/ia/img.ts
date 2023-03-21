import { WASocket } from "@adiwajshing/baileys";
import { ParsedMessage } from "@events/messages.upsert";
import axios from "axios";

export const alias = ['img'];
export const category = ['download'];

export async function run(client: WASocket, message: ParsedMessage) {
	if (!message.arg) {
		return client.sendMessage(message.chatId, { text: `Use: /${message.command} [DESCRIÇÃO DA IMAGEM]` }, { quoted: message.pure })
	}

	try {
		const response = await axios.get('https://tti.photoleapapp.com/api/v1/generate?prompt=' + encodeURI(message.arg));
		const url = response?.data?.result_url;
		if (!url) return message.reply('Não foi possivel gerar imagem');
		
		await client.sendMessage(message.chatId, {
			image: { url }
		}, { quoted: message.pure });
	} catch (err: any) {
		console.log(err.stack);
		// console.log(err.response);
		await message.reply('Ocorreu um error ao gerar a imagem, tente novamente...');
	}
}
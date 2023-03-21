import { WASocket, downloadMediaMessage } from "@adiwajshing/baileys";
import { ParsedMessage } from "@events/messages.upsert";
import { imageEditor } from "@services/deepai";
import { downloadAndSaveMediaMessage } from "@utils/tools";

export const alias = ['editimg', 'edit-img'];
export const category = ['general'];

export async function run(client: WASocket, message: ParsedMessage) {
	const media = message.quotedMedia || message.media;
	const type = message.quotedType || message.type;

	if (!message.arg) return await message.reply(`Uso: /${message.command} [TEXTO]`);
	if (type !== 'imageMessage') return await message.reply('Marque ou envie uma image.');

	try {
		const path = `data/tmp/${Date.now()}.png`;
		await downloadAndSaveMediaMessage(path, { key: {}, message: { imageMessage: media } });

		const response = await imageEditor(path, message.arg);
		const url = response.data?.output_url;
		if (!url) {
			return await message.reply('Erro ao converter, tente novamente...');
		}

		await client.sendMessage(message.chatId, { image: { url } });
	} catch (error: any) {
		const messageError = error.response.data;
		console.log(messageError || error.stack);

		await message.reply('Error interno, tente novamente!');
	}
}
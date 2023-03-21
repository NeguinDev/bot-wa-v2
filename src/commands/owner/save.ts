import { WASocket } from "@adiwajshing/baileys";
import { ParsedMessage } from "@events/messages.upsert";
import { downloadAndSaveMediaMessage } from "@utils/tools";

export const alias = ['save'];
export const category = ['owner'];

export async function run(client: WASocket, message: ParsedMessage) {
	if (!message.arg) {
		return await message.reply(`/${message.command} [NOME DO ARQUIVO]`)
	}

	const typeFound = message.quotedType || message.type;
	const mediaFound: any = {
		message: {
			[typeFound]: (message.quotedMedia || message.media)
		}
	};

	if (!mediaFound.message[typeFound]) {
		return await message.reply('Nenhuma midia encontrada.');
	}

	const path = 'data/saved/' + message.arg;
	await downloadAndSaveMediaMessage(path, mediaFound);
	await message.reply('Salvo!');
}
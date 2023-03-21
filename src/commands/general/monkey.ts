import { WASocket } from "@adiwajshing/baileys";
import { ParsedMessage } from "@events/messages.upsert";
import axios from "axios";
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

export const alias = ['monkey', 'macaco'];
export const category = ['general'];

const url = 'https://www.placemonkeys.com/500?random';

export async function run(client: WASocket, message: ParsedMessage) {
	try {
		const response = await axios.get(url, { responseType: 'stream' });

		const filePath = `data/tmp/${Date.now()}`;
		response.data.pipe(fs.createWriteStream(filePath + '.tmp'));

		const isSuccess = await toWebp(filePath);
		fs.unlinkSync(filePath + '.tmp');

		if (!isSuccess) {
			return await message.reply('Ocorreu um error ao converter!');
		}

		await client.sendMessage(message.chatId, { sticker: { url: filePath + '.webp' } });
		fs.unlinkSync(filePath + '.webp');
	} catch (error: any) {
		console.log(error.stack);

		await message.reply('Error interno, tente novamente...');
	}
}

function toWebp(filePath: string, options: string[] = []): Promise<boolean> {
	options = [
		'-vcodec',
		'libwebp',
		'-vf', "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease, fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
		...options
	];

	return new Promise((resolve, reject) => {
		ffmpeg(filePath + '.tmp')
			.output(filePath + '.webp')
			.toFormat('webp')
			.addOutputOptions(options)
			.on('error', (error) => {
				console.log(error.message);
				resolve(false)
			})
			.on('end', () => resolve(true))
			.run();
	});
}
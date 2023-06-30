import { WASocket, downloadMediaMessage, proto } from "@whiskeysockets/baileys";
import { ParsedMessage } from "@events/messages.upsert";
import { downloadAndSaveMediaMessage } from "@utils/tools";
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

export const alias = ['s', 'sticker'];
export const category = ['general'];

export async function run(client: WASocket, message: ParsedMessage) {
	const media: any = message.quotedMedia || message.media;

	if (!media) return await message.reply('Marque ou envie uma imagem ou um video.');
	if (media?.seconds > 10) return await message.reply('O video/gif nao pode ser maior de 10 segundos!');

	const typeFound = message.quotedType || message.type;
	const messageContent: any = {
		key: {},
		message: {
			[typeFound]: media
		}
	};

	if (typeFound === 'stickerMessage') {
		const buffer: any = await downloadMediaMessage(messageContent, 'buffer', {});
		
		if (media?.isAnimated) {
			return await client.sendMessage(message.chatId, { video: buffer });
		} else {
			return await client.sendMessage(message.chatId, { image: buffer });
		}
	}

	const fileName = 'data/tmp/' + new Date().getTime();
	await downloadAndSaveMediaMessage(fileName + '.tmp', messageContent);

	const isSuccess = await toWebp(fileName);
	fs.unlinkSync(fileName + '.tmp');
	if (!isSuccess) {
		return await message.reply('Erro ao converter, tente novamente...');
	}

	await client.sendMessage(
		message.chatId,
		{
			sticker: { url: fileName + '.webp' },
			mimetype: 'image/webp'
		},
		{ quoted: message.pure }
	);

	fs.unlinkSync(fileName + '.webp');
}

function toWebp(fileName: string, options: string[] = []): Promise<boolean> {
	options = [
		'-vcodec',
		'libwebp',
		'-vf', "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease, fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
		...options
	];

	return new Promise((resolve, reject) => {
		ffmpeg(fileName + '.tmp')
			.output(fileName + '.webp')
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
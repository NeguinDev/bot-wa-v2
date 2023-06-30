import { WASocket, downloadMediaMessage } from "@whiskeysockets/baileys";
import { ParsedMessage } from "@events/messages.upsert";
import { uploadFile } from "@services/firebase";

export const alias = ['upload'];
export const category = ['general'];

const extensionsMimetype: Record<string, string> = {
	'': '',
	'application/pdf': 'pdf',
	'image/jpeg': 'jpeg',
	'image/png': 'png',
	'image/gif': 'gif',
	'image/svg+xml': 'svg',
	'text/plain': 'txt',
	'text/html': 'html',
	'text/css': 'css',
	'application/msword': 'doc',
	'application/vnd.ms-excel': 'xls',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
	'application/vnd.ms-powerpoint': 'ppt',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
	'application/zip': 'zip',
	'audio/mpeg': 'mp3',
	'audio/ogg': 'ogg',
	'video/mp4': 'mp4',
	'video/webm': 'webm',
	'video/ogg': 'ogv',
	'image/webp': 'webp'
};

export async function run(client: WASocket, message: ParsedMessage) {
	const media = message.quotedMedia || message.media || message.file;
	const type = message.quotedType || message.type;

	if (!media) return await message.reply('Marque ou envie uma imagem, video ou sticker.');

	try {
		const buffer: any = await downloadMediaMessage({ key: {}, message: { [type]: media } }, 'buffer', {});
		
		const extension = extensionsMimetype[media?.mimetype || ''];
		const url = await uploadFile(buffer, String(Date.now()) + '.' + extension);
		await message.reply(`*✅ Upload concluido*\n\nURL: ${url}`);
	} catch (error: any) {
		console.log(error.stack);
		await message.reply('Ocorreu um error interno!');
	}
}
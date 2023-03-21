import { downloadMediaMessage, proto } from "@adiwajshing/baileys";
import fs from 'fs';

export async function downloadAndSaveMediaMessage(path: string, msg: proto.IWebMessageInfo) {
	const buffer: any = await downloadMediaMessage(msg, 'buffer', {});
	fs.appendFileSync(path, buffer);
	return buffer;
}
import { WASocket, generateMessageID } from "@adiwajshing/baileys";
import { ParsedMessage } from "./messages.upsert";
import { getDB } from "@utils/db";

const owner = getDB().owners[0] + '@s.whatsapp.net';

export async function onUniqueView(client: WASocket, message: ParsedMessage) {
	const viewOnce = message.content?.viewOnceMessage || message.content?.viewOnceMessageV2 || message.content?.imageMessage?.viewOnce || message.content?.videoMessage?.viewOnce;
	if (!viewOnce) return;

	if (message.content.viewOnceMessage?.message?.imageMessage) message.content = message.content.viewOnceMessage.message;
	if (message.content.viewOnceMessageV2?.message?.imageMessage) message.content = message.content.viewOnceMessageV2.message;
	if (message.content.videoMessage) message.content.videoMessage.viewOnce = false;
	if (message.content.imageMessage) message.content.imageMessage.viewOnce = false;

	await client.relayMessage(owner, message.content, {
		messageId: generateMessageID()
	});

	await client.sendMessage(owner, {
		text: `*Mensagem de @${message.fromId.replace(/\D/g, '')}*`,
		mentions: [message.fromId]
	}, { quoted: message.pure });
}
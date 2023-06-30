import { WASocket, generateMessageID, proto } from "@whiskeysockets/baileys";
import { ParsedMessage, parsedMessage } from "./messages.upsert";
import { getDB } from "@utils/db";

const owner = getDB().owners[0] + '@s.whatsapp.net';
const receivedMessages: Record<string, proto.IWebMessageInfo> = {};

export function checkAndSaveDeletedMessage(client: WASocket, message: ParsedMessage) {
	receivedMessages[message.msgId] = message.pure;

	if (receivedMessages[message.protocolMsgId]) {
		onMessageDelete(client, receivedMessages[message.protocolMsgId]);
	}
}

export async function onMessageDelete(client: WASocket, data: proto.IWebMessageInfo) {
	const message = await parsedMessage(client, data);

	if (!message.pure.message) return;

	await client.relayMessage(owner, message.pure.message, { messageId: generateMessageID() });
	await client.sendMessage(owner, {
		text: `*Mensagem apagada de @${message.fromId.replace(/\D/g, '')}*`,
		mentions: [message.fromId]
	}, { quoted: data });
}
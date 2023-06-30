import { FullJid, WASocket, isJidGroup, proto } from "@whiskeysockets/baileys";
import { runnerCommand } from "@utils/command";
import { checkAndSaveDeletedMessage } from "./message.delete";
import { onUniqueView } from "./message.view-once";

export default async function onMessage(client: WASocket, data: proto.IWebMessageInfo) {
	try {
		const message = await parsedMessage(client, data);

		checkAndSaveDeletedMessage(client, message);
		onUniqueView(client, message);

		if (!data.key.fromMe) {
			await runnerCommand(client, message);
		}
	} catch (err: any) {
		console.log(err.stack);
	}
}

export type ParsedMessage = {
	botJid: string;
	pure: proto.IWebMessageInfo;
	key: proto.IMessageKey;
	content: proto.IMessage;
	chatId: string;
	fromId: string;
	msgId: string;
	body: string;
	command: string;
	args: string[];
	arg: string;
	reply: (text: string) => Promise<proto.WebMessageInfo>;
	react: (emoji: string) => Promise<proto.WebMessageInfo>;
	type: string;
	media: proto.Message.IImageMessage | proto.Message.IVideoMessage | proto.Message.IStickerMessage;
	isMedia: boolean;
	file: proto.Message.IDocumentMessage;
	quoted: proto.IContextInfo;
	quotedMessage: proto.IMessage;
	quotedUser: string;
	isQuoted: boolean;
	quotedMedia: proto.Message.IImageMessage | proto.Message.IVideoMessage | proto.Message.IStickerMessage;
	isQuotedMedia: boolean;
	quotedType: string;
	quotedText: string;
	isQuotedText: boolean;
	protocol: proto.Message.ProtocolMessage;
	protocolMsgId: string;
	mentions: string[];
	admins?: string[];
	groupParticipants?: string[];
	isBotGroupAdmin?: boolean;
};

export async function parsedMessage(client: WASocket, data: proto.IWebMessageInfo): Promise<ParsedMessage> {
	try {
		const { message, key } = data;
		const parsed: any = {};

		parsed.botJid = client.user?.id.replace(/:\d+/g, '');

		parsed.pure = data;
		parsed.key = key;
		parsed.content = message;
		parsed.msgId = key.id;
		parsed.chatId = key.remoteJid;
		parsed.fromId = key.participant || key.remoteJid;
		parsed.body = message?.conversation || message?.extendedTextMessage?.text || message?.imageMessage?.caption;

		const regex = new RegExp(`^${process.env.PREFIX}(\\w+)`, 'i');
		parsed.command = parsed.body?.match(regex)?.[1];
		parsed.args = parsed.body?.split(' ')?.splice(1);
		parsed.arg = parsed.args?.join(' ');

		parsed.reply = (text: string) => client.sendMessage(parsed.chatId, { text }, { quoted: data });
		parsed.react = (emoji: string) => client.sendMessage(parsed.chatId, { react: { text: emoji, key } });

		parsed.type = Object.keys(message || {})?.[0];

		parsed.media = message?.imageMessage || message?.videoMessage || message?.stickerMessage;
		parsed.isMedia = !!parsed.media;

		parsed.file = message?.documentMessage || message?.documentWithCaptionMessage;

		parsed.quoted = message?.extendedTextMessage?.contextInfo || message?.listResponseMessage?.contextInfo?.quotedMessage?.imageMessage;
		parsed.quotedMessage = parsed.quoted?.quotedMessage;
		parsed.quotedUser = parsed.quoted?.participant;
		parsed.isQuoted = !!parsed.quoted;
		parsed.quotedMedia = parsed.quotedMessage?.imageMessage || parsed.quotedMessage?.videoMessage || parsed.quotedMessage?.stickerMessage;
		parsed.quotedType = Object.keys(parsed.quotedMessage || {})?.[0];
		parsed.isQuotedMedia = !!parsed.quotedMedia;
		parsed.quotedText = parsed.quotedMessage?.conversation || parsed.quotedMessage?.extendedTextMessage?.text;
		parsed.isQuotedText = !!parsed.quotedText;

		parsed.protocol = message?.protocolMessage;
		parsed.protocolMsgId = message?.protocolMessage?.key?.id;

		parsed.mentions = message?.extendedTextMessage?.contextInfo?.mentionedJid;

		if (isJidGroup(parsed.chatId)) {
			const groupMetadata = await client.groupMetadata(parsed.chatId);

			parsed.groupParticipants = groupMetadata.participants
				.map(({ id }) => id);
			parsed.admins = groupMetadata.participants
				.filter(({ admin }) => admin)
				.map(({ id }) => id);

			parsed.isBotGroupAdmin = parsed.admins.includes(parsed.botJid);
		}

		return parsed;
	} catch (error: any) {
		throw error;
	}
}
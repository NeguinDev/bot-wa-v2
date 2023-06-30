import { WASocket } from "@whiskeysockets/baileys";
import onMessage from "./messages.upsert";

export function loadEvents(client: WASocket) {
	client.ev.on('messages.upsert', ({ messages }) => {
		messages.forEach((message) => onMessage(client, message))
	});
}
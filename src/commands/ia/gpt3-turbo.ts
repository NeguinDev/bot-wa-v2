import { WASocket } from '@adiwajshing/baileys';
import { ParsedMessage } from '@events/messages.upsert';
import { GPT3_Turbo } from '@services/openia';

export const alias = ['ia', 'gpt', 'chatgpt'];
export const category = ['general'];

export async function run(client: WASocket, message: ParsedMessage) {
	if (!message.arg) {
		return client.sendMessage(message.chatId, { text: `Use: /${message.command} [PERGUNTA]` }, { quoted: message.pure })
	}

	try {
		const answer = await GPT3_Turbo(message.fromId, message.arg);

		await client.sendMessage(message.chatId, { text: answer }, { quoted: message.pure });
	} catch (error: any) {
		console.log(error.stack);
		await client.sendMessage(message.chatId, { text: 'Ocorreu um error interno.' }, { quoted: message.pure })
	}
}

// /ia Eu quero que você atue como um console go. Vou digitar comandos e você vai responder com o que o console go deve mostrar. Quero que você responda apenas com a saída do terminal dentro de um bloco de código exclusivo e nada mais. não escreva explicações. não digite comandos a menos que eu o instrua a fazê-lo. quando eu precisar lhe dizer algo em inglês, farei isso colocando o texto entre chaves {assim}. Meu primeiro comando é fmt.Println("hello world");
import { WASocket } from '@adiwajshing/baileys';
import { ParsedMessage } from '@events/messages.upsert';
import { openai } from '@services/openia';

export const alias = ['ia2', 'gpt2', 'chatgpt2'];
export const category = ['general'];

export async function run(client: WASocket, message: ParsedMessage) {
	if (!message.arg) {
		return message.reply(`Use: /${message.command} [PERGUNTA]`);
	}

	try {
		const response = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: message.arg,
			max_tokens: 4000,
			temperature: 0,
		});

		const answer = response.data?.choices?.[0]?.text;
		if (!answer) {
			return message.reply('Error ao gerar resposta.');
		}

		await message.reply(answer.trim());
	} catch (error: any) {
		console.log(error.stack);
		await message.reply('Ocorreu um error interno.');
	}
}
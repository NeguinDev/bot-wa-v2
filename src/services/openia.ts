import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';
import { getDB, updateDB } from '@utils/db';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);

export async function GPT3_Turbo(user: string, text: string): Promise<string> {
	try {
		const db = getDB();
		if (!db.messagesIa) db.messagesIa = {};
		if (!db.messagesIa?.[user]) db.messagesIa[user] = [];
		const messages = db.messagesIa?.[user];

		messages.push({
			"role": "user",
			"content": text
		});

		const config = {
			method: 'post',
			url: 'https://api.openai.com/v1/chat/completions',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
			},
			data: JSON.stringify({
				"model": "gpt-3.5-turbo",
				"messages": [
					{
						"role": "system",
						"content": "Seu nome é Neguin Bot!"
					},
					...messages
				]
			})
		};

		const response = await axios(config)
		const responseContent = response.data?.choices?.[0]?.message?.content;

		if (!responseContent) {
			return 'Não foi possivel gerar a resposta.'
		}

		messages.push({
			"role": "assistant",
			"content": responseContent
		});

		db.messagesIa[user] = messages;
		updateDB(db);

		return responseContent.trim();
	} catch (error: any) {
		console.log(error.stack);
		return 'Error interno, tente novamente mais tarde.';
	}
}
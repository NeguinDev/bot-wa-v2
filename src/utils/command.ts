import { WASocket, isJidGroup } from '@adiwajshing/baileys';
import fs from 'fs';
import { ParsedMessage } from '@events/messages.upsert';
import { getDB, isOwner } from './db';

type CommandType = {
	alias: string[],
	run: Function,
	category: ['owner', 'tool', 'general', 'ia', 'download', 'admin']
};

const pathFull = './src/commands';
const pathRelative = '../commands';
const commands = loadCommands();

export async function runnerCommand(client: WASocket, message: ParsedMessage) {
	const command = commands.find((value) => value.alias.includes(message.command?.toLowerCase?.()));

	if (command) {
		const { run } = command;
		const loadingCmd = new LoadingCommand(client, message);
		await loadingCmd.start();

		try {
			if (!await checkPermissionBeforeExecuteCmd(message, command)) {
				return await loadingCmd.end();
			}

			await run(client, message);
			await loadingCmd.end();
		} catch (err: any) {
			console.log(err.stack);

			await message.reply('Error interno, tente novamente!');
		}
	}
}

export function loadCommands() {
	const files = getFilesDir();
	const handle: CommandType[] = files.map((file) => require(file));

	return handle;
}

function getFilesDir(path: string = '') {
	const result = fs.readdirSync(pathFull + path, { withFileTypes: true });
	const files: string[] = [];

	result.forEach((i) => {
		if (i.isDirectory()) {
			return files.push(...getFilesDir(`${path}/${i.name}`));
		}

		files.push(`${pathRelative}${path}/${i.name}`);
	});

	return files;
}

async function checkPermissionBeforeExecuteCmd(message: ParsedMessage, { category }: CommandType) {
	const db = getDB();

	if (db.blackList.includes(message.fromId)) {
		await message.reply('*Você não pode executar comandos pois está na Black List!*');
		return false;
	}

	if (category.includes('owner') && !isOwner(message.fromId)) {
		await message.reply('*Comando permitido apenas pelo Dono!*');
		return false;
	}

	if (category.includes('admin') && isJidGroup(message.chatId) && !message.admins?.includes(message.fromId)) {
		if (isOwner(message.fromId))
			return true;
		
		await message.reply('*Comando permitido apenas por administradores de um grupo!*')
		return false;
	}

	return true;
}

class LoadingCommand {
	// private interval: NodeJS.Timer | number = 0;
	private message: ParsedMessage;
	private client: WASocket;
	private clocks = ['🕐', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕝'];
	private clockNow = 0;
	private initialTime: number;

	constructor(client: WASocket, message: ParsedMessage) {
		this.initialTime = Date.now();
		this.message = message;
		this.client = client;

		// this.interval = setInterval(() => {
		// 	this.clockNow++;
		// 	this.message.react(this.clocks[this.clockNow]);

		// 	if (this.clockNow >= this.clocks.length - 1) this.clockNow = 0;
		// }, 3000);
	}

	async start() {
		await this.client.readMessages([this.message.key]);
		await this.message.react(this.clocks[this.clockNow]);
	}

	async end() {
		const now = Date.now();
		const time = ((now - this.initialTime) / 1000).toFixed(2) + 's';

		const blue = '\x1B[34m';
		const reset = '\x1B[0m';
		const yellow = '\x1B[33m';

		console.log(`${blue}CMD:${reset} ${this.message.body} - ${yellow}${time}${reset}`);

		// clearInterval(this.interval);

		await new Promise((resolve) => setTimeout(resolve, 1000));
		await this.message.react('✅');
	}
}
import fs from 'fs';

const path = 'data/db.json';

export function getDB() {
	const data = fs.readFileSync(path, 'utf8');
	return JSON.parse(data);
}

export function updateDB(data: Object) {
	fs.writeFileSync(path, JSON.stringify(data, null, '\t'));
}

export function isOwner(fromId: string) {
	const number = fromId.replace(/\D/g, '');
	const owners = getDB().owners;

	return owners.includes(number);
}
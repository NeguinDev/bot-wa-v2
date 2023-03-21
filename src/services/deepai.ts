import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const axiosInstance = axios.create({
	headers: {
		'api-key': 'bbc589cb-dfe1-4718-af11-430b5c1d4b27'
	}
})

export function imageEditor(imagePath: string, text: string) {
	const data = new FormData();

	data.append('image', fs.createReadStream(imagePath));
	data.append('text', text);

	return axiosInstance.post('https://api.deepai.org/api/image-editor', data);
}
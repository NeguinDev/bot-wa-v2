import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyBOjiTR_oAygTImF9F8BSNP_aYabiG8ZTw",
	authDomain: "bot-wa-3111c.firebaseapp.com",
	projectId: "bot-wa-3111c",
	storageBucket: "bot-wa-3111c.appspot.com",
	messagingSenderId: "52377498542",
	appId: "1:52377498542:web:c441dee5353ba8ccd24e3f",
	measurementId: "G-VHH8GC1K4K"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadFile(buffer: Blob | Uint8Array | ArrayBuffer, name: string) {
	const reference = ref(storage, name);
	
	await uploadBytes(reference, buffer);
	const url = await getDownloadURL(reference);

	return url;
}
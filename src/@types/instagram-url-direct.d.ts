type Result = {
	results_number: number,
	url_list: string[]
}

declare module 'instagram-url-direct' {
	export default function instagramGetUrl(url: string): Promise<Result>;
}
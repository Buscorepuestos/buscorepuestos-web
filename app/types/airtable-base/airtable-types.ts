export interface AirtableAttachment {
	id: string;
	size: number;
	url: string;
	type: string;
	filename: string;
	thumbnails: {
		small: {
			url: string;
			width: number;
			height: number;
		};
		large: {
			url: string;
			width: number;
			height: number;
		};
		full?: {
			url: string;
			width: number;
			height: number;
		};
	};
}

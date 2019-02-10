
export class MagpieSearchResult {
	constructor(public result: ItemResult, public appToken: string) {}
}

export interface TokenResult {
    GenerateTokenAppsResult?: string;
}

export interface MagpieResult {
    GetValuationApps2Result?: ItemResult;
}

export interface MagpieBasketResult {
    GetBasketFullResult?: ItemResult[];
}

export interface ItemResult {
    album?:         string;
    artist?:        string;
    barcode?:       string;
    description?:   string;
    format?:        string;
    message?:       string;
    price?:         number;
    status?:        number;
	id?:            number;
	istech?:        number;
	istechdisplay?: string;
	offerprice?:    number;
	qty?:           number;
}

export interface MagpieRemoveResult {
    RemoveBasketItemResult?: number;
}

export namespace Convert {
	export function toMusicMagpieTokenResult(json: any): TokenResult {
		return json;
	}

	export function toMusicMagpieResult(json: any): MagpieResult {
		return json;
	}

	export function toMusicMagpieBasketResult(json: any): MagpieBasketResult {
		return json;
	}
	
	export function toMusicMagpieBasketRemoveResult(json: any): MagpieRemoveResult {
		return json;
	}	

	export function musicMagpieTokenResultToJson(value: TokenResult): string {
		return JSON.stringify(value);
	}

	export function musicMagpieResultToJson(value: MagpieResult): string {
		return JSON.stringify(value);
	}

	export function musicMagpieBasketResultToJson(value: MagpieBasketResult): string {
		return JSON.stringify(value);
	}
	
	export function musicMagpieBasketRemoveResultToJson(value: MagpieRemoveResult): string {
		return JSON.stringify(value);
	}
}
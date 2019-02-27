/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface IZapOfferResult {
	highOffer: number;
	vendors:   IVendorOfferData[];
}

export interface IVendorOfferData {
	success: boolean;
	vendorId: number;
	accepted: boolean;
	title: string;
	code?: string;
	offer: string;
	thumbImg: string;
	rawData:  any;
}

export class VendorOfferData implements IVendorOfferData {
	public success: boolean = true;
	public accepted: boolean = true;
	public rawData: any = null;
	public thumbImg: string = "";

	constructor(public code: string = "",
				public vendorId: number = -1,
				public title: string = "",
				public offer: string = "") {}
}


// Converts JSON strings to/from your types
export namespace ZapOfferResult {
	export function toZapRes(json: string): IZapOfferResult {
		return JSON.parse(json);
	}

	export function zapResToJson(value: IZapOfferResult): string {
		return JSON.stringify(value);
	}
}

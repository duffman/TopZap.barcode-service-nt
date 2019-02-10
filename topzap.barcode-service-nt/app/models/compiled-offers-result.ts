/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IVendorOfferResult }       from '@app/models/zap-ts-models/vendor-offer-result';
import { IVendorOfferData }         from '@app/models/zap-ts-models/zap-offer.model';
import { PNumUtils }                from '@putte/pnum-utils';

export interface ICompiledOffersResult {
	vendors: IVendorOfferData[];
	highVendorId: number;
}

export class CompiledOffersResult implements ICompiledOffersResult {
	public vendors: IVendorOfferData[];
	public highVendorId: number;
	//
	private highVendorRes: IVendorOfferResult;
	private highOffer = 0;

	constructor() {
		this.vendors = new Array<IVendorOfferData>();
	}

	/**
	 * Adds a vendor result to the final result
	 * @param {IZapVendorResult} vendor
	 * @returns {boolean}
	 */
	public addVendorResult(vendor: IVendorOfferData): boolean {
		let haveVendor: boolean = false;

		for (let i = 0; i < this.vendors.length; i++) {
			let existingVendor: IVendorOfferResult ;
			if (PNumUtils.relNumsEqual(existingVendor.vendorId, vendor.vendorId)) {
				haveVendor = true;
				break;
			}
		}

		if (!haveVendor) {
			this.vendors.push(vendor);

			let offerStr = vendor.offer;
			if (offerStr === null) {
				offerStr = "0";
			} else {
				offerStr = offerStr.replace(",", ".");
			}

			let offerNum = Number(offerStr);

			if (offerNum > this.highOffer) {
				this.highOffer = offerNum;
				this.highVendorId = vendor.vendorId; // What´s the risk of a collision??? right??
			}

			return true;
		} else {
			return false;
		}
	}
}

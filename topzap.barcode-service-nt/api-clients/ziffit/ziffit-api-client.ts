/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as request               from "request";
import { IVendorApiClient }       from '@app/VendorApiClient';
import { VendorOfferResult }      from "@app/models/zap-ts-models/vendor-offer-result";
import { Logger }                 from "@cli/logger";
import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';
import { ZiffitAppWorker }        from './ziffit-app-worker';
import { Vendors }                from '../vendor-list';

export class ZiffitAppApi implements IVendorApiClient {
	name: string = "ZiffitAppApi";
	worker: ZiffitAppWorker;

	constructor() {
		this.worker = new ZiffitAppWorker();
	}

	public getOffer(barcode: string): Promise<IVendorOfferData> {
		let scope = this;

		return new Promise((resolve, reject) => {
			let jar = request.jar();
			let zapResult = new VendorOfferResult();
			zapResult.vendorId = Vendors.ZiffitApp;

			this.worker.search(barcode).then((dataRes) => {
				console.log(`Miner '${scope.name}' Result ::`, dataRes);

				/*
				console.log(" ");
				console.log(" ");
				console.log("dataRes.product :::", dataRes.product);
				console.log(" ");
				console.log(" ");
				*/

				if (dataRes.product === undefined) {
					zapResult.rawData = new Error(dataRes.response_text);
					zapResult.offer = "-1";

				} else {
					zapResult.success = true;
					zapResult.title = dataRes.product.title;
					zapResult.offer = String(dataRes.product.offer_price).toString();
					//zapResult.thumbImg = '';
				}

				console.log("zapResult ::: DONE :::", zapResult);
				resolve(zapResult);
			})
		});
	}
}

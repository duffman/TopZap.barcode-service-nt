/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

const request = require('request');
import { IVendorApiClient }       from '@app/vendor-api-client';
//import * as request               from "request";
import { MomoxMobileWorker}       from "./momox-app-worker";
import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';
import { VendorOfferData }        from '@app/models/zap-ts-models/zap-offer.model';
import { Vendors }                from '../vendor-list';
import { Logger }                 from "@cli/logger";

export class MomoxAppApi implements IVendorApiClient {
	vendorId = Vendors.MomoxApp;
	name: string = "MomoxAppApi";
	worker: MomoxMobileWorker;

	constructor(public debugMode: boolean = false) {
		this.worker = new MomoxMobileWorker(debugMode);
	}

	public getOffer(barcode: string): Promise<IVendorOfferData> {
		let scope = this;

		return new Promise((resolve, reject) => {
			let jar = request.jar();
			let zapResult = new VendorOfferData();

			this.worker.search(barcode).then((dataRes) => {
				console.log(`Miner '${scope.name}' Result ::`, dataRes);

				zapResult.vendorId = Vendors.MomoxApp; // Number.parseInt(dataRes.id);

				if (dataRes !== undefined) {
					zapResult.success = true;
					zapResult.title = dataRes.title;
					zapResult.offer = dataRes.price;
				} else {
					zapResult.accepted = false;
				}

				resolve(zapResult);
			})
		});
	}
}

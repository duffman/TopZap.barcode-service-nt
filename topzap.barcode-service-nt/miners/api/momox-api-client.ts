/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as request               from "request";
import { IZapApiClient }          from "@core/zap-miner-api";
import { MomoxMobileWorker}       from "../momox/app/momox-app-worker";
import { IVendorOfferResult }     from "@app/models/zap-ts-models/vendor-offer-result";
import { VendorOfferResult }      from "@app/models/zap-ts-models/vendor-offer-result";
import { Logger }                 from "@cli/logger";
import { Vendors }                from "@miners/vendor-list";

export class MomoxAppApi implements IZapApiClient {
	name: string = "MomoxAppApi";
	worker: MomoxMobileWorker;

	constructor(public debugMode: boolean = false) {
		this.worker = new MomoxMobileWorker(debugMode);
	}

	public getOffer(barcode: string): Promise<VendorOfferResult> {
		let scope = this;

		return new Promise((resolve, reject) => {
			let jar = request.jar();
			let zapResult = new VendorOfferResult();

			this.worker.search(barcode).then((dataRes) => {
				console.log(`Miner '${scope.name}' Result ::`, dataRes);

				zapResult.vendorId = Vendors.MomoxApp; // Number.parseInt(dataRes.id);

				if (dataRes !== undefined) {
					zapResult.success = true;
					zapResult.title = dataRes.title;
					zapResult.offer = dataRes.price;
				}

				resolve(zapResult);
			})
		});
	}
}

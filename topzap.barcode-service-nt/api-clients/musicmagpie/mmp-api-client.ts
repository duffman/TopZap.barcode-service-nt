/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IVendorApiClient }       from '@app/vendor-api-client';
import { Logger }                 from "@cli/logger";
import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';
import { VendorOfferData }        from '@app/models/zap-ts-models/zap-offer.model';
import { MmpAppWorker }           from './mmp-app-worker';
import { Vendors }                from '../vendor-list';

export class MmpAppApi implements IVendorApiClient {
	vendorId = Vendors.MagpieApp;
	name: string = "MagpieAppApi";
	worker: MmpAppWorker;

	constructor() {
		this.worker = new MmpAppWorker();
	}

	public getOffer(barcode: string): Promise<IVendorOfferData> {
		let scope = this;

		function getBasketToken(): Promise<string> {
			return new Promise((resolve, reject) => {
				this.worker.generateToken().then(token => {
					resolve(token);
				});
			});
		}

		return new Promise((resolve, reject) => {
			let zapResult = new VendorOfferData("");

			this.worker.search(barcode).then((res) => {
				console.log(`Miner '${scope.name}' Result ::`, res);

				console.log("MMP ::: DD ::", res);

				zapResult.vendorId = Vendors.MagpieApp;  //res.GetValuationApps2Result.id;

				if (res !== null && res.GetValuationApps2Result !== null && res.GetValuationApps2Result.price > 0) {
					//zapResult.success = true;
					zapResult.title = res.GetValuationApps2Result.description;
					zapResult.offer = String(res.GetValuationApps2Result.price).toString();
				}

				resolve(zapResult);
			});
		});
	}
}

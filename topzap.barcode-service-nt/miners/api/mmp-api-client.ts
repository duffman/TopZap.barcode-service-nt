/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IZapApiClient }          from "@core/zap-miner-api";
import { MmpAppWorker }           from "@miners/musicmagpie/app/mmp-app-worker";
import { Logger }                 from "@cli/logger";
import { Vendors }                from "@miners/vendor-list";
import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';
import { VendorOfferData }        from '@app/models/zap-ts-models/zap-offer.model';

export class MmpAppApi implements IZapApiClient {
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
			let zapResult = new VendorOfferData();

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

/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IZapApiClient }          from "@core/zap-miner-api";
import { VendorOfferResult }      from "@app/models/zap-ts-models/vendor-offer-result";
import { WbgAppWorker }           from "@miners/webuygames/app/wbg-app-worker";
import { Logger }                 from "@cli/logger";
import { Vendors } 	              from "@miners/vendor-list";
import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';

export class WbgAppApi implements IZapApiClient {
	name: string = "WeBuyGamesAppApi";
	worker: WbgAppWorker;

	constructor() {
		this.worker = new WbgAppWorker();
	}

	public getOffer(barcode: string): Promise<IVendorOfferData> {
		let scope = this;
		let zapResult = new VendorOfferResult();
		zapResult.vendorId = Vendors.WeBuyGamesApp;

		let error: Error = null;

		async function getData(): Promise<void> {
			let worker = scope.worker;
			let basketSign = await worker.signin(undefined);

			console.log(`'${scope.name}' :: basketSign ::`, basketSign);

			try {
				let dataRes = await worker.search(barcode, basketSign);

				console.log(`Miner '${scope.name}' Result ::`, dataRes);

				if (dataRes.data.Item !== undefined) {
					zapResult.title = dataRes.data.Item.itemName;
					zapResult.offer = String(dataRes.data.Item.itemPrice).toString();
					zapResult.success = true;
				}

			} catch(err) {
				console.log("WbgAppApi :: ERROR ::::", err);
				zapResult.success = false;
				zapResult.rawData = err;
				error = err;
			}
		}

		return new Promise((resolve, reject) => {
			Logger.logGreen("processQueue() :: Done", zapResult);

			getData().then(() => {
				resolve(zapResult);
			})
		});
	}
}
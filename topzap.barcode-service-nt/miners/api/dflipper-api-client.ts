/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as request               from "request";
import { DiscFlipperWorker }      from "@miners/discflipper/discflipper-worker";
import {CliCommander} from "@cli/cli-commander";

export class DiscFlipperAppApi  {
	name: string = "DiscFlipperAppApi";
	worker: DiscFlipperWorker;

	constructor() {
		this.worker = new DiscFlipperWorker();
	}

	public getOffer(barcode: string): Promise<any> {
		let scope = this;
		let searchResult: any;

		async function getData(): Promise<void> {
			let worker = scope.worker;

			// Signin so you are able to add multiple items to basket
			let basketSign = await worker.signin(undefined);

			console.log("basketSign ::", basketSign);

			searchResult = await worker.search(barcode, basketSign);

			//console.log("Search Result :: ", searchResult);

			/*/ Add some items to basket
			await worker.search('0045496590444', basketSign);
			await worker.search('5390102520885', basketSign);
			await worker.search('5060102954781', basketSign);
			await worker.search('0887195000424', basketSign);
			await worker.search('5060528030373', basketSign);

			// Get basket after adding new items
			var basket = await worker.getBasket(basketSign);
			console.log(basket.data.items);

			// Remove few items
			var item = basket.data.items.find(o => o.barcode === '5060102954781');
			if(item){
				await worker.removeFromBasket(item.id, basketSign);
			}

			var item = basket.data.items.find(o => o.barcode === '0887195000424');
			if(item){
				await worker.removeFromBasket(item.id, basketSign);
			}

			// Get basket after item removal
			basket = await worker.getBasket(basketSign);
			console.log(basket.data.items);
			*/
		}


		return new Promise((resolve, reject) => {
			getData().then(() => {
				console.log("processQueue() :: Done");
				resolve(searchResult);
			})
		});
	}
}


let api = new DiscFlipperAppApi();

let barcode = "0711719812326";
api.getOffer(barcode).then((result) => {
	console.log("RES ::", result);

}).catch((res) => {
	console.log("ERR ::", res);
});

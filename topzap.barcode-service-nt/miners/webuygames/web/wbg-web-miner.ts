/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import { MinerCore }              from "@core/miner-core";
import { WbgWebWorker}            from "./wbg-web-worker";
import { Logger }                 from "@cli/logger";
import { MinerQueueData }         from "@core/miner-data-models";
import { MinerWorkItemUpdate }    from "@core/miner-data-models";
import { WeBuyGamesResult }       from "./wbg-web-data";
import { Vendors }                from "@miners/vendor-list";
import {CliCommander} from "@cli/cli-commander";

const VENDOR_ID = Vendors.WeBuyGamesWeb;

export class WbgWebMiner extends MinerCore {
	worker: WbgWebWorker;

	constructor() {
		super();
		this.worker = new WbgWebWorker();
	}

	public processQueue(dataItems: MinerQueueData[]): Promise<void> {
		let scope = this;

		function updateWorkQueueItem(updateItem: MinerWorkItemUpdate): Promise<boolean> {
			return new Promise((resolve, reject) => {
				scope.updateWorkQueueItem(updateItem).then((res) => {
					resolve(res);
				}).catch((err) => {
					reject(err);
				});
			});
		}

		function weBuyGamesSearch(dataItem: MinerQueueData): Promise<WeBuyGamesResult> {
			Logger.logGreen("Getting price for barcode from somewhere...");

			return new Promise((resolve, reject) => {
				scope.worker.search(dataItem.barcode, undefined).then((res) => {
					resolve(res);
				}).catch((err) => {
					Logger.logError("DoWork() :: Something bad happened ::", err);
					reject(err);
				});
			});
		}

		async function process(): Promise<void> {
			// This array contains the items that comes from the server
			for (let i = 0; i < dataItems.length; i++) {
				let item = dataItems[i] as MinerQueueData;
				Logger.logCyan("processQueue() :: Barcode to Process ::", item.barcode);

				// Here is the actual process for each item
				let searchResult = await weBuyGamesSearch(item);

				Logger.logGreen("searchResult ::", searchResult);

				let updateItem = new MinerWorkItemUpdate();
				updateItem.id = item.id; // IMPORTANT :: We need to set the id to the original item that was passed to us

				if (searchResult === null) {
					updateItem.accepted = false;

				} else { // this could be much prettier but you understand what I´m trying to do :)
					// there´s always hacks when dealing with these results that differ from vendor to vendor...
					updateItem.accepted = true;
					updateItem.price = searchResult.price;
					updateItem.message = searchResult.title;
				}

				// This is ok for this demo...
				let updateDataRes = await updateWorkQueueItem(updateItem); // This is the call to the server to update  the item

				Logger.logYellow("updateDataRes ::", updateDataRes);

				// SOmething like this? :)
			}
		}

		return new Promise((resolve, reject) => {
			process().then(() => {
				Logger.logGreen("processQueue() :: Done");
				resolve();
			})
		});
	}

	public execute(queueSize: number = 100): Promise<boolean> {
		let scope = this;

		return new Promise((resolve, reject) => {
			scope.getVendorQueue(VENDOR_ID, queueSize).then((data) => {
				return data;
			}).then((dataItems) => {
				scope.processQueue(dataItems).then((res) => {
					Logger.logGreen("processQueue :: done ::", res);
					resolve(true);

				}).catch((err) => {
					Logger.logError("processQueue :: error ::", err);
					reject(err);
				});
			});
		});
	}
}

if (CliCommander.debug()) {
	let miner = new WbgWebMiner();
	let args = process.argv.slice(2);
	let size = 100; // here you define how many items you want´t from the server


	Logger.logGreen("Queue Size ::", size);
	miner.execute(size);
}

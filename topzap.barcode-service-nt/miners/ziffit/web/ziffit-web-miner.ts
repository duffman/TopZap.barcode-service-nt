/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import { MinerCore }              from "@core/miner-core";
import { ZiffitWebWorker}         from "./ziffit-web-worker";
import { Logger }                 from "@cli/logger";
import { MinerQueueData }         from "@core/miner-data-models";
import { MinerWorkItemUpdate }    from "@core/miner-data-models";
import { ZiffitResult }           from "./ziffit-web-data";
import { Vendors }                from "@miners/vendor-list";

const VENDOR_ID = Vendors.ZiffitWeb;

export class ZiffitWebMiner extends MinerCore {
	worker: ZiffitWebWorker;

	constructor() {
		super();
		this.worker = new ZiffitWebWorker();
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

		function ziffitSearch(dataItem: MinerQueueData): Promise<ZiffitResult> {
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
				let searchResult = await ziffitSearch(item);

				Logger.logGreen("searchResult ::", searchResult);

				let updateItem = new MinerWorkItemUpdate();
				updateItem.id = item.id; // IMPORTANT :: We need to set the id to the original item that was passed to us

				if (searchResult === null || searchResult === undefined || !searchResult.accepted) {
					updateItem.accepted = false;

				} else { // this could be much prettier but you understand what I´m trying to do :)
					// there´s always hacks when dealing with these results that differ from vendor to vendor...
					updateItem.accepted = true;
					updateItem.price = searchResult.offerPrice; // Risky business here, ok for now...
					updateItem.message = searchResult.description;
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

let args = process.argv.slice(2);
if (args.length > 0) {
	let miner = new ZiffitWebMiner();
	let size = 10; // here you define how many items you want´t from the server

	Logger.logGreen("Queue Size ::", size);
	miner.execute(size);
}

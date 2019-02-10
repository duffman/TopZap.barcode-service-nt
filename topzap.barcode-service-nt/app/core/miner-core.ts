/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { PHttpClient }              from "@utils/../../lib/putte/inet/phttp-client";
import { Logger }                 from "@cli/logger";
import { MinerDataConvert }       from "@core/miner-data-models";
import { MinerQueueData }         from "@core/miner-data-models";
import { MinerWorkItemUpdate }    from "@core/miner-data-models";
import { MinerSessionData}        from "@core/miner-data-models";
import { MinerRequest }           from "@core/miner-request";
import { Settings }               from "@app/settings";

const apiUri                     = Settings.Endpoints.API_SERVER_URI;
const minerApiUri                = `${apiUri}/miner`;
const minerSessionUri            = `${minerApiUri}/session/`;
const minerQueueUri              = `${minerApiUri}/queue/`;
const minerUpdateUri             = `${minerApiUri}/update/`;

export class MinerCore {
	session: MinerSessionData;
	req: MinerRequest;

	constructor() {
		this.session = null;
		this.req = new MinerRequest();
	}

	/**
	 * Retrieves miner session info from given vendor id
	 * @param {number} vendorId
	 * @returns {Promise<any>}
	 */
	protected getSession(vendorId: number): Promise<MinerSessionData> {
		return new Promise((resolve, reject) => {
			let reqUrl = minerSessionUri + vendorId;
			PHttpClient.getHttp(reqUrl).then((res) => {
				let model = MinerDataConvert.toMinerSessionData(res);
				Logger.logGreen("getSession :: success ::", res);
				resolve(model);

			}).catch((err) => {
				Logger.logGreen("getSession :: error ::", err);
				reject(err);
			});
		});
	}

	/**
	 * Retrieve work queue items by given session id
	 * @param {number} sessionId
	 * @returns {Promise<void>}
	 */
	protected getWorkQueueItems(sessionId: number, queueSize: number = 10): Promise<Array<MinerQueueData>> {
		return new Promise((resolve, reject) => {
			let reqUrl = `${minerQueueUri}${sessionId}/${queueSize}`;

			PHttpClient.getHttp(reqUrl).then((res) => {
				let model = MinerDataConvert.toMinerQueueData(res);
				resolve(model);

			}).catch((err) => {
				Logger.logGreen("getWorkQueueItems :: error ::", err);
				reject(err);
			});
		});
	}

	protected updateWorkQueueItem(updateItem: MinerWorkItemUpdate): Promise<boolean> {
		let scope = this;

		return new Promise((resolve, reject) => {
			scope.req.postRequest(minerUpdateUri, updateItem).then((res) => {
				Logger.logGreen("updateWorkQueueItem :: success ::", res);
				resolve(true);
			}).catch((err) => {
				Logger.logError("updateWorkQueueItem :: error ::", err);
				reject(err);
			});
		});
	}

	/**
	 * Retrieves Work Queue by first getting the
	 * miner session by given vendor id
	 * @param {number} vendorId
	 * @returns {Promise<MinerQueueData>}
	 */
	protected getVendorQueue(vendorId: number, queueSize: number = 10): Promise<Array<MinerQueueData>> {
		return new Promise((resolve, reject) => {
			this.getSession(vendorId).then((res) => {
				Logger.logGreen("execute :: success", res);

				this.session = res;

				this.getWorkQueueItems(res.id, queueSize).then((data) => {
					resolve(data);
				});

			}).catch((err) => {
				Logger.logError("execute :: error ::", err);
				reject(err);
			});
		});
	}
}
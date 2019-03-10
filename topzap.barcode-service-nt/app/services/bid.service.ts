/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';
import { IVendorApiClient }       from '@app/vendor-api-client';
import { PStrUtils }              from '@putte/pstr-utils';
import { ZapMessageType}          from '@app/models/zap-ts-models/messages/zap-message-types';
import { Logger }                 from '@cli/logger';
import { BidCacheDb }             from '@app/database/bid-cache-db';
import { DroneServer }            from "@app/zapdrone/drone-server";
import { DroneClient }            from "@app/zapdrone/drone-client";
import { IDroneMessage }          from "@app/zapdrone/drone-message";
import { DroneMessage }           from "@app/zapdrone/drone-message";
import { DroneChannels }          from "@app/zapdrone/drone-channels";
import { DroneEvent }             from "@app/zapdrone/drone-event";

export interface IBidService {
	callVendorService(code: string): Promise<IVendorOfferData>;
}

const TEST_MODE = true;

export class BidService implements IBidService {
	bidCacheDb: BidCacheDb;
	drone: any;
	channel: any;

	droneServer: DroneServer;
	droneClient: DroneClient;

//	serviceDrone: any;
//	bidsChannel: IChannel;

	constructor (public apiClient: IVendorApiClient) {
		this.bidCacheDb = new BidCacheDb();

		this.droneClient = new DroneClient();
		this.droneServer = new DroneServer();

		this.droneClient.onGetBid((data) => {
			console.log("Channel :: DATA ::", data);
			this.onGetBidRequest(data);
		});
	}

	private formatOffer (input: string): number {
		let res = -1;

		try {
			let resStr = input.trim().replace(",", ".");
			res = parseFloat(resStr);

		} catch (err) {
			console.log("formatOffer :: ERROR ::", err);
			res = -1;
		}

		return res;
	}

	public onGetBidRequest (message: any): void {
		console.log("ON NEW BID ---->");
		let channelMess = message as IDroneMessage;

		let code: string = "";
		let sessId: string = "";

		try {
			code = channelMess.data.code;
			sessId = channelMess.sessId;

		} catch (ex) {
			console.log("Error extracting data ::", ex);
		}

		console.log("BidChannelService :: CODE ::", code);
		console.log("BidChannelService :: SESSION ::", sessId);

		if (PStrUtils.isEmpty(code) || PStrUtils.isEmpty(sessId)) {
			if (PStrUtils.isEmpty(code)) Logger.logError("onGetBidRequest :: CODE Missing ::", code);
			if (PStrUtils.isEmpty(code)) Logger.logError("onGetBidRequest :: CODE Missing ::", code);

			return;
		}

		this.executeRequest(code, sessId);
	}

	public executeRequest (code: string, sessId: string): void {
		let scope = this;

		async function execute (): Promise<void> {
			let cachedVendorOffer = await scope.bidCacheDb.getVendorOffer(code, scope.apiClient.vendorId);

			// Do we have chached results we are supposed to use?
			if (cachedVendorOffer) {
				console.log("Using cahed offer");
				scope.emitChannelBid(code, sessId, cachedVendorOffer);
			} else {
				console.log("Using price service");
				scope.doCallVendorService(code, sessId);
			}
		}

		execute().then(res => {
			// Execute done!
		});
	}

	public doCallVendorService (code: string, sessId: string): void {
		this.callVendorService(code).then((data: any) => {
			console.log("doCallVendorService :: ", data);
			this.emitChannelBid(code, sessId, data);

			//
			// Cache result
			//
			if (data && data.accepted) {
				this.bidCacheDb.cacheOffer(data);
			}

		}).catch(err => {
			Logger.logFatalError("callVendorService ::", err);
		});
	}

	/**
	 * Emit bid over pub/sub channel
	 * @param {string} code
	 * @param {string} sessId
	 * @param {IVendorOfferResult} offer
	 */
	private emitChannelBid (code: string, sessId: string, data: IVendorOfferData): void {
		let messData = new DroneMessage(ZapMessageType.VendorOffer, data, sessId);
		console.log("Prepping message ::", JSON.stringify(messData));

		this.droneServer.emitToChannel(DroneChannels.Bids, DroneEvent.NewBid, messData);
	}

	public callVendorService (code: string): Promise<IVendorOfferData> {
		console.log("callVendorService ::", code);

		let scope = this;
		let result: IVendorOfferData = null;

		return new Promise((resolve, reject) => {
			this.apiClient.getOffer(code).then((res) => {
				if (res.offer !== null) {
					let offerNum = scope.formatOffer(res.offer);
					res.accepted = offerNum > -1;
					res.offer = offerNum.toString();

					// Append the code to the result
					res.code = code;
				}

				resolve(res);

			}).catch((err) => {
				console.log("getOffer :: ERR", err);
				reject(err);
			});
		});
	}
}

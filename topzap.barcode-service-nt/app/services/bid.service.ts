/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';
import { VendorOfferData }        from '@app/models/zap-ts-models/zap-offer.model';
import { IVendorApiClient }       from '@app/vendor-api-client';
import { PStrUtils }              from '@putte/pstr-utils';
import { ZapMessageType}          from '@app/models/zap-ts-models/messages/zap-message-types';
import { Logger }                 from '@cli/logger';
import { BidCacheDb }             from '@app/database/bid-cache-db';
import { PubsubService }          from '@pubsub/pubsub-service';
import {IPubsubPayload, PubsubMessage, PubsubPayload} from '@pubsub/pubsub-message';
import { IPubsubMessage }         from '@pubsub/pubsub-message';
import { MessageTypes }           from '@pubsub/pubsub-message';
import { Channels }               from '@pubsub/pubsub-channels';
import {PBService, ServiceType} from '@pubsub/pubsub-types';

export interface IBidService {
	callVendorService(code: string): Promise<IVendorOfferData>;
}

const TEST_MODE = true;

export class BidService implements IBidService{
	bidCacheDb: BidCacheDb;
	pubsub: PubsubService;

	constructor(public apiClient: IVendorApiClient) {
		this.bidCacheDb = new BidCacheDb();
		this.pubsub = new PubsubService();

		let channels = [
					Channels.GetBidChannel,
					Channels.ServiceChannel,
					Channels.RequestHello
				];
		this.pubsub.subscribe(channels);

		this.sayHello();

		//
		// We are requested to say hello
		//
		this.pubsub.onRequestHello((msg: IPubsubPayload) => {
			Logger.logPurple(">> onRequestHello ::", msg);

			// Check that this is the requested service
			if (msg.type === ServiceType.VendorPriceService) {
				this.sayHello();
			}
		});

		this.pubsub.onServiceMessage((msg: IPubsubMessage) => {
			Logger.logPurple("** SERVICE MESSAGE ::", msg);
		});

		this.pubsub.onGetBidRequest((msg: IPubsubMessage) => {
			console.log("BIDS MESSAGE ::", msg);

			if (msg.type === MessageTypes.GetBid) {
				console.log("GET BID EVENT RECEIVED!!!");
				console.log("Channel :: DATA ::", msg.data);
				this.onGetBidRequest(msg);
			}
		});
	}

	private sayHello(): void {
		let payload = new  PBService(ServiceType.VendorPriceService, this.apiClient.vendorId);
		this.pubsub.publish(Channels.ServiceHello, payload).then(res => {
			Logger.logPurple("sayHello ::", payload);
		}).catch(err => {
			Logger.logError("sayHello :: err ::", err);
		});
	}

	private formatOffer(input: string): number {
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

	public onGetBidRequest(message: any): void {
		console.log("ON NEW BID ---->");
		let psMess = message as IPubsubMessage;

		let code: string = "";
		let sessId: string = "";

		try {
			code = psMess.data.code;
			sessId = psMess.sessId;

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

	public executeRequest(code: string, sessId: string): void {
		let scope = this;

		async function execute(): Promise<void> {
			let cachedVendorOffer = await scope.bidCacheDb.getVendorOffer(code, scope.apiClient.vendorId);

			// Do we have chached results we are supposed to use?
			if (cachedVendorOffer) {
				console.log("Using cahed offer");
				scope.emitPubsubBid(cachedVendorOffer, sessId);
			} else {
				console.log("Using price service");
				scope.doCallVendorService(code, sessId);
			}
		}

		execute().then(res => {
			// Execute done!
		});
	}

	public doCallVendorService(code: string, sessId: string): void {
		this.callVendorService(code).then((data: any) => {
			console.log("doCallVendorService :: ", data);
			this.emitPubsubBid(data, sessId);

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
	private emitPubsubBid(data: IVendorOfferData, sessId: string): void {
		let messData = new PubsubMessage(ZapMessageType.VendorOffer, data, sessId);
		console.log("Prepping message ::", JSON.stringify(messData));
		this.pubsub.emitNewBidMessage(messData, sessId);
	}

	public callVendorService(code: string): Promise<IVendorOfferData> {
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

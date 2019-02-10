/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';
import { VendorOfferData }        from '@app/models/zap-ts-models/zap-offer.model';
import { IVendorApiClient }       from '@app/VendorApiClient';
import {Channel, IChannel} from '@channels/channel';
import {ChannelNames, MessagePipes} from '@channels/channel-config';
import {PStrUtils} from '@putte/pstr-utils';
import {ChannelMessage} from '@channels/channel-message';
import {ZapMessageType} from '@app/models/zap-ts-models/messages/zap-message-types';
import {Logger} from '@cli/logger';

export interface IBidService {
	getVendorBid(code: string): Promise<IVendorOfferData>;
}

export class BidService implements IBidService{
	bidsChannel: IChannel;

	constructor(public apiClient: IVendorApiClient) {
		this.bidsChannel = new Channel(ChannelNames.Bids, MessagePipes.GetBid);

		this.bidsChannel.onChannelData((data) => {
			this.getBid(data);
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

	private emitGetOffersInit(sessId: string, data: any): void {
		let mess = new ChannelMessage(ZapMessageType.GetOffersInit, data, sessId);
		this.bidsChannel.emitMessage(mess, sessId);
	}

	private emitVendorOffer(sessId: string, data: any): void {
		let mess = new ChannelMessage(ZapMessageType.VendorOffer, data, sessId);
		this.bidsChannel.emitMessage(mess, sessId);
	}

	private emitOffersDone(sessId: string): void {
		let mess = new ChannelMessage(ZapMessageType.GetOffersDone, {}, sessId);
		this.bidsChannel.emitMessage(mess, sessId);
	}

	public getBid(data: any): void {
		let code: string = null;

		try {
			console.log("BidChannelService :: CODE ::", data.code);
			console.log("BidChannelService :: SESSION ::", data.sessId);
			console.log("BidChannelService ::", data);
			code = data.code;

		} catch(ex) {
			code = null;
		}

		if (PStrUtils.isEmpty(code)) {
			let err = new Error("Code is missing");
			//message.data(err);

		} else {
			this.getVendorBid(code).then(bid => {
				console.log("VENDOR BID ::", bid);

			}).catch(err => {
				Logger.logFatalError("getVendorBid ::", err);
			});
		}
	}

	public getVendorBid(code: string): Promise<IVendorOfferData> {
		let scope = this;
		let result = new VendorOfferData();

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

/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as Scaledrone            from 'scaledrone-node';
import { ChannelEvents }          from '@channels/channel-events';
import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';
import { VendorOfferData }        from '@app/models/zap-ts-models/zap-offer.model';
import { IVendorApiClient }       from '@app/VendorApiClient';
import { IChannel }               from '@channels/channel';
import { MessagePipes }           from '@channels/channel-config';
import { PStrUtils }              from '@putte/pstr-utils';
import { IChannelMessage }        from '@channels/channel-message';
import { ChannelMessage }         from '@channels/channel-message';
import { ZapMessageType}          from '@app/models/zap-ts-models/messages/zap-message-types';
import { Logger }                 from '@cli/logger';

export interface IBidService {
	getVendorBid(code: string): Promise<IVendorOfferData>;
}

export class BidService implements IBidService{
	bidsChannel: IChannel;
//	sendChannel: IChannel;

	drone: any;
	channel: any;

	constructor(public apiClient: IVendorApiClient) {
		/*
		this.bidsChannel = new Channel(ChannelNames.Bids, MessagePipes.GetBid);

		this.bidsChannel.onChannelData((data) => {
			console.log("CHANNEL 2 :: bidsChannel ::", data);
			this.onNewBid(data);
		});
		*/

		this.drone = new Scaledrone("0RgtaE9UstNGjTmu");

		this.channel = this.drone.subscribe(MessagePipes.GetBid);

		this.channel.on(ChannelEvents.ChannelData, data => {
			this.onNewBid(data);
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

	public onNewBid(message: any): void {
		console.log("ON NEW BID ---->");
		let channelMess = message as IChannelMessage;
		let code: string = null;
		let sessId: string = null;

		try {
			code = channelMess.data.code;
			sessId = channelMess.sessId;

			console.log("BidChannelService :: CODE ::", code);
			console.log("BidChannelService :: SESSION ::", sessId);
			//console.log("BidChannelService ::", message);

		} catch(ex) {
			code = null;
		}

		if (PStrUtils.isEmpty(code) || PStrUtils.isEmpty(sessId)) {
			let err = new Error("Code or SessionId is missing");
			//message.data(err);

		} else {
			this.getVendorBid(code).then(bid => {
				console.log("VENDOR BID ::", bid);

				let messData = new ChannelMessage(ZapMessageType.VendorOffer, bid, sessId);
				//this.bidsChannel.emitMessage(messData, MessagePipes.NewBid);
				//let channel = new Channel(ChannelNames.Bids, MessagePipes.NewBid);
				/*
				channel.onChannelOpen(() => {
					console.log("FUCK CHANNEL OPEN ::");
				//	channel.emitMessage(messData, MessagePipes.NewBid);
				});
				*/
				//this.bidsChannel.emitMessage(messData, MessagePipes.NewBid);
				//this.sendChannel.emitMessage(messData, MessagePipes.NewBid);

				console.log("Emitting message ::", JSON.stringify(messData));

				this.drone.publish(
					{room: MessagePipes.NewBid, message: messData }
				);

			}).catch(err => {
				Logger.logFatalError("getVendorBid ::", err);
			});
		}
	}

	public getVendorBid(code: string): Promise<IVendorOfferData> {
		console.log("getVendorBid ::", code);

		let scope = this;
		let result: IVendorOfferData = null; //new VendorOfferData();

		return new Promise((resolve, reject) => {
			/*let data = new VendorOfferData("0887195000424", 13, "88 Heroes: 98 Heroes Edition - Nintendo Switch");
			data.accepted = true;
			data.offer = "0.34";
			resolve(data);
			*/

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

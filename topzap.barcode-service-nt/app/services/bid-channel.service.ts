/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Logger }                 from '@cli/logger';
import { EventEmitter }           from 'events';
import { PStrUtils }              from '@putte/pstr-utils';
import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';
import { IChannelMessage }        from '@channels/channel-message';
import { ChannelMessage }         from '@channels/channel-message';
import { ChannelEvents }          from '@channels/channel-events';
import { ChannelConfig }          from '@channels/channel-config';
import { ChannelNames }           from '@channels/channel-config';
import { MessagePipes }           from '@channels/channel-config';
import { ZapMessageType }         from '@app/models/zap-ts-models/messages/zap-message-types';
import { IChannel }               from '@channels/channel';
import { ChannelBaseController }  from '@channels/channel-base.controller';
import { IBidService }            from '@app/services/bid.service';

export interface IBidServiceChannel {
}

export class BidChannelService extends ChannelBaseController implements IBidServiceChannel {
	bidChannel: IChannel;

	constructor(private bidService: IBidService) {
		super(ChannelNames.Bids, MessagePipes.GetBid);

		this.onChannelData((data) => {
			console.log("BidChannelService :: CODE ::", data.code);
			console.log("BidChannelService :: SESSION ::", data.sessId);
			console.log("BidChannelService ::", data);
			this.getBid(data.code);
		});
	}

	private emitGetOffersInit(sessId: string, data: any): void {
		let mess = new ChannelMessage(ZapMessageType.GetOffersInit, data, sessId);
		this.emitMessage(mess);
	}

	private emitVendorOffer(sessId: string, data: any): void {
		let mess = new ChannelMessage(ZapMessageType.VendorOffer, data, sessId);
		this.emitMessage(mess);
	}

	private emitOffersDone(sessId: string): void {
		let mess = new ChannelMessage(ZapMessageType.GetOffersDone, {}, sessId);
		this.emitMessage(mess);
	}

	public getBid(code: string, message: ChannelMessage = null): void {
		if (PStrUtils.isEmpty(code)) {
			let err = new Error("Code is missing");
			message.data(err);

		} else {
			this.bidService.getVendorBid(code).then(bid => {
				console.log("VENDOR BID ::", bid);

			}).catch(err => {
				Logger.logFatalError("getVendorBid ::", err);
			});
		}
	}

	/*
	public doGetOffers(sessId: string, mess: IChannelMessage): void {
		function validateBarcode(code: string): boolean {
			if (!PStrUtils.isNumeric(code)) {
				Logger.logDebugErr("BasketWsApiController :: doGetOffers ::", code);
				this.wss.messError(session.id, mess, new Error("messZapMessageType.ErrInvalidCode"));
				return false;
			}
			return true;
		}

		Logger.logPurple("BiDChannelService :: doGetOffers");
		this.emitGetOffersMessage(code, session.id); // Call price service
	}
	*/
}

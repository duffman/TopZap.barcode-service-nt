/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Logger }                 from "@cli/logger";
import { Constants }              from "@inc/constants";

/*
import { MomoxAppApi }            from "@api-clients/momox/momox-api-client";
import { WbgAppApi }              from "@api-clients/webuygames/wbg-api-client";
import { ZiffitAppApi }           from "@api-clients/ziffit/ziffit-api-client";
import { MmpAppApi }              from "@api-clients/musicmagpie/mmp-api-client";
*/

import { IChannel }               from '@channels/channel';
import { Channel }                from '@channels/channel';
import { IBidServiceChannel }     from '@app/services/bid-channel.service';
import { ChannelNames }           from '@channels/channel-config';
import { MessagePipes}            from '@channels/channel-config';
import { IBidService }            from '@app/services/bid.service';
import { BidService }             from '@app/services/bid.service';
import { MomoxAppApi }            from '../api-clients/momox/momox-api-client';
import {IVendorApiClient} from '@app/VendorApiClient';
import {MmpAppApi} from '../api-clients/musicmagpie/mmp-api-client';
import {ZiffitAppApi} from '../api-clients/ziffit/ziffit-api-client';
import {WbgAppApi} from '../api-clients/webuygames/wbg-api-client';

export class Application {
	serviceChannel: IChannel;
	bidService: IBidService;
	bidChannel: IBidServiceChannel;

	constructor(public debug: boolean = false, apiClientVendor: string) {
		Logger.logGreen("Starting up...");
		Logger.logPurple(Constants.APP_NAME);


		switch (apiClientVendor) {
			case "momox":
				this.bidService = new BidService(new MomoxAppApi());
				break;
			case "mmp":
				this.bidService = new BidService(new MmpAppApi());
				break;
			case "ziffit":
				this.bidService = new BidService(new ZiffitAppApi());
				break;
			case "wbg":
				this.bidService = new BidService(new WbgAppApi());
				break;
		}

		if (this.bidService === null) {
			Logger.logError("Could not load Miner API Client for ::", apiClientVendor);
			process.exit(220);
		}

		//this.bidChannel = new BidChannelService(this.bidService);

		this.serviceChannel = new Channel(ChannelNames.Service, MessagePipes.Service);

		this.serviceChannel.onChannelOpen((data) => {
			console.log("Service Channel OPEN ::", data);
		});

		this.serviceChannel.onChannelData((data) => {
			console.log("Service Channel DATA ::", data);
		});
	}
}

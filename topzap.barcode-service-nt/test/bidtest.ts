/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as Scaledrone            from 'scaledrone-node';
import { MomoxAppApi }            from '@api-clients/momox/momox-api-client';
import { BidService }             from '@app/services/bid.service';
import {ChannelIds, ChannelNames} from '@channels/channel-config';
import { MessagePipes}            from '@channels/channel-config';
import { ChannelEvents }          from '@channels/channel-events';

let drone =  new Scaledrone(ChannelIds.Bids);
this.channel = drone.subscribe(MessagePipes.NewBid);

drone.on("open", (err) => {
	console.log(">> CHANNEL OPEN ::", err);
});


drone.on("data", data => {
	console.log(">> CHANNEL DATA ::", data);
});


this.channel.on(ChannelEvents.ChannelData, data => {
	console.log("CHANNEL DATA ::", data);
});

let client = new MomoxAppApi();
let bidService = new BidService(client);

bidService.executeRequest("0887195000424", "balle");
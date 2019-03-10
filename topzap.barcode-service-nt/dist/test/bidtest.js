"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scaledrone = __importStar(require("scaledrone-node"));
const momox_api_server_1 = require("@api-clients/momox/momox-api-server");
const bid_service_1 = require("@app/services/bid.service");
const channel_config_1 = require("@channels/channel-config");
const channel_config_2 = require("@channels/channel-config");
const drone_events_1 = require("@channels/drone-events");
let drone = new Scaledrone(channel_config_1.ChannelNames.Bids);
this.channel = drone.subscribe(channel_config_2.MessagePipes.NewBid);
drone.on("open", (err) => {
    console.log(">> CHANNEL OPEN ::", err);
});
drone.on("data", data => {
    console.log(">> CHANNEL DATA ::", data);
});
this.channel.on(drone_events_1.DroneEvents.Data, data => {
    console.log("CHANNEL DATA ::", data);
});
let client = new momox_api_server_1.MomoxAppApi();
let bidService = new bid_service_1.BidService(client);
bidService.executeRequest("0887195000424", "balle");

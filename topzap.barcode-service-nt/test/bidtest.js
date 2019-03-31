/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
"use strict";
var Scaledrone = require('scaledrone-node');
var momox_api_server_1 = require('@api-clients/momox/momox-api-server');
var bid_service_1 = require('@app/services/bid.service');
var channel_config_1 = require('@channels/channel-config');
var channel_config_2 = require('@channels/channel-config');
var drone_events_1 = require('@channels/drone-events');
var drone = new Scaledrone(channel_config_1.ChannelNames.Bids);
this.channel = drone.subscribe(channel_config_2.MessagePipes.NewBid);
drone.on("open", function (err) {
    console.log(">> CHANNEL OPEN ::", err);
});
drone.on("data", function (data) {
    console.log(">> CHANNEL DATA ::", data);
});
this.channel.on(drone_events_1.DroneEvents.Data, function (data) {
    console.log("CHANNEL DATA ::", data);
});
var client = new momox_api_server_1.MomoxAppApi();
var bidService = new bid_service_1.BidService(client);
bidService.executeRequest("0887195000424", "balle");

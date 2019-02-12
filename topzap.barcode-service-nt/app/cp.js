"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
exports.__esModule = true;
var Scaledrone = require("scaledrone-node");
var channel_events_1 = require("./channels.git/channel-events");
var drone = new Scaledrone("wnQpxZuJgaUChUul");
var room1 = drone.subscribe("kalle1");
var room2 = drone.subscribe("kalle2");
room1.on(channel_events_1.ChannelEvents.ChannelData, function (data) {
    console.log("BALLE1 ::", data);
});
room2.on(channel_events_1.ChannelEvents.ChannelData, function (data) {
    console.log("BALLE2 ::", data);
});
drone.on('open', function () {
    drone.publish({ room: "kalle1", "message": "kalle" });
});

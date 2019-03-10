"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * March 2019
 */
Object.defineProperty(exports, "__esModule", { value: true });
const drone_config_1 = require("./drone-config");
const PusherClient = require("pusher-client");
const events_1 = require("events");
const drone_channels_1 = require("@app/zapdrone/drone-channels");
const drone_event_1 = require("@app/zapdrone/drone-event");
class DroneClient {
    constructor() {
        this.eventEmitter = new events_1.EventEmitter();
        this.client = new PusherClient(drone_config_1.DroneConfig.Development.key, { cluster: 'eu' });
        this.attachListeners();
    }
    attachListeners() {
        let dataChannel = this.client.subscribe(drone_channels_1.DroneChannels.Bids);
        dataChannel.bind(drone_event_1.DroneEvent.GetBid, (data) => {
            console.log("GET BID ::", data);
            this.eventEmitter.emit(drone_event_1.DroneEvent.GetBid, data);
        });
        dataChannel.bind(drone_event_1.DroneEvent.NewBid, (data) => {
            console.log("NEW BID ::", data);
            this.eventEmitter.emit(drone_event_1.DroneEvent.NewBid, data);
        });
    }
    onGetBid(listener) {
        this.eventEmitter.addListener(drone_event_1.DroneEvent.GetBid, listener);
    }
    onNewBid(listener) {
        this.eventEmitter.addListener(drone_event_1.DroneEvent.NewBid, listener);
    }
    // -- //
    onData(listener) {
        this.eventEmitter.addListener("data", listener);
    }
    subscribe(channel, action) { }
}
exports.DroneClient = DroneClient;
/*
let pusher = new Pusher('fae6c314f74fb399e2ac', {
    cluster: 'eu',
    forceTLS: true
});

var channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
    alert(JSON.stringify(data));
});
*/
/*
let socket = new Pusher(DroneConfig. 'MY_API_KEY');
var my_channel = socket.subscribe('my-channel');
socket.bind('new-comment',
    function(data) {
        // add comment into page
    }
);
*/

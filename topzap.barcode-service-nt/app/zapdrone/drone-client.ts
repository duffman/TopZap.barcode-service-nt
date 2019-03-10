/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * March 2019
 */


import { DroneConfig }            from "./drone-config";
import * as PusherClient          from "pusher-client";
import { EventEmitter }           from "events";
import { DroneChannels }          from "@app/zapdrone/drone-channels";
import { DroneEvent }             from "@app/zapdrone/drone-event";

export class DroneClient {
	client: PusherClient;
	private eventEmitter: EventEmitter;

	constructor() {
		this.eventEmitter = new EventEmitter();

		this.client = new PusherClient(
			DroneConfig.Development.key,
			{ cluster: 'eu' }
		);

		this.attachListeners();
	}

	private attachListeners() {
		let dataChannel = this.client.subscribe(DroneChannels.Bids);

		dataChannel.bind(DroneEvent.GetBid, (data) => {
			console.log("GET BID ::", data);
			this.eventEmitter.emit(DroneEvent.GetBid, data);
		});

		dataChannel.bind(DroneEvent.NewBid, (data) => {
			console.log("NEW BID ::", data);
			this.eventEmitter.emit(DroneEvent.NewBid, data);
		});
	}

	public onGetBid(listener: any): void {
		this.eventEmitter.addListener(DroneEvent.GetBid, listener);
	}

	public onNewBid(listener: any): void {
		this.eventEmitter.addListener(DroneEvent.NewBid, listener);
	}

	// -- //

	public onData(listener: any): void {
		this.eventEmitter.addListener("data", listener);
	}

	public subscribe(channel: string, action: string) {}
}


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

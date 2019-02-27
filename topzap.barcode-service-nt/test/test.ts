/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as Scaledrone            from 'scaledrone-node';
import {MessagePipes} from '@channels/channel-config';
import {ChannelEvents} from '@channels/channel-events';
import {Logger} from '@cli/logger';

this.serviceDrone = new Scaledrone("T4eUrfAVDy7ODb0h"); // Service Channel
let serviceChannel = this.serviceDrone.subscribe(MessagePipes.Service);

let serviceChannel2 = this.serviceDrone.subscribe("register");

this.serviceDrone.on("open", data => {
	console.log("OPEN ::", data);

	this.serviceDrone.publish({room: "register", message:  { hello: 'world', year: 2019 }    });
});

this.serviceDrone.on("data", data => {
	console.log("DATA ::", data);
});

serviceChannel.on(ChannelEvents.ChannelOpen, error => {

	if (error) {
		Logger.logError("Error :: serviceChannel ::", error);
		return;
	}

	let message = {
		name: "kalle"
	};

	console.log("Publishing register message ::", message);

	this.serviceDrone.publish(
		{room: "register", message: message }
	);

	this.serviceDrone.publish({room: "register", message: message});
	this.serviceDrone.publish({room: MessagePipes.Service, message: message});
});

serviceChannel.on(ChannelEvents.ChannelData, data => {
	console.log("DATA ::", data);
	console.log("NAME ::", this.apiClient.name);
});

/*
	this.serviceDrone = new Scaledrone("T4eUrfAVDy7ODb0h"); // Service Channel
		let serviceChannel = this.serviceDrone.subscribe(MessagePipes.Service);

		serviceChannel.on(ChannelEvents.ChannelOpen, error => {

			if (error) {
				Logger.logError("Error :: serviceChannel ::", error);
				return;
			}

			let message = {
				name: this.apiClient.name
			};

			console.log("Publishing register message ::", message);

			this.serviceDrone.publish(
				{room: "register", message: message }
			);

			this.serviceDrone.publish({room: "register", message: message});
			this.serviceDrone.publish({room: MessagePipes.Service, message: message});
		});

		serviceChannel.on(ChannelEvents.ChannelData, data => {
			console.log("DATA ::", data);
			console.log("NAME ::", this.apiClient.name);
		});
 */
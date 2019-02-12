/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import Scaledrone = require('scaledrone-node');
import {ChannelEvents} from './channels.git/channel-events';

let drone = new Scaledrone("wnQpxZuJgaUChUul");

let room1 = drone.subscribe("kalle1");
let room2 = drone.subscribe("kalle2");

room1.on(ChannelEvents.ChannelData, data => {
	console.log("BALLE1 ::", data);
});

room2.on(ChannelEvents.ChannelData, data => {
	console.log("BALLE2 ::", data);
});

drone.on('open', () => {
	drone.publish(
		{room: "kalle1", "message": "kalle" }

	);
});
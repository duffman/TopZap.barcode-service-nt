/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * March 2019
 */

import * as Pusher                from "pusher";
import { DroneConfig }            from "./drone-config";

/*
let pusher = new Pusher({
	appId       : DroneConfig.Development.app_id,
	key         : DroneConfig.Development.key,
	secret      : DroneConfig.Development.secret,
	useTLS      : true,               // optional, defaults to false
	cluster     : DroneConfig.Development.cluster,         // if `host` is present, it will override the `cluster` option.
//	host        : 'HOST',               // optional, defaults to api.pusherapp.com
//	port        : PORT,                 // optional, defaults to 80 for non-TLS connections and 443 for TLS connections

   // a 32 character long key used to derive secrets for end to end encryption (see below!)
 	encryptionMasterKey: DroneConfig.encryptionMasterKey
});
*/

export class DroneServer {
	pusher: Pusher;

	constructor() {
		console.log("DroneServer...");

		this.pusher = new Pusher({
			appId       : DroneConfig.Development.app_id,
			key         : DroneConfig.Development.key,
			secret      : DroneConfig.Development.secret,
			useTLS      : true,
			cluster     : DroneConfig.Development.cluster
		});
	}

	public emitToChannel(channel: string, event: string, data: any) {
		this.pusher.trigger(channel, event, { message: data });
	}

	public subscribe(channel: string): any {
		return null;
	}
}

let server = new DroneServer();
server.emitToChannel("getBid", "data", {balle: true});
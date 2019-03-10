"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * March 2019
 */
exports.__esModule = true;
var Pusher = require("pusher");
var drone_config_1 = require("./drone-config");
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
var DroneServer = /** @class */ (function () {
    function DroneServer() {
        console.log("DroneServer...");
        this.pusher = new Pusher({
            appId: drone_config_1.DroneConfig.Development.app_id,
            key: drone_config_1.DroneConfig.Development.key,
            secret: drone_config_1.DroneConfig.Development.secret,
            useTLS: true,
            cluster: drone_config_1.DroneConfig.Development.cluster
        });
    }
    DroneServer.prototype.emitToChannel = function (channel, event, data) {
        this.pusher.trigger(channel, event, { message: data });
    };
    DroneServer.prototype.subscribe = function (channel) {
        return null;
    };
    return DroneServer;
}());
exports.DroneServer = DroneServer;
var server = new DroneServer();
server.emitToChannel("getBid", "data", { balle: true });

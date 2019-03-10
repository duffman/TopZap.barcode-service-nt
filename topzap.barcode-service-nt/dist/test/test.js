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
const channel_config_1 = require("@channels/channel-config");
const logger_1 = require("@cli/logger");
const drone_events_1 = require("@channels/drone-events");
this.serviceDrone = new Scaledrone("T4eUrfAVDy7ODb0h"); // Service Channel
let serviceChannel = this.serviceDrone.subscribe(channel_config_1.MessagePipes.Service);
let serviceChannel2 = this.serviceDrone.subscribe("register");
this.serviceDrone.on("open", data => {
    console.log("OPEN ::", data);
    this.serviceDrone.publish({ room: "register", message: { hello: 'world', year: 2019 } });
});
this.serviceDrone.on("data", data => {
    console.log("DATA ::", data);
});
serviceChannel.on(drone_events_1.DroneEvents.Open, error => {
    if (error) {
        logger_1.Logger.logError("Error :: serviceChannel ::", error);
        return;
    }
    let message = {
        name: "kalle"
    };
    console.log("Publishing register message ::", message);
    this.serviceDrone.publish({ room: "register", message: message });
    this.serviceDrone.publish({ room: "register", message: message });
    this.serviceDrone.publish({ room: channel_config_1.MessagePipes.Service, message: message });
});
serviceChannel.on(drone_events_1.DroneEvents.Data, data => {
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

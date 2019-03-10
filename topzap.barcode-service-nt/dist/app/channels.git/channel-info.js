/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
"use strict";
var DroneChanneConfig = (function () {
    function DroneChanneConfig(channels) {
        this.channels = channels;
    }
    return DroneChanneConfig;
}());
exports.DroneChanneConfig = DroneChanneConfig;
var DroneChannel = (function () {
    function DroneChannel(name, channelID, secretKey) {
        this.name = name;
        this.channelID = channelID;
        this.secretKey = secretKey;
    }
    return DroneChannel;
}());
exports.DroneChannel = DroneChannel;
var DroneChannelConvert;
(function (DroneChannelConvert) {
    function toIChannelConfig(json) {
        return JSON.parse(json);
    }
    DroneChannelConvert.toIChannelConfig = toIChannelConfig;
    function iChannelConfigToJson(value) {
        return JSON.stringify(value);
    }
    DroneChannelConvert.iChannelConfigToJson = iChannelConfigToJson;
})(DroneChannelConvert = exports.DroneChannelConvert || (exports.DroneChannelConvert = {}));

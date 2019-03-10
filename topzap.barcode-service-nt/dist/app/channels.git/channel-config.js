/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
"use strict";
var channel_info_1 = require('@channels/channel-info');
var ChannelNames = (function () {
    function ChannelNames() {
    }
    ChannelNames.Basket = "Basket";
    ChannelNames.Bids = "Bids";
    ChannelNames.Service = "Service";
    return ChannelNames;
}());
exports.ChannelNames = ChannelNames;
var MessagePipes = (function () {
    function MessagePipes() {
    }
    MessagePipes.GetBid = "getBid";
    MessagePipes.NewBid = "newBid";
    MessagePipes.Service = "service";
    return MessagePipes;
}());
exports.MessagePipes = MessagePipes;
var ChannelConfig = (function () {
    function ChannelConfig() {
        this.channels = new Array();
        this.channels.push(new channel_info_1.DroneChannel(ChannelNames.Basket, "wnQpxZuJgaUChUul", "z2EWz4zXdNr63YUiwavv5kpdahRYfXxC"));
        this.channels.push(new channel_info_1.DroneChannel(ChannelNames.Bids, "0RgtaE9UstNGjTmu", "Q8ZcaFTMQTReingz9zNJmKjuVgnVYvYe"));
        this.channels.push(new channel_info_1.DroneChannel(ChannelNames.Service, "T4eUrfAVDy7ODb0h", "RyoF4UUVHCw6jEU1JtscfhNGaGsJrgF7"));
    }
    ChannelConfig.prototype.getChannelData = function (name) {
        var result;
        for (var _i = 0, _a = this.channels; _i < _a.length; _i++) {
            var channel = _a[_i];
            if (channel.name === name) {
                result = channel;
                break;
            }
        }
        return result;
    };
    return ChannelConfig;
}());
exports.ChannelConfig = ChannelConfig;

/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
"use strict";
var events_1 = require('events');
var channel_config_1 = require('./channel-config');
var channel_events_1 = require('./channel-events');
var Channel = (function () {
    function Channel(channelName, messagePipe) {
        this.channelName = channelName;
        this.messagePipe = messagePipe;
        this.eventEmitter = new events_1.EventEmitter();
        var config = new channel_config_1.ChannelConfig();
        var channelInfo = config.getChannelData(channelName);
        if (channelInfo === null) {
            var error = new Error("Channel not found");
            throw error;
        }
    }
    Channel.prototype.attachEventHandlers = function () {
        var _this = this;
        var channel = this.channel;
        channel.on(channel_events_1.ChannelEvents.ChannelOpen, function (data) {
            _this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelOpen, data);
        });
        channel.on(channel_events_1.ChannelEvents.ChannelData, function (data) {
            _this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelData, data);
        });
        channel.on(channel_events_1.ChannelEvents.ChannelError, function (data) {
            _this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelError, data);
        });
        channel.on(channel_events_1.ChannelEvents.ChannelClose, function (data) {
            _this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelClose, data);
        });
        channel.on(channel_events_1.ChannelEvents.ChannelDisconnect, function (data) {
            _this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelDisconnect, data);
        });
        channel.on(channel_events_1.ChannelEvents.ChannelReconnect, function (data) {
            _this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelReconnect, data);
        });
    };
    Channel.prototype.emitMessage = function (message, messagePipe) {
        if (messagePipe === void 0) { messagePipe = null; }
        console.log("Emitting to Pipe '" + messagePipe + "'");
        messagePipe = messagePipe !== null ? messagePipe : this.messagePipe;
        this.drone.publish({ room: messagePipe, message: message });
    };
    Channel.prototype.onChannelOpen = function (listener) {
        this.eventEmitter.addListener(channel_events_1.ChannelEvents.ChannelOpen, listener);
    };
    Channel.prototype.onChannelData = function (listener) {
        this.eventEmitter.addListener(channel_events_1.ChannelEvents.ChannelData, listener);
    };
    Channel.prototype.onChannelError = function (listener) {
        this.eventEmitter.addListener(channel_events_1.ChannelEvents.ChannelError, listener);
    };
    Channel.prototype.onChannelClose = function (listener) {
        this.eventEmitter.addListener(channel_events_1.ChannelEvents.ChannelClose, listener);
    };
    Channel.prototype.onChannelDisconnect = function (listener) {
        this.eventEmitter.addListener(channel_events_1.ChannelEvents.ChannelDisconnect, listener);
    };
    Channel.prototype.onChannelReconnect = function (listener) {
        this.eventEmitter.addListener(channel_events_1.ChannelEvents.ChannelReconnect, listener);
    };
    return Channel;
}());
exports.Channel = Channel;

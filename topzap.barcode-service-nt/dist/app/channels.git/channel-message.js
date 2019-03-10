/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
"use strict";
var ChannelMessage = (function () {
    function ChannelMessage(type, data, sessId, success, tag) {
        if (data === void 0) { data = null; }
        if (sessId === void 0) { sessId = ""; }
        if (success === void 0) { success = true; }
        if (tag === void 0) { tag = null; }
        this.type = type;
        this.data = data;
        this.sessId = sessId;
        this.success = success;
        this.tag = tag;
    }
    return ChannelMessage;
}());
exports.ChannelMessage = ChannelMessage;

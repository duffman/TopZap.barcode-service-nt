"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const pstr_utils_1 = require("@putte/pstr-utils");
const zap_message_types_1 = require("@app/models/zap-ts-models/messages/zap-message-types");
const logger_1 = require("@cli/logger");
const bid_cache_db_1 = require("@app/database/bid-cache-db");
const drone_server_1 = require("@app/zapdrone/drone-server");
const drone_client_1 = require("@app/zapdrone/drone-client");
const drone_message_1 = require("@app/zapdrone/drone-message");
const drone_channels_1 = require("@app/zapdrone/drone-channels");
const drone_event_1 = require("@app/zapdrone/drone-event");
const TEST_MODE = true;
class BidService {
    //	serviceDrone: any;
    //	bidsChannel: IChannel;
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.bidCacheDb = new bid_cache_db_1.BidCacheDb();
        this.droneClient = new drone_client_1.DroneClient();
        this.droneServer = new drone_server_1.DroneServer();
        this.droneClient.onGetBid((data) => {
            console.log("Channel :: DATA ::", data);
            this.onGetBidRequest(data);
        });
    }
    formatOffer(input) {
        let res = -1;
        try {
            let resStr = input.trim().replace(",", ".");
            res = parseFloat(resStr);
        }
        catch (err) {
            console.log("formatOffer :: ERROR ::", err);
            res = -1;
        }
        return res;
    }
    onGetBidRequest(message) {
        console.log("ON NEW BID ---->");
        let channelMess = message;
        let code = "";
        let sessId = "";
        try {
            code = channelMess.data.code;
            sessId = channelMess.sessId;
        }
        catch (ex) {
            console.log("Error extracting data ::", ex);
        }
        console.log("BidChannelService :: CODE ::", code);
        console.log("BidChannelService :: SESSION ::", sessId);
        if (pstr_utils_1.PStrUtils.isEmpty(code) || pstr_utils_1.PStrUtils.isEmpty(sessId)) {
            if (pstr_utils_1.PStrUtils.isEmpty(code))
                logger_1.Logger.logError("onGetBidRequest :: CODE Missing ::", code);
            if (pstr_utils_1.PStrUtils.isEmpty(code))
                logger_1.Logger.logError("onGetBidRequest :: CODE Missing ::", code);
            return;
        }
        this.executeRequest(code, sessId);
    }
    executeRequest(code, sessId) {
        let scope = this;
        async function execute() {
            let cachedVendorOffer = await scope.bidCacheDb.getVendorOffer(code, scope.apiClient.vendorId);
            // Do we have chached results we are supposed to use?
            if (cachedVendorOffer) {
                console.log("Using cahed offer");
                scope.emitChannelBid(code, sessId, cachedVendorOffer);
            }
            else {
                console.log("Using price service");
                scope.doCallVendorService(code, sessId);
            }
        }
        execute().then(res => {
            // Execute done!
        });
    }
    doCallVendorService(code, sessId) {
        this.callVendorService(code).then((data) => {
            console.log("doCallVendorService :: ", data);
            this.emitChannelBid(code, sessId, data);
            //
            // Cache result
            //
            if (data && data.accepted) {
                this.bidCacheDb.cacheOffer(data);
            }
        }).catch(err => {
            logger_1.Logger.logFatalError("callVendorService ::", err);
        });
    }
    /**
     * Emit bid over pub/sub channel
     * @param {string} code
     * @param {string} sessId
     * @param {IVendorOfferResult} offer
     */
    emitChannelBid(code, sessId, data) {
        let messData = new drone_message_1.DroneMessage(zap_message_types_1.ZapMessageType.VendorOffer, data, sessId);
        console.log("Prepping message ::", JSON.stringify(messData));
        this.droneServer.emitToChannel(drone_channels_1.DroneChannels.Bids, drone_event_1.DroneEvent.NewBid, messData);
    }
    callVendorService(code) {
        console.log("callVendorService ::", code);
        let scope = this;
        let result = null;
        return new Promise((resolve, reject) => {
            this.apiClient.getOffer(code).then((res) => {
                if (res.offer !== null) {
                    let offerNum = scope.formatOffer(res.offer);
                    res.accepted = offerNum > -1;
                    res.offer = offerNum.toString();
                    // Append the code to the result
                    res.code = code;
                }
                resolve(res);
            }).catch((err) => {
                console.log("getOffer :: ERR", err);
                reject(err);
            });
        });
    }
}
exports.BidService = BidService;

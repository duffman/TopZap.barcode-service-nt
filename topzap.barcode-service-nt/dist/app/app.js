"use strict";
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@cli/logger");
const constants_1 = require("@inc/constants");
const bid_service_1 = require("@app/services/bid.service");
const momox_api_client_1 = require("@api-clients/momox/momox-api-client");
const mmp_api_client_1 = require("@api-clients/musicmagpie/mmp-api-client");
const ziffit_api_client_1 = require("@api-clients/ziffit/ziffit-api-client");
const wbg_api_client_1 = require("@api-clients/webuygames/wbg-api-client");
class Application {
    constructor(debug = false, apiClientVendor) {
        this.debug = debug;
        logger_1.Logger.logGreen("Starting up...");
        logger_1.Logger.logPurple(constants_1.Constants.APP_NAME);
        switch (apiClientVendor) {
            case "momox":
                this.bidService = new bid_service_1.BidService(new momox_api_client_1.MomoxAppApi());
                break;
            case "mmp":
                this.bidService = new bid_service_1.BidService(new mmp_api_client_1.MmpAppApi());
                break;
            case "ziffit":
                this.bidService = new bid_service_1.BidService(new ziffit_api_client_1.ZiffitAppApi());
                break;
            case "wbg":
                this.bidService = new bid_service_1.BidService(new wbg_api_client_1.WbgAppApi());
                break;
        }
        if (this.bidService === null) {
            logger_1.Logger.logError("Could not load Miner API Client for ::", apiClientVendor);
            process.exit(220);
        }
    }
}
exports.Application = Application;

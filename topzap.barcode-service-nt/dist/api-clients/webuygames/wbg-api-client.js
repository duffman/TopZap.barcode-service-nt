"use strict";
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const zap_offer_model_1 = require("@app/models/zap-ts-models/zap-offer.model");
const logger_1 = require("@cli/logger");
const wbg_app_worker_1 = require("./wbg-app-worker");
const vendor_list_1 = require("../vendor-list");
class WbgAppApi {
    constructor() {
        this.vendorId = vendor_list_1.Vendors.WeBuyGamesApp;
        this.name = "WeBuyGamesAppApi";
        this.worker = new wbg_app_worker_1.WbgAppWorker();
    }
    getOffer(barcode) {
        let scope = this;
        let zapResult = new zap_offer_model_1.VendorOfferData();
        zapResult.vendorId = vendor_list_1.Vendors.WeBuyGamesApp;
        let error = null;
        async function getData() {
            let worker = scope.worker;
            let basketSign = await worker.signin(undefined);
            console.log(`'${scope.name}' :: basketSign ::`, basketSign);
            try {
                let dataRes = await worker.search(barcode, basketSign);
                console.log(`Miner '${scope.name}' Result ::`, dataRes);
                if (dataRes.data.Item !== undefined) {
                    zapResult.title = dataRes.data.Item.itemName;
                    zapResult.offer = String(dataRes.data.Item.itemPrice).toString();
                    zapResult.success = true;
                }
            }
            catch (err) {
                console.log("WbgAppApi :: ERROR ::::", err);
                zapResult.success = false;
                zapResult.rawData = err;
                error = err;
            }
        }
        return new Promise((resolve, reject) => {
            logger_1.Logger.logGreen("processQueue() :: Done", zapResult);
            getData().then(() => {
                resolve(zapResult);
            });
        });
    }
}
exports.WbgAppApi = WbgAppApi;

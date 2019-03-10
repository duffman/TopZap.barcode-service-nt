"use strict";
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('request');
//import * as request               from "request";
const momox_app_worker_1 = require("./momox-app-worker");
const zap_offer_model_1 = require("@app/models/zap-ts-models/zap-offer.model");
const vendor_list_1 = require("../vendor-list");
class MomoxAppApi {
    constructor(debugMode = false) {
        this.debugMode = debugMode;
        this.vendorId = vendor_list_1.Vendors.MomoxApp;
        this.name = "MomoxAppApi";
        this.worker = new momox_app_worker_1.MomoxMobileWorker(debugMode);
    }
    getOffer(barcode) {
        let scope = this;
        return new Promise((resolve, reject) => {
            let jar = request.jar();
            let zapResult = new zap_offer_model_1.VendorOfferData();
            this.worker.search(barcode).then((dataRes) => {
                console.log(`Miner '${scope.name}' Result ::`, dataRes);
                zapResult.vendorId = vendor_list_1.Vendors.MomoxApp; // Number.parseInt(dataRes.id);
                if (dataRes !== undefined) {
                    zapResult.success = true;
                    zapResult.title = dataRes.title;
                    zapResult.offer = dataRes.price;
                }
                else {
                    zapResult.accepted = false;
                }
                resolve(zapResult);
            });
        });
    }
}
exports.MomoxAppApi = MomoxAppApi;

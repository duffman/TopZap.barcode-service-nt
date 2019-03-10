"use strict";
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const zap_offer_model_1 = require("@app/models/zap-ts-models/zap-offer.model");
const ziffit_app_worker_1 = require("./ziffit-app-worker");
const vendor_list_1 = require("../vendor-list");
class ZiffitAppApi {
    constructor() {
        this.vendorId = vendor_list_1.Vendors.ZiffitApp;
        this.name = "ZiffitAppApi";
        this.worker = new ziffit_app_worker_1.ZiffitAppWorker();
    }
    getOffer(barcode) {
        let scope = this;
        return new Promise((resolve, reject) => {
            let jar = request.jar();
            let zapResult = new zap_offer_model_1.VendorOfferData();
            zapResult.vendorId = vendor_list_1.Vendors.ZiffitApp;
            this.worker.search(barcode).then((dataRes) => {
                console.log(`Miner '${scope.name}' Result ::`, dataRes);
                /*
                console.log(" ");
                console.log(" ");
                console.log("dataRes.product :::", dataRes.product);
                console.log(" ");
                console.log(" ");
                */
                if (dataRes.product === undefined) {
                    zapResult.rawData = new Error(dataRes.response_text);
                    zapResult.offer = "-1";
                }
                else {
                    zapResult.success = true;
                    zapResult.title = dataRes.product.title;
                    zapResult.offer = String(dataRes.product.offer_price).toString();
                    //zapResult.thumbImg = '';
                }
                console.log("zapResult ::: DONE :::", zapResult);
                resolve(zapResult);
            });
        });
    }
}
exports.ZiffitAppApi = ZiffitAppApi;

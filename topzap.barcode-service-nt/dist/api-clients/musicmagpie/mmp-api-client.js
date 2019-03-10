"use strict";
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const zap_offer_model_1 = require("@app/models/zap-ts-models/zap-offer.model");
const mmp_app_worker_1 = require("./mmp-app-worker");
const vendor_list_1 = require("../vendor-list");
class MmpAppApi {
    constructor() {
        this.vendorId = vendor_list_1.Vendors.MagpieApp;
        this.name = "MagpieAppApi";
        this.worker = new mmp_app_worker_1.MmpAppWorker();
    }
    getOffer(barcode) {
        let scope = this;
        function getBasketToken() {
            return new Promise((resolve, reject) => {
                this.worker.generateToken().then(token => {
                    resolve(token);
                });
            });
        }
        return new Promise((resolve, reject) => {
            let zapResult = new zap_offer_model_1.VendorOfferData("");
            this.worker.search(barcode).then((res) => {
                console.log(`Miner '${scope.name}' Result ::`, res);
                console.log("MMP ::: DD ::", res);
                zapResult.vendorId = vendor_list_1.Vendors.MagpieApp; //res.GetValuationApps2Result.id;
                if (res !== null && res.GetValuationApps2Result !== null && res.GetValuationApps2Result.price > 0) {
                    //zapResult.success = true;
                    zapResult.title = res.GetValuationApps2Result.description;
                    zapResult.offer = String(res.GetValuationApps2Result.price).toString();
                }
                resolve(zapResult);
            });
        });
    }
}
exports.MmpAppApi = MmpAppApi;

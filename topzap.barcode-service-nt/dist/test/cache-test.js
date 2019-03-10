"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const bid_cache_db_1 = require("../app/database/bid-cache-db");
const zap_offer_model_1 = require("../app/models/zap-ts-models/zap-offer.model");
let bidCacheDb = new bid_cache_db_1.BidCacheDb();
/*
code: string,
public vendorId: number = -1,
public title: string = "",
public offer
*/
let data = new zap_offer_model_1.VendorOfferData("123456", 10, "My Fat Ass", "12.56");
bidCacheDb.cacheOffer(data).then(res => {
    console.log("Offer Cached!");
});

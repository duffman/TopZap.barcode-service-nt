/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {BidCacheDb} from "../app/database/bid-cache-db";
import {VendorOfferData} from "../app/models/zap-ts-models/zap-offer.model";

let bidCacheDb = new BidCacheDb();

/*
code: string,
public vendorId: number = -1,
public title: string = "",
public offer
*/

let data = new VendorOfferData(
	"123456",
	10,
	"My Fat Ass",
	"12.56"
);

bidCacheDb.cacheOffer(data).then(res => {
	console.log("Offer Cached!");
});
"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const db_kernel_1 = require("@lib/putte-db/db-kernel");
const zap_offer_model_1 = require("@app/models/zap-ts-models/zap-offer.model");
const logger_1 = require("@cli/logger");
const settings_1 = require("@app/settings");
// This made total sense while I was drunk, remove this entire class if it ever yields an error...
class BidCacheDb {
    constructor() {
        this.tableName = "cached_vendor_offers";
        this.db = new db_kernel_1.DbManager();
    }
    cacheOffer(data) {
        let sql = `INSERT INTO ${this.tableName} (
					id,
					code,
					vendor_id,
					title,
					offer,
					cached_time
				) VALUES (
					NULL,
					'${data.code}',
					'${data.vendorId}',
					'${data.title}',
					'${data.offer}',
					CURRENT_TIMESTAMP
				)`;
        //		console.log("SQL ::", sql);
        return new Promise((resolve, reject) => {
            return this.db.dbQuery(sql).then(res => {
                // This is a fire and forget thing, I really had to write that, you SHALL NOT leave a class without comments
                // and you shall NOT leave your mastercard in the card machine at your local pub!!!
                console.log("cacheOffer :: affectedRows ::", res.affectedRows);
                resolve();
            }).catch(err => {
                logger_1.Logger.logError("BidCacheDb :: cacheOffer :: err ::", err);
                reject(err);
            });
        });
    }
    getVendorOffer(code, vendorId, ttl = settings_1.Settings.Caching.CacheTTL) {
        console.log("########### doGetOffers :: >> getCachedOffers");
        let sql = `
			SELECT DISTINCT
				*
			FROM
				${this.tableName}
			WHERE
				code='${code}'
				AND
				vendor_id='${vendorId}'
				AND
				${this.tableName}.cached_time > NOW() - INTERVAL ${ttl} MINUTE
		`;
        // console.log("SQL ::", sql);
        return new Promise((resolve, reject) => {
            return this.db.dbQuery(sql).then(res => {
                let data = null;
                if (res.haveAny()) {
                    let row = res.safeGetFirstRow();
                    console.log("row ::", row);
                    let vendorId = row.getValAsNum("vendor_id");
                    let offer = row.getValAsStr("offer");
                    let code = row.getValAsStr("code");
                    let title = row.getValAsStr("title");
                    data = new zap_offer_model_1.VendorOfferData(code, vendorId, title, offer);
                    data.accepted = true;
                    data.code = code;
                }
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
}
exports.BidCacheDb = BidCacheDb;

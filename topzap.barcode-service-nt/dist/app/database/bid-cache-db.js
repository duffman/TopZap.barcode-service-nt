'use strict';Object.defineProperty(exports,'__esModule',{value:true});const db_kernel_1=require('../../lib/putte-db/db-kernel');const zap_offer_model_1=require('../models/zap-ts-models/zap-offer.model');const logger_1=require('../cli/logger');const settings_1=require('../settings');class BidCacheDb{constructor(){this.db=new db_kernel_1.DbManager();}cacheOffer(data){let sql=`INSERT INTO cached_offers (
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
				)`;console.log('SQL ::',sql);this.db.dbQuery(sql).then(res=>{console.log('cacheOffer :: affectedRows ::',res.affectedRows);}).catch(err=>{logger_1.Logger.logError('BidCacheDb :: cacheOffer :: err ::',err);});}getCachedOffers(code){console.log('########### doGetOffers :: >> getCachedOffers');let sql=`
			SELECT
				*
			FROM
				cached_offers
			WHERE
				code='${code}'
				AND
				cached_offers.cached_time > NOW() - INTERVAL ${settings_1.Settings.Caching.CacheTTL} MINUTE
		`;return new Promise((resolve,reject)=>{return this.db.dbQuery(sql).then(res=>{let result=null;if(res.haveAny()){result=new Array();}for(let row of res.result.dataRows){let vendorId=row.getValAsNum('vendor_id');let offer=row.getValAsStr('offer');let code=row.getValAsStr('code');let title=row.getValAsStr('title');let data=new zap_offer_model_1.VendorOfferData(vendorId,title,offer);data.accepted=true;data.code=code;result.push(data);}resolve(result);}).catch(err=>{reject(err);});});}}exports.BidCacheDb=BidCacheDb;
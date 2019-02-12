'use strict';Object.defineProperty(exports,'__esModule',{value:true});const request=require('request');const vendor_offer_result_1=require('../../app/models/zap-ts-models/vendor-offer-result');const ziffit_app_worker_1=require('./ziffit-app-worker');const vendor_list_1=require('../vendor-list');class ZiffitAppApi{constructor(){this.name='ZiffitAppApi';this.worker=new ziffit_app_worker_1.ZiffitAppWorker();}getOffer(barcode){let scope=this;return new Promise((resolve,reject)=>{let jar=request.jar();let zapResult=new vendor_offer_result_1.VendorOfferResult();zapResult.vendorId=vendor_list_1.Vendors.ZiffitApp;this.worker.search(barcode).then(dataRes=>{console.log(`Miner '${scope.name}' Result ::`,dataRes);if(dataRes.product===undefined){zapResult.rawData=new Error(dataRes.response_text);zapResult.offer='-1';}else{zapResult.success=true;zapResult.title=dataRes.product.title;zapResult.offer=String(dataRes.product.offer_price).toString();}console.log('zapResult ::: DONE :::',zapResult);resolve(zapResult);});});}}exports.ZiffitAppApi=ZiffitAppApi;
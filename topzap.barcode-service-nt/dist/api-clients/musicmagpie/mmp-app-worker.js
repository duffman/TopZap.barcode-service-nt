'use strict';Object.defineProperty(exports,'__esModule',{value:true});const request=require('request');const uuidv1=require('uuid/v1');const mmp_app_data_1=require('./mmp-app-data');class MmpAppWorker{constructor(){this.baseRequest=request.defaults({'baseUrl':'https://apps.musicmagpie.co.uk/wcfservice/','headers':{'User-Agent':'musicMagpie/36.3 (iPhone; iOS 10.1.1; Scale/2.00)','Content-Type':'application/json','Accept':'application/json','Platform':'iOS','Model':'iPhone','OSVersion':'10.1.1'},'gzip':true,'json':true});}generateToken(){return new Promise((resolve,reject)=>{this.baseRequest.post('token.svc/tokenW/GenerateTokenApps',{'body':{'c':1,'d':uuidv1()}},function optionalCallback(err,httpResponse,body){if(err){reject(err);}else{let resultData;try{resultData=mmp_app_data_1.Convert.toMusicMagpieTokenResult(body);resolve(resultData.GenerateTokenAppsResult);}catch(err){resolve(null);}}});});}async search(ean,token=null){if(token===null){token=await this.generateToken();}return new Promise((resolve,reject)=>{this.baseRequest.post('mmuk_valuation.svc/mmuk_valuationW/GetValuationApps2',{'body':{'booScan':false,'intCondition':5,'intSource':107,'strBarcode':ean},'headers':{'token':token}},function optionalCallback(err,httpResponse,body){if(err){reject(err);}else{let resultData;try{resultData=mmp_app_data_1.Convert.toMusicMagpieResult(body);resolve(resultData);}catch(err){resolve(null);}}});});}getBasket(token){return new Promise((resolve,reject)=>{this.baseRequest.post('mmuk_valuation.svc/mmuk_valuationW/GetBasketFull',{'headers':{'token':token}},function optionalCallback(err,httpResponse,body){if(err){reject(err);}else{console.log(body);let resultData;try{resultData=mmp_app_data_1.Convert.toMusicMagpieBasketResult(body);resolve(resultData);}catch(err){resolve(null);}}});});}removeFromBasket(itemId,token){return new Promise((resolve,reject)=>{this.baseRequest.post('mmuk_valuation.svc/mmuk_valuationW/RemoveBasketItem',{'body':{'intBasketItemID':itemId},'headers':{'token':token}},function optionalCallback(err,httpResponse,body){if(err){reject(err);}else{let resultData;try{resultData=mmp_app_data_1.Convert.toMusicMagpieBasketRemoveResult(body);resolve(resultData);}catch(err){resolve(null);}}});});}}exports.MmpAppWorker=MmpAppWorker;
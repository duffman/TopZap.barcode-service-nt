'use strict';Object.defineProperty(exports,'__esModule',{value:true});const request=require('request');const ziffit_app_data_1=require('./ziffit-app-data');class ZiffitAppWorker{constructor(){this.baseRequest=request.defaults({'baseUrl':'https://www.ziffit.com/zmapi/','headers':{'release_number':1,'Accept-Encoding':'gzip, deflate','Accept':'application/json','content-type':'application/x-www-form-urlencoded','User-Agent':'Ziffit/7096 (iPhone; iOS 10.1.1; Scale/2.00)','Accept-Language':'en-UK','zma_req_token':'cJ/kkK0k/NWU3P!pKWO'},'auth':{'user':'mediabuyer','pass':'password'},'gzip':true});}search(ean,cartId=undefined){let payload={'form':{'product_id':ean,'cart_id':cartId}};return new Promise((resolve,reject)=>{this.baseRequest.post('product',payload,(err,httpResponse,jsonData)=>{if(err){reject(err);}else{let resultData;try{resultData=ziffit_app_data_1.Convert.toZiffitResult(jsonData);resolve(resultData);}catch(err){resolve(null);}}});});}getCart(cartId){return new Promise((resolve,reject)=>{this.baseRequest.get('cart',{'qs':{'cart_id':cartId}},function optionalCallback(err,httpResponse,jsonData){if(err){reject(err);}else{let resultData;try{resultData=ziffit_app_data_1.Convert.toZiffitCartResult(jsonData);resolve(resultData);}catch(err){resolve(null);}}});});}removeFromCart(ean,cartId){return new Promise((resolve,reject)=>{this.baseRequest.delete('removeItem',{'qs':{'cart_id':cartId,'product_id':ean}},function optionalCallback(err,httpResponse,jsonData){if(err){reject(err);}else{let resultData;try{resultData=ziffit_app_data_1.Convert.toZiffitCartResult(jsonData.replace('"shoppingcart"','"cart"'));resolve(resultData);}catch(err){resolve(null);}}});});}}exports.ZiffitAppWorker=ZiffitAppWorker;
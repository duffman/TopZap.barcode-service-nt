'use strict';Object.defineProperty(exports,'__esModule',{value:true});const mmp_app_worker_1=require('./mmp-app-worker');async function testData(){var worker=new mmp_app_worker_1.MmpAppWorker();var basketToken=await worker.generateToken();console.log(basketToken);await worker.search('0045496590451',basketToken);var basket=await worker.getBasket(basketToken);console.log(basket);var item=basket.GetBasketFullResult.find(o=>o.barcode==='5060102954781');if(item){await worker.removeFromBasket(item.id,basketToken);}var item=basket.GetBasketFullResult.find(o=>o.barcode==='0887195000424');if(item){await worker.removeFromBasket(item.id,basketToken);}basket=await worker.getBasket(basketToken);console.log(basket);}testData();
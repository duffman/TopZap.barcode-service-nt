'use strict';Object.defineProperty(exports,'__esModule',{value:true});const wbg_app_worker_1=require('./wbg-app-worker');async function testData(){var worker=new wbg_app_worker_1.WbgAppWorker();var sign=await worker.signin(undefined);console.log(sign);await worker.search('0045496590444',sign);var basket=await worker.getBasket(sign);console.log('ITEMS :: ',basket.data.items);return;var item=basket.data.items.find(o=>o.barcode==='5060102954781');if(item){await worker.removeFromBasket(item.id,sign);}var item=basket.data.items.find(o=>o.barcode==='0887195000424');if(item){await worker.removeFromBasket(item.id,sign);}basket=await worker.getBasket(sign);console.log(basket.data.items);}testData();
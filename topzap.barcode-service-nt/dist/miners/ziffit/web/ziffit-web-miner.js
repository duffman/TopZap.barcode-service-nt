'use strict';Object.defineProperty(exports,'__esModule',{value:true});const miner_core_1=require('../../../app/core/miner-core');const ziffit_web_worker_1=require('./ziffit-web-worker');const logger_1=require('../../../app/cli/logger');const miner_data_models_1=require('../../../app/core/miner-data-models');const vendor_list_1=require('../../vendor-list');const VENDOR_ID=vendor_list_1.Vendors.ZiffitWeb;class ZiffitWebMiner extends miner_core_1.MinerCore{constructor(){super();this.worker=new ziffit_web_worker_1.ZiffitWebWorker();}processQueue(dataItems){let scope=this;function updateWorkQueueItem(updateItem){return new Promise((resolve,reject)=>{scope.updateWorkQueueItem(updateItem).then(res=>{resolve(res);}).catch(err=>{reject(err);});});}function ziffitSearch(dataItem){logger_1.Logger.logGreen('Getting price for barcode from somewhere...');return new Promise((resolve,reject)=>{scope.worker.search(dataItem.barcode,undefined).then(res=>{resolve(res);}).catch(err=>{logger_1.Logger.logError('DoWork() :: Something bad happened ::',err);reject(err);});});}async function process(){for(let i=0;i<dataItems.length;i++){let item=dataItems[i];logger_1.Logger.logCyan('processQueue() :: Barcode to Process ::',item.barcode);let searchResult=await ziffitSearch(item);logger_1.Logger.logGreen('searchResult ::',searchResult);let updateItem=new miner_data_models_1.MinerWorkItemUpdate();updateItem.id=item.id;if(searchResult===null||searchResult===undefined||!searchResult.accepted){updateItem.accepted=false;}else{updateItem.accepted=true;updateItem.price=searchResult.offerPrice;updateItem.message=searchResult.description;}let updateDataRes=await updateWorkQueueItem(updateItem);logger_1.Logger.logYellow('updateDataRes ::',updateDataRes);}}return new Promise((resolve,reject)=>{process().then(()=>{logger_1.Logger.logGreen('processQueue() :: Done');resolve();});});}execute(queueSize=100){let scope=this;return new Promise((resolve,reject)=>{scope.getVendorQueue(VENDOR_ID,queueSize).then(data=>{return data;}).then(dataItems=>{scope.processQueue(dataItems).then(res=>{logger_1.Logger.logGreen('processQueue :: done ::',res);resolve(true);}).catch(err=>{logger_1.Logger.logError('processQueue :: error ::',err);reject(err);});});});}}exports.ZiffitWebMiner=ZiffitWebMiner;let args=process.argv.slice(2);if(args.length>0){let miner=new ZiffitWebMiner();let size=10;logger_1.Logger.logGreen('Queue Size ::',size);miner.execute(size);}
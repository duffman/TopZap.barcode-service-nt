'use strict';Object.defineProperty(exports,'__esModule',{value:true});const app_1=require('./app/app');const logger_1=require('./app/cli/logger');const wbg_api_client_1=require('./miners/api/wbg-api-client');let debug=false;if(!debug){logger_1.Logger.logGreen('NORMAL MODE');let app=new app_1.Application(debug);}else{logger_1.Logger.logYellow('DEBUG MODE');let cp=new wbg_api_client_1.WbgAppApi();cp.getOffer('819338020068').then(res=>{console.log('YEAH',res);}).catch(err=>{console.log('FUCK YOU',err);});}
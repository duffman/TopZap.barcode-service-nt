'use strict';Object.defineProperty(exports,'__esModule',{value:true});const logger_1=require('./app/cli/logger');const app_1=require('./app/app');let serviceName='WeBuyGames';let serviceKey='wbg';logger_1.Logger.logPurple('Starting Service ::',serviceName);let app=new app_1.Application(true,serviceKey);
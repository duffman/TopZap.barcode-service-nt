'use strict';Object.defineProperty(exports,'__esModule',{value:true});const Pusher=require('pusher');const drone_config_1=require('./drone-config');class DroneServer{constructor(){console.log('DroneServer...');this.pusher=new Pusher({appId:drone_config_1.DroneConfig.Development.app_id,key:drone_config_1.DroneConfig.Development.key,secret:drone_config_1.DroneConfig.Development.secret,useTLS:true,cluster:drone_config_1.DroneConfig.Development.cluster});}emitToChannel(channel,event,data){this.pusher.trigger(channel,event,{message:data});}subscribe(channel){return null;}}exports.DroneServer=DroneServer;let server=new DroneServer();server.emitToChannel('getBid','data',{balle:true});
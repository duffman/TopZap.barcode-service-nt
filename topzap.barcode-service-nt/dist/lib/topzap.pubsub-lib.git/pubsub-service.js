'use strict';Object.defineProperty(exports,'__esModule',{value:true});const Pubnub=require('pubnub');const pubsub_config_1=require('./pubsub-config');const pubsub_logger_1=require('./pubsub-logger');const events_1=require('events');const pubsub_message_1=require('./pubsub-message');const pubsub_message_2=require('./pubsub-message');const publub_channels_1=require('./publub-channels');class PubsubService{constructor(autoSubscribe=false){this.autoSubscribe=autoSubscribe;this.eventEmitter=new events_1.EventEmitter();this.pubnub=new Pubnub({publishKey:pubsub_config_1.PubsubConfig.PublishKey,subscribeKey:pubsub_config_1.PubsubConfig.SubscribeKey});this.listen();}publish(channel,data){return new Promise((resolve,reject)=>{let publishConfig={channel:channel,message:JSON.stringify(data)};this.pubnub.publish(publishConfig).then(res=>{console.log('publish :: res ::',res);resolve(res);}).catch(err=>{console.log('publish :: err ::',err);reject(err);});});}subscribe(channels){this.pubnub.subscribe({channels:channels});}unsubscribe(channels){this.pubnub.unsubscribe({channels:channels});}listen(){this.pubnub.addListener({status:statusEvent=>{if(statusEvent.category==='PNConnectedCategory'){console.log('statusEvent.category === PNConnectedCategory');}console.log('statusEvent.category ::',statusEvent);},message:msg=>{this.handleMessage(msg);},presence:presenceEvent=>{}});}connectSessionId(sessId){this.sessionId=sessId;this.subscribe([sessId]);}emitNewBidMessage(data,sessId){let message=new pubsub_message_2.PubsubMessage(pubsub_message_1.MessageTypes.NewBid,data,sessId);return this.publish(publub_channels_1.Channels.NewBidChannel,message);}emitGetBidRequest(code,sessId){let data={code:code};let message=new pubsub_message_2.PubsubMessage(pubsub_message_1.MessageTypes.GetBid,data,sessId);return this.publish(publub_channels_1.Channels.GetBidChannel,message);}emitGetBestBasketMessage(sessId){let message=new pubsub_message_2.PubsubMessage(pubsub_message_1.MessageTypes.GetBestBasket,{},sessId);return this.publish(sessId,message);}handleMessage(msg){pubsub_logger_1.PLogger.debug('msg.channel ::',msg.channel);pubsub_logger_1.PLogger.debug('msg.message',msg.message);pubsub_logger_1.PLogger.debug('msg.publisher ::',msg.publisher);console.log(' ');console.log(' ');let data={};try{let messData=msg.message;data=JSON.parse(messData);}catch(ex){pubsub_logger_1.PLogger.error('Error parsing message ::',msg);}console.log('******* DATA ::',data.type);switch(msg.channel){case publub_channels_1.Channels.BasketChannel:this.eventEmitter.emit(publub_channels_1.Channels.BasketChannel,data);break;case publub_channels_1.Channels.GetBidChannel:this.eventEmitter.emit(publub_channels_1.Channels.GetBidChannel,data);break;case publub_channels_1.Channels.NewBidChannel:this.eventEmitter.emit(publub_channels_1.Channels.NewBidChannel,data);break;case publub_channels_1.Channels.ServiceChannel:this.eventEmitter.emit(publub_channels_1.Channels.ServiceChannel,data);break;}}onBasketMessage(listener){this.eventEmitter.addListener(publub_channels_1.Channels.BasketChannel,listener);}onGetBidRequest(listener){this.eventEmitter.addListener(publub_channels_1.Channels.GetBidChannel,listener);}onNewBidMessage(listener){this.eventEmitter.addListener(publub_channels_1.Channels.NewBidChannel,listener);}onServiceMessage(listener){this.eventEmitter.addListener(publub_channels_1.Channels.ServiceChannel,listener);}}exports.PubsubService=PubsubService;
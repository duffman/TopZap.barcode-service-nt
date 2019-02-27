'use strict';Object.defineProperty(exports,'__esModule',{value:true});const Scaledrone=require('scaledrone-node');const channel_config_1=require('../app/channels.git/channel-config');const channel_events_1=require('../app/channels.git/channel-events');const logger_1=require('../app/cli/logger');this.serviceDrone=new Scaledrone('T4eUrfAVDy7ODb0h');let serviceChannel=this.serviceDrone.subscribe(channel_config_1.MessagePipes.Service);let serviceChannel2=this.serviceDrone.subscribe('register');this.serviceDrone.on('open',data=>{console.log('OPEN ::',data);this.serviceDrone.publish({room:'register',message:{hello:'world',year:2019}});});this.serviceDrone.on('data',data=>{console.log('DATA ::',data);});serviceChannel.on(channel_events_1.ChannelEvents.ChannelOpen,error=>{if(error){logger_1.Logger.logError('Error :: serviceChannel ::',error);return;}let message={name:'kalle'};console.log('Publishing register message ::',message);this.serviceDrone.publish({room:'register',message:message});this.serviceDrone.publish({room:'register',message:message});this.serviceDrone.publish({room:channel_config_1.MessagePipes.Service,message:message});});serviceChannel.on(channel_events_1.ChannelEvents.ChannelData,data=>{console.log('DATA ::',data);console.log('NAME ::',this.apiClient.name);});
'use strict';Object.defineProperty(exports,'__esModule',{value:true});const Scaledrone=require('scaledrone-node');const channel_events_1=require('./channels.git/channel-events');let drone=new Scaledrone('wnQpxZuJgaUChUul');let room1=drone.subscribe('kalle1');let room2=drone.subscribe('kalle2');room1.on(channel_events_1.ChannelEvents.ChannelData,data=>{console.log('BALLE1 ::',data);});room2.on(channel_events_1.ChannelEvents.ChannelData,data=>{console.log('BALLE2 ::',data);});drone.on('open',()=>{drone.publish({room:'kalle1','message':'kalle'});});
'use strict';Object.defineProperty(exports,'__esModule',{value:true});const channel_info_1=require('./channel-info');class ChannelNames{}ChannelNames.Basket='Basket';ChannelNames.Bids='Bids';ChannelNames.Service='Service';exports.ChannelNames=ChannelNames;class MessagePipes{}MessagePipes.GetBid='getBid';MessagePipes.GetReview='getReview';MessagePipes.GetBestBasket='getBest';MessagePipes.NewBid='newBid';MessagePipes.Service='service';exports.MessagePipes=MessagePipes;class ChannelConfig{constructor(){this.channels=new Array();this.channels.push(new channel_info_1.DroneChannel(ChannelNames.Basket,'wnQpxZuJgaUChUul','z2EWz4zXdNr63YUiwavv5kpdahRYfXxC'));this.channels.push(new channel_info_1.DroneChannel(ChannelNames.Bids,'0RgtaE9UstNGjTmu','Q8ZcaFTMQTReingz9zNJmKjuVgnVYvYe'));this.channels.push(new channel_info_1.DroneChannel(ChannelNames.Service,'T4eUrfAVDy7ODb0h','RyoF4UUVHCw6jEU1JtscfhNGaGsJrgF7'));}getChannelData(name){let result;for(const channel of this.channels){if(channel.name===name){result=channel;break;}}return result;}}exports.ChannelConfig=ChannelConfig;
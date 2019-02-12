'use strict';Object.defineProperty(exports,'__esModule',{value:true});const http=require('http');const https=require('https');const cli_color_log_1=require('../cli/cli-color-log');const purl_type_1=require('./purl-type');class PHttpClient{static getHttps(url){return new Promise((resolve,reject)=>{https.get(url,res=>{let source='';res.setEncoding('utf8');res.on('data',buffer=>{source+=buffer.toString();});res.on('end',()=>{resolve(source);});}).on('error',e=>{reject(e);});});}static getHttp(url){return new Promise((resolve,reject)=>{http.get(url,res=>{let source='';res.setEncoding('utf8');res.on('data',buffer=>{source+=buffer.toString();});res.on('end',()=>{resolve(source);});}).on('error',e=>{reject(e);});});}static getUrlType(url){let result=purl_type_1.PUrlType.Unknown;url=url.toLowerCase();let pUrl=url.substr(0,url.indexOf('://'));switch(pUrl){case'http':result=purl_type_1.PUrlType.Http;break;case'https':result=purl_type_1.PUrlType.Https;break;}return result;}static urlTypeToString(urlType){let result='Unknown';switch(urlType){case purl_type_1.PUrlType.Http:result='PUrlType.Http';break;case purl_type_1.PUrlType.Https:result='PUrlType.Https';break;}return result;}static getUrlContents(url){let scope=this;let urlType=PHttpClient.getUrlType(url);let contents;return new Promise((resolve,reject)=>{let urlTypeStr=PHttpClient.urlTypeToString(urlType);if(urlType==purl_type_1.PUrlType.Http){PHttpClient.getHttp(url).then(contents=>{resolve(contents);}).catch(err=>{this.logError('getUrlContents (HTTP) : '+err.code,url);reject(err);});}else if(urlType==purl_type_1.PUrlType.Https){PHttpClient.getHttps(url).then(contents=>{resolve(contents);}).catch(err=>{this.logError('getUrlContents (HTTPS) : '+err.code,url);reject(err);});}else{let error=new Error('Unknown protocol');reject(error);}});}static conntionRefused(err){return err!=null&&err.code=='ECONNREFUSED';}static logError(logMessage,logData=null){cli_color_log_1.CliColorLog.LogBrightRed(logMessage,logData);}}exports.PHttpClient=PHttpClient;
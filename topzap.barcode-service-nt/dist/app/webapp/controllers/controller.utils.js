'use strict';Object.defineProperty(exports,'__esModule',{value:true});class ControllerUtils{static internalError(res,message='Internal Server Error KaZap/0.9'){res.writeHead(501,{'Content-Type':'text/plain'});res.end(message);}}exports.ControllerUtils=ControllerUtils;
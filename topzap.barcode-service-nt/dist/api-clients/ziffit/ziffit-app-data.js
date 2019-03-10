"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Converts JSON strings to/from your types
var Convert;
(function (Convert) {
    function toZiffitResult(json) {
        return JSON.parse(json);
    }
    Convert.toZiffitResult = toZiffitResult;
    function toZiffitCartResult(json) {
        return JSON.parse(json);
    }
    Convert.toZiffitCartResult = toZiffitCartResult;
    function ziffitResultToJson(value) {
        return JSON.stringify(value);
    }
    Convert.ziffitResultToJson = ziffitResultToJson;
    function ziffitCartResultToJson(value) {
        return JSON.stringify(value);
    }
    Convert.ziffitCartResultToJson = ziffitCartResultToJson;
})(Convert = exports.Convert || (exports.Convert = {}));

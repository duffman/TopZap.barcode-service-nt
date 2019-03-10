"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Converts JSON strings to/from your types
var Convert;
(function (Convert) {
    function toMomoxResult(json) {
        return json;
    }
    Convert.toMomoxResult = toMomoxResult;
    function toMomoxCartResult(json) {
        return json;
    }
    Convert.toMomoxCartResult = toMomoxCartResult;
    function momoxResultToJson(value) {
        return JSON.stringify(value);
    }
    Convert.momoxResultToJson = momoxResultToJson;
    function momoxCartResultToJson(value) {
        return JSON.stringify(value);
    }
    Convert.momoxCartResultToJson = momoxCartResultToJson;
})(Convert = exports.Convert || (exports.Convert = {}));

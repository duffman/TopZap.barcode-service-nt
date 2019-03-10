"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MagpieSearchResult {
    constructor(result, appToken) {
        this.result = result;
        this.appToken = appToken;
    }
}
exports.MagpieSearchResult = MagpieSearchResult;
var Convert;
(function (Convert) {
    function toMusicMagpieTokenResult(json) {
        return json;
    }
    Convert.toMusicMagpieTokenResult = toMusicMagpieTokenResult;
    function toMusicMagpieResult(json) {
        return json;
    }
    Convert.toMusicMagpieResult = toMusicMagpieResult;
    function toMusicMagpieBasketResult(json) {
        return json;
    }
    Convert.toMusicMagpieBasketResult = toMusicMagpieBasketResult;
    function toMusicMagpieBasketRemoveResult(json) {
        return json;
    }
    Convert.toMusicMagpieBasketRemoveResult = toMusicMagpieBasketRemoveResult;
    function musicMagpieTokenResultToJson(value) {
        return JSON.stringify(value);
    }
    Convert.musicMagpieTokenResultToJson = musicMagpieTokenResultToJson;
    function musicMagpieResultToJson(value) {
        return JSON.stringify(value);
    }
    Convert.musicMagpieResultToJson = musicMagpieResultToJson;
    function musicMagpieBasketResultToJson(value) {
        return JSON.stringify(value);
    }
    Convert.musicMagpieBasketResultToJson = musicMagpieBasketResultToJson;
    function musicMagpieBasketRemoveResultToJson(value) {
        return JSON.stringify(value);
    }
    Convert.musicMagpieBasketRemoveResultToJson = musicMagpieBasketRemoveResultToJson;
})(Convert = exports.Convert || (exports.Convert = {}));

"use strict";
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const momox_app_data_1 = require("./momox-app-data");
/**
 * @class Momox Worker Class
 * Implementation of Momox API, usess request.session to persist current session when working with cart
 */
class MomoxMobileWorker {
    /**
     * Creates baseRequest used to communicate with Momox API
     * @constructor
     */
    constructor(debugMode = false) {
        this.debugMode = debugMode;
        this.baseRequest = request.defaults({
            'baseUrl': 'https://api.momox.co.uk/api/v3/',
            'headers': {
                'User-Agent': 'momoxSwift/3.5.1 (com.momox.momox; build:9; iOS 10.1.1) Alamofire/4.7.3',
                'X-API-TOKEN': '88cbc56dadd49640d9b9618cc49573afaa70dbcf',
                'X-MARKETPLACE-ID': 'momox_uk'
            },
            'gzip': true,
            'json': true
        });
    }
    /**
     * Get contents of the cart in MomoxCartResult object
     * @param {request.jar}  cookieJar - Cookie Jar used for current session
     */
    getCart(cookieJar) {
        return new Promise((resolve, reject) => {
            this.baseRequest.get(`cart/`, {
                'jar': cookieJar
            }, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    reject(err);
                }
                else {
                    let resultData;
                    try {
                        resultData = momox_app_data_1.Convert.toMomoxCartResult(body);
                        resolve(resultData);
                    }
                    catch (err) {
                        resolve(null);
                    }
                }
            });
        });
    }
    /**
     * Add item to cart
     * @param {string}  ean - EAN of the item to be added to cart
     * @param {request.jar}  cookieJar - Cookie Jar used for current session
     */
    addToCart(ean, cookieJar) {
        return new Promise((resolve, reject) => {
            this.baseRequest.post('cart/items/', {
                'body': {
                    'ean': ean
                },
                'jar': cookieJar
            }, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    reject(err);
                }
                else {
                    let resultData;
                    try {
                        resultData = momox_app_data_1.Convert.toMomoxCartResult(body);
                        resolve(resultData);
                    }
                    catch (err) {
                        resolve(null);
                    }
                }
            });
        });
    }
    /**
     * Search for item and get item details
     * @param {string}  ean - EAN of the item
     * @param {request.jar}  cookieJar - Optional Cookie Jar parameter if you want to reuse existing session
     * @return {Promise<MomoxResult>} Returns promisse for MomoxResult object containing item details if available
     */
    search(ean, cookieJar = null) {
        let scope = this;
        if (cookieJar === null) {
            cookieJar = request.jar();
        }
        return new Promise((resolve, reject) => {
            this.baseRequest.get(`find/media/ean/${ean}/`, {
                'jar': cookieJar
            }, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    reject(err);
                }
                else {
                    let resultData;
                    try {
                        //console.log("### err ::", err);
                        //console.log("### httpResponse ::", httpResponse);
                        console.log("### body ::", body);
                        resultData = momox_app_data_1.Convert.toMomoxResult(body);
                        resolve(resultData);
                        /*
                        if (scope.debugMode) {
                            let debugDelay = PRand.randRange(1000, 10000);
                            setTimeout(function(){ resolve(resultData);}, debugDelay);
                        } else {
                        }
                        */
                    }
                    catch (err) {
                        resolve(null);
                    }
                }
            });
        });
    }
    /**
     * Remove item from cart
     * @param {string}  ean - EAN of the item to be removed from cart
     * @param {request.jar}  cookieJar - Cookie Jar used for the current session
     */
    removeFromCart(ean, cookieJar) {
        return new Promise((resolve, reject) => {
            this.baseRequest.delete(`cart/items/${ean}/`, {
                'jar': cookieJar
            }, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    reject(err);
                }
                else {
                    let resultData;
                    try {
                        resultData = momox_app_data_1.Convert.toMomoxCartResult(body);
                        resolve(resultData);
                    }
                    catch (err) {
                        resolve(null);
                    }
                }
            });
        });
    }
}
exports.MomoxMobileWorker = MomoxMobileWorker;

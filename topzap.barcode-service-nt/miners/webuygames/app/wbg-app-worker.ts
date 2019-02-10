/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import * as request from "request";
import * as uuidv1 from "uuid/v1";
import { IZapMinerCore }          from "@core/zap-miner-core";
import {Convert, WeBuyGamesBasketResult, WeBuyGamesResult, WeBuyGamesSignResult} from "./webuygames-data";

/**
 * @class WeBuyGames Worker Class
 * Implementation of WeBuyGames API, usess WeBuyGamesSignResult object to persist current session when working with basket
 */

export class WbgAppWorker implements IZapMinerCore {
	baseRequest: request;

	/**
	 * Creates baseRequest used to communicate with WeBuyGames API
	 * @constructor
	 */
	constructor() {
		this.baseRequest = request.defaults({
			'url': 'https://api.revivalbooks.co.uk',
			'headers': {
				'User-Agent': 'WeBuyGames/3.1.8 (com.revival.webuygames; build:1; iOS 10.1.1) Alamofire/4.0.1',
				'Accept-Language': 'en-UK',
				'Accept-Encoding': 'gzip;q=1.0, compress;q=0.5',
				'Connection': 'keep-alive'
			},
			'qs': {
				'key': 'Y!VQpwYy4*nDp6m8dn7j',
				'site': 2
			},
			'gzip': true,
			'json': true
		});
	}

	/**
	 * Signup exploiting Facebook signin method, using random number as email
	 * @param {WeBuyGamesBasketResult}  basket - Optional basket to be asigned to account, if not provided new one is created
	 * @return {Promise<string>} Returns promisse for WeBuyGamesSignResult object containing details used to persist current session
	 */
	public async signin(basket: WeBuyGamesBasketResult): Promise<WeBuyGamesSignResult> {
		if(!basket) {
			basket = await this.getBasket(undefined);
		}
		return new Promise<WeBuyGamesSignResult>((resolve, reject) => {
			this.baseRequest.post({
				'qs': {
					'method': 'Facebook'
				}, 'form': {
					'basketId': basket.data.id,
					'basketKey': basket.data.basketKey,
					'siteId': 2,
					'forename': 'John',
					'surname': 'Doe',
					'email': Math.random().toString()
				}
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: WeBuyGamesSignResult;
					try {
						resultData = Convert.toWeBuyGamesSignResult(body);
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
	 * Get basket details
	 * @param {WeBuyGamesSignResult}  sign - Optional sign parameter, should be provided if already signed in
	 * @return {Promise<WeBuyGamesBasketResult>} Returns promisse for WeBuyGamesBasketResult object containing details of items added to basket
	 */
	public getBasket(sign: WeBuyGamesSignResult): Promise<WeBuyGamesBasketResult> {
		let basketId;
		let basketKey;
		let customerId;
		let customerKey;
		if(sign){
			basketId = sign.data.basketId;
			basketKey = sign.data.basketKey;
			customerId = sign.data.customerId;
			customerKey = sign.data.customerKey;
		}
		return new Promise((resolve, reject) => {
			this.baseRequest.get({
				'qs':{
					'method': 'Basket',
					'basketId': basketId,
					'basketKey': basketKey,
					'customerId': customerId,
					'customerKey': customerKey
				}}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: WeBuyGamesBasketResult;
					try {
						resultData = Convert.toWeBuyGamesBasketResult(body);
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
	 * Search for item, get item details and add item to basket
	 * @param {string}  ean - EAN of the item
	 * @param {WeBuyGamesSignResult}  sign - Optional sign parameter if you want to reuse existing session, if sign is not provided, new sign will be generated and new basket will be created
	 * @return {Promise<WeBuyGamesResult>} Returns promisse for WeBuyGamesResult object containing item details if available
	 */
	public async search(ean: string, sign: WeBuyGamesSignResult): Promise<WeBuyGamesResult> {
		if(!sign){
			let basket = await this.getBasket(undefined);
			sign = await this.signin(basket);
		}
		return new Promise((resolve, reject) => {
			this.baseRequest.post({
				'qs': {
					'method': 'BasketAdd'
				}, 'form': {
					'basketId': sign.data.basketId,
					'basketKey': sign.data.basketKey,
					'customerId': sign.data.customerId,
					'customerKey': sign.data.customerKey,
					'site': 2,
					'query': ean
				}
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: WeBuyGamesResult;
					try {
						resultData = Convert.toWeBuyGamesResult(body);
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
	 * Remove item from basket
	 * @param {number}  itemId - ID of the item to be removed from basket, must get it from WeBuyGamesBasketResult
	 * @param {WeBuyGamesSignResult}  sign - sign object used for the current basket session
	 * @return {Promise<WeBuyGamesBasketResult>} Returns promisse for WeBuyGamesBasketResult object containing details about items left in basket
	 */
	public removeFromBasket(itemId: number, sign: WeBuyGamesSignResult): Promise<WeBuyGamesBasketResult> {
		return new Promise((resolve, reject) => {
			this.baseRequest.delete({
				'qs':{
					'method': 'BasketItem',
					'itemId': itemId,
					'basketId': sign.data.basketId,
					'basketKey': sign.data.basketKey,
					'customerId': sign.data.customerId,
					'customerKey': sign.data.customerKey
				}}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: WeBuyGamesBasketResult;
					try {
						resultData = Convert.toWeBuyGamesBasketResult(body);
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
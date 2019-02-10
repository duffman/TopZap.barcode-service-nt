/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import * as request               from "request";
import * as uuidv1                from "uuid/v1";
import { IZapMinerCore }          from "@core/zap-miner-core";
import { TokenResult }            from "./mmp-app-data";
import { MagpieResult }           from "./mmp-app-data";
import { MagpieBasketResult}      from "./mmp-app-data";
import { MagpieRemoveResult }     from "./mmp-app-data";
import { Convert }                from "./mmp-app-data";

/**
 * @class MusicMagpie Worker Class
 * Implementation of MusicMagpie API, usess basket token to persist current session when working with basket
 */
export class MmpAppWorker implements IZapMinerCore {
	baseRequest: request;

	/**
	 * Creates baseRequest used to communicate with MusicMagpie API
	 * @constructor
	 */
	constructor() {
		this.baseRequest = request.defaults({
			'baseUrl': 'https://apps.musicmagpie.co.uk/wcfservice/',
			'headers': {
				'User-Agent': 'musicMagpie/36.3 (iPhone; iOS 10.1.1; Scale/2.00)',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Platform': 'iOS',
				'Model': 'iPhone',
				'OSVersion': '10.1.1'
			},
			'gzip': true,
			'json': true
		});
	}

	/**
	 * Create new basket and get basket token
	 * @return {Promise<string>} Returns basket token string
	 */
	public generateToken(): Promise<string> {
		return new Promise((resolve, reject) => {
			this.baseRequest.post('token.svc/tokenW/GenerateTokenApps', {
				'body': {
					'c': 1,
					'd': uuidv1()
				}
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: TokenResult;
					try {
						resultData = Convert.toMusicMagpieTokenResult(body);
						resolve(resultData.GenerateTokenAppsResult);
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
	 * @param {string}  token - Optional token parameter if you want to reuse existing session, if token is not provided, new basket will be created
	 * @return {Promise<MagpieResult>} Returns promisse for MagpieResult object containing item details if available and basket details
	 */
	public async search(ean: string, token: string = null): Promise<MagpieResult> {
		if (token === null) {
			token = await this.generateToken();
		}

		return new Promise((resolve, reject) => {
			this.baseRequest.post('mmuk_valuation.svc/mmuk_valuationW/GetValuationApps2', {
				'body': {
					'booScan': false,
					'intCondition': 5,
					'intSource': 107,
					'strBarcode': ean
				},
				'headers': {
					'token': token
				}
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: MagpieResult;
					try {
						resultData = Convert.toMusicMagpieResult(body);
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
	 * Get contents of the basket in MagpieBasketResult object
	 * @param {string}  token - token for the current session
	 * @return {Promise<MagpieBasketResult>} Returns promisse for MagpieBasketResult object containing details of all items in basket
	 */
	public getBasket(token: string): Promise<MagpieBasketResult> {
		return new Promise((resolve, reject) => {
			this.baseRequest.post('mmuk_valuation.svc/mmuk_valuationW/GetBasketFull', {
				'headers': {
					'token': token
				}
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					console.log(body);
					let resultData: MagpieBasketResult;
					try {
						resultData = Convert.toMusicMagpieBasketResult(body);
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
	 * @param {number}  itemId - ID of the item to be removed from cart, must get it from MagpieBasketResult
	 * @param {string}  token - token used for the current session
	 * @return {Promise<MagpieRemoveResult>} Returns promisse for MagpieRemoveResult object containing details about status of the operation
	 */
	public removeFromBasket(itemId: number, token: string): Promise<MagpieRemoveResult> {
		return new Promise((resolve, reject) => {
			this.baseRequest.post('mmuk_valuation.svc/mmuk_valuationW/RemoveBasketItem', {
				'body': {
					'intBasketItemID': itemId
				},
				'headers': {
					'token': token
				}
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: MagpieRemoveResult;
					try {
						resultData = Convert.toMusicMagpieBasketRemoveResult(body);
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
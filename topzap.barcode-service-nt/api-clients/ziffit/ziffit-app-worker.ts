/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import * as request               from "request";
import { Convert }                from "./ziffit-app-data";
import { ZiffitResult }           from "./ziffit-app-data";
import { ZiffitCartResult}        from "./ziffit-app-data";

/**
 * @class Ziffit Worker Class
 * Implementation of Ziffit API, usess cartId to persist current session when working with cart
 */
export class ZiffitAppWorker {
	baseRequest: request;

	/**
	 * Creates baseRequest used to communicate with Ziffit API
	 * @constructor
	 */
	constructor() {
		this.baseRequest = request.defaults({
			'baseUrl': 'https://www.ziffit.com/zmapi/',
			'headers': {
				'release_number': 1,
				'Accept-Encoding': 'gzip, deflate',
				'Accept': 'application/json',
				'content-type': 'application/x-www-form-urlencoded',
				'User-Agent': 'Ziffit/7096 (iPhone; iOS 10.1.1; Scale/2.00)',
				'Accept-Language': 'en-UK',
				'zma_req_token': 'cJ/kkK0k/NWU3P!pKWO'
			},
			'auth': {
				'user': 'mediabuyer',
				'pass': 'password'
			},
			'gzip': true
		});
	}

	/**
	 * Search for item and get item details
	 * @param {string}  ean - EAN of the item
	 * @param {string}  cartId - Optional cartId parameter if you want to reuse existing session, if cartId is not provided, new cart will be created
	 * @return {Promise<ZiffitResult>} Returns promisse for ZiffitResult object containing item details if available and cart details
	 */
	public search(ean: string, cartId: string = undefined): Promise<ZiffitResult> {
		let payload = {
			'form': {
				'product_id': ean,
				'cart_id': cartId
			}
		};

		return new Promise((resolve, reject) => {
			this.baseRequest.post('product', payload, (err, httpResponse, jsonData) => {
				if (err) {
					reject(err);
				} else {
					let resultData: ZiffitResult;
					try {
						resultData = Convert.toZiffitResult(jsonData);
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
	 * Get contents of the cart in ZiffitCartResult object
	 * @param {string}  cartId - cartId for the current session
	 * @return {Promise<ZiffitCartResult>} Returns promisse for ZiffitCartResult object containing details of all items in cart
	 */
	public getCart(cartId: string): Promise<ZiffitCartResult> {
		return new Promise((resolve, reject) => {
			this.baseRequest.get('cart', {
				'qs': {
					'cart_id': cartId
				}
			}, function optionalCallback(err, httpResponse, jsonData) {
				if (err) {
					reject(err);
				} else {
					let resultData: ZiffitCartResult;
					try {
						resultData = Convert.toZiffitCartResult(jsonData);
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
	 * Remove item from cart
	 * @param {string}  ean - EAN of the item to be removed from cart
	 * @param {string}  cartId - cartId used for the current session
	 * @return {Promise<ZiffitCartResult>} Returns promisse for ZiffitCartResult object containing details of all items in cart
	 */
	public removeFromCart(ean: string, cartId: string): Promise<ZiffitCartResult> {
		return new Promise((resolve, reject) => {
			this.baseRequest.delete('removeItem', {
				'qs': {
					'cart_id': cartId,
					'product_id': ean
				}
			}, function optionalCallback(err, httpResponse, jsonData) {
				if (err) {
					reject(err);
				} else {
					let resultData: ZiffitCartResult;
					try {
						resultData = Convert.toZiffitCartResult(jsonData.replace('"shoppingcart"','"cart"'))
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
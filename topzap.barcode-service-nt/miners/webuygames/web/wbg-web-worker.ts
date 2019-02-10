/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import * as request from "request";
import * as uuidv1 from "uuid/v1";
import { IZapMinerCore }          from "@core/zap-miner-core";
import {Convert, WeBuyGamesResult, WeBuyGamesCartResult, WeBuyGamesCartSummary} from "./wbg-web-data";

export class WbgWebWorker implements IZapMinerCore {
	baseRequest: request;

	constructor() {
		this.baseRequest = request.defaults({
			'baseUrl': 'https://www.webuygames.co.uk/',
			'headers': {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
				'Accept-Language': 'en-UK',
				'Accept-Encoding': 'gzip, deflate, br',
				'Connection': 'keep-alive'
			},
			'gzip': true
		});
	}

	public search(ean: string, cookieJar: request.jar): Promise<WeBuyGamesResult> {
		if(!cookieJar){
			cookieJar = request.jar()
		}
		return new Promise((resolve, reject) => {
			this.baseRequest.post('wp-admin/admin-ajax.php', {
				'form': {
					'action': 'addItemToBasket',
					'query': ean
				},
				'json': true,
				'jar': cookieJar
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: WeBuyGamesResult;
					try {
						resultData = Convert.toWeBuyGamesResult(body['view']);
						resolve(resultData);
					}
					catch (err) {
						resolve(null);
					}
				}
			});
		});
	}

	public getCart(cookieJar: request.jar): Promise<WeBuyGamesCartResult> {
		return new Promise((resolve, reject) => {
			this.baseRequest.get('selling-basket', {
				'jar': cookieJar
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: WeBuyGamesCartResult;
					try {
						resultData = Convert.toWeBuyGamesCartResult(body);
						resolve(resultData);
					}
					catch (err) {
						resolve(null);
					}
				}
			});
		});
	}

	public removeFromCart(rowId: number, cookieJar: request.jar): Promise<WeBuyGamesCartSummary> {
		return new Promise((resolve, reject) => {
			this.baseRequest.post('wp-admin/admin-ajax.php', {
				'form': {
					'action': 'removeItemFromBasket',
					'id': rowId
				},
				'json': true,
				'jar': cookieJar
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: WeBuyGamesCartSummary;
					try {
						resultData = Convert.toWeBuyGamesCartSummary(body);
						resolve(resultData);
					}
					catch (err) {
						resolve(null);
					}
				}
			});
		});
	}

	public emptyCart(cookieJar: request.jar): Promise<WeBuyGamesCartSummary> {
		return new Promise((resolve, reject) => {
			this.baseRequest.post('wp-admin/admin-ajax.php', {
				'form': {
					'action': 'emptyBasket'
				},
				'json': true,
				'jar': cookieJar
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: WeBuyGamesCartSummary;
					try {
						resultData = Convert.toWeBuyGamesCartSummary(body);
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
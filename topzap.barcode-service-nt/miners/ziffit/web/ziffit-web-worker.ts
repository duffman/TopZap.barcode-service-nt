/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as request               from "request";
import { IZapMinerCore }          from "@core/zap-miner-core";
import {Convert, ZiffitTokenResult} from "./ziffit-web-data";
import { ZiffitResult }           from "./ziffit-web-data";
import { ZiffitCartResult }       from "./ziffit-web-data";
import { ZiffitCartRemoveResult } from "./ziffit-web-data";

export class ZiffitWebWorker  implements IZapMinerCore {
	baseRequest: request;

	constructor() {
		this.baseRequest = request.defaults({
			'baseUrl': 'https://api.ziffit.com/',
			'headers': {
				'Accept-Encoding': 'gzip, deflate',
				'Accept': '*/*',
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
				'Accept-Language': 'en-UK'
			},
			'gzip': true,
			'json': true
		});
	}

	public getToken(): Promise<string> {
		return new Promise((resolve, reject) => {
			this.baseRequest.get('authorization-token', function optionalCallback(err, httpResponse, jsonData) {
				if (err) {
					reject(err);
				} else {
					let resultData: ZiffitTokenResult;
					try {
						resultData = Convert.toZiffitTokenResult(jsonData)
						resolve(resultData.token);
					}
					catch (err) {
						resolve(null);
					}
				}
			});
		});
	}

	public async search(ean: string, token: string = null): Promise<ZiffitResult> {
		if (token === null){
			token = await this.getToken();
		}

			return new Promise((resolve, reject) => {
			this.baseRequest.post('basket/items', {
				'body': {
					'ean': ean
				},
				'headers': {
					'authorization': 'Bearer ' + token
				}
			}, function optionalCallback(err, httpResponse, jsonData) {
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

	public getCart(cartId: string, token: string): Promise<ZiffitCartResult> {
		return new Promise((resolve, reject) => {
			this.baseRequest.get('basket', {
				'headers': {
					'authorization': 'Bearer ' + token
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

	public removeFromCart(itemId: string, token: string): Promise<ZiffitCartRemoveResult> {
		return new Promise((resolve, reject) => {
			this.baseRequest.delete(`basket/items/${itemId}`, {
				'headers': {
					'authorization': 'Bearer ' + token
				}
			}, function optionalCallback(err, httpResponse, jsonData) {
				if (err) {
					reject(err);
				} else {
					let resultData: ZiffitCartRemoveResult;
					try {
						resultData = Convert.toZiffitCartRemoveResult(jsonData);
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
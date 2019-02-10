/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import * as request               from "request";
import { IZapMinerCore }          from "@core/zap-miner-core";
import { MomoxResult }            from "./momox-data";
import { MomoxCartResult }        from "./momox-data";
import { MomoxDataConvert  }      from "./momox-data";


export class MomoxWebWorker  implements IZapMinerCore {
	baseUrl: string;
	baseRequest: request;

	constructor() {
		this.baseUrl = 'https://api.momox.co.uk/';
		this.baseRequest = request.defaults({
			'baseUrl': this.baseUrl + 'api/v3/',
			'headers': {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
				'X-API-TOKEN': '2231443b8fb511c7b6a0eb25a62577320bac69b6',
				'X-MARKETPLACE-ID': 'momox_uk'
			},
			'gzip': true,
			'json': true
		});
	}

	public getCart(cookieJar: request.jar): Promise<MomoxCartResult> {
		return new Promise((resolve, reject) => {
			this.baseRequest.get(`cart/`, {
				'jar': cookieJar
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: MomoxCartResult;
					try {
						resultData = MomoxDataConvert.toMomoxCartResult(JSON.stringify(body));
						resolve(resultData);
					}
					catch (err) {
						resolve(null);
					}
				}
			});
		});
	}

	public addToCart(ean: string, cookieJar: request.jar): Promise<MomoxCartResult> {
		return new Promise((resolve, reject) => {
			this.baseRequest.post('cart/items/', {
				'body': {
					'ean': ean
				},
				'jar': cookieJar
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: MomoxCartResult;
					try {
						resultData = MomoxDataConvert.toMomoxCartResult(JSON.stringify(body));
						resolve(resultData);
					}
					catch (err) {
						resolve(null);
					}
				}
			});
		});
	}

	public search(ean: string, cookieJar: request.jar): Promise<MomoxResult> {
		if(!cookieJar){
			cookieJar = request.jar();
		}
		return new Promise((resolve, reject) => {
			this.baseRequest.get(`find/media/ean/${ean}/`, {
				'jar': cookieJar
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: MomoxResult;
					try {
						resultData = MomoxDataConvert.toMomoxResult(JSON.stringify(body));
						resolve(resultData);
					}
					catch (err) {
						resolve(null);
					}
				}
			});
		});
	}

	public removeFromCart(ean: string, cookieJar: request.jar): Promise<MomoxCartResult> {
		return new Promise((resolve, reject) => {
			this.baseRequest.delete(`cart/items/${ean}/`, {
				'jar': cookieJar
			},function optionalCallback(err, httpResponse, body) {
				if (err) {
					reject(err);
				} else {
					let resultData: MomoxCartResult;
					try {
						resultData = MomoxDataConvert.toMomoxCartResult(JSON.stringify(body));
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
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import * as request from "request";
import * as cheerio from "cheerio";
import { IZapMinerCore }          from "@core/zap-miner-core";
import {Convert, MMPBasketResult, Item} from "./mmp-web-data";
import './number.extensions';


export class MmpWebWorker implements IZapMinerCore {
	baseRequest: request;

	constructor() {
		this.baseRequest = request.defaults({
			'baseUrl': 'https://www.musicmagpie.co.uk/start-selling/',
			'followRedirect': false,
			'headers': {
				'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
				'accept-encoding': 'gzip, deflate',
				'accept-language': 'en-UK',
				'accept': '*/*'
			},
			'gzip': true
		});
	}

	public addToCart(ean: string, cookieJar: request.jar): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.baseRequest.head('', {
			'qs': {
				'__EVENTTARGET': 'ctl00$ctl00$ctl00$ContentPlaceHolderDefault$mainContent$tabbedMediaVal2018_12$getValSmall',
				'ctl00$ctl00$ctl00$ContentPlaceHolderDefault$mainContent$tabbedMediaVal2018_12$txtBarcode': ean
			},
			'jar': cookieJar
		}, function optionalCallback(err, httpResponse) {
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			});
		});
	}

	public async search(ean: string): Promise<Item> {
		var jar = request.jar();
		await this.addToCart(ean, jar);
		var cartData = await this.getCart(jar);
		return new Promise((resolve, reject) => {
			if(!cartData || !cartData.items || !cartData.items.length){
				resolve(null);
			}
			resolve(cartData.items[0]);
		});
	}

	public getCart(cookieJar: request.jar): Promise<MMPBasketResult> {
		return new Promise((resolve, reject) => {
			this.baseRequest.get('basket-media', {
				'jar': cookieJar
			}, function optionalCallback(err, httpResponse, html) {
				if (err) {
					reject(err);
				} else {
					let resultData: MMPBasketResult;
					try {
						resultData = Convert.toMusicMagpieBasketResult(html);
						resolve(resultData);
					}
					catch (err) {
						resolve(null);
					}
				}
			});
		});
	}

	public async removeFromCart(ean: string, cart: MMPBasketResult, jar: request.jar): Promise<MMPBasketResult> {
		if(!cart){
			cart = await this.getCart(jar);
		}
		var item = cart.items.find(o => o.ean === ean);
		if(!item){
			return cart;
		}
		return new Promise((resolve, reject) => {
			this.baseRequest.post('basket-media', {
				'form': {
					'__EVENTTARGET': `ctl00$ctl00$ctl00$ContentPlaceHolderDefault$mainContent$BasketContents_17$rptBasket$ctl${item.no.pad(2)}$btnDelete`,
					'__VIEWSTATE': cart.viewstate
				},
				'jar': jar
			}, function optionalCallback(err, httpResponse, html) {
				if (err) {
					reject(err);
				} else {
					let resultData: MMPBasketResult;
					try {
						resultData = Convert.toMusicMagpieBasketResult(html);
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
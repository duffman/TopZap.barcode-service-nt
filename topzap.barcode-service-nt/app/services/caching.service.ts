/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import {IVendorOfferData} from '@app/models/zap-ts-models/zap-offer.model';
import {Logger} from '@cli/logger';
import {GetOffersInit} from '@app/models/zap-ts-models/messages/get-offers-messages';

export class CachingService {

	/**
	 * Attempt to getAs cached offers
	 * @param {string} code
	 * @param {string} sessId
	 * @param {boolean} fallbalOnSearch
	 *
	private getCachedOffers(code: string, sessId: string, fallbalOnSearch: boolean = true): void {
		let scope = this;
		console.log("########### doGetOffers :: " + code + " :: " + sessId);

		this.cachedOffersDb.getCachedOffers(code).then(res => {
			return res;
		}).catch(err => {
			Logger.logFatalError("BasketWsApiController :: doGetOffers :: Catch ::", err);
			return null;

		}).then((cachedRes: Array<IVendorOfferData>) => {
			//
			// Simulate Messages Sent using a regular lookup
			//
			if (cachedRes && cachedRes.length > 0) {
				console.log(`${this.constructor.name} getCachedOffers`);

				scope.emitGetOffersInit(sessId, new GetOffersInit(cachedRes.length));

				console.log("########### doGetOffers :: after : emitGetOffersInit");

				for (const entry of cachedRes) {
					scope.onMessVendorOffer(sessId, entry);
					//scope.emitVendorOffer(sessId, entry);
				}
				scope.emitOffersDone(sessId)

				//
				// Lookup offers through the price service
				//
			} else if (fallbalOnSearch) {
				scope.emitGetOffersMessage(code, sessId); // Call price service
			}
		});
	}
	*/
}

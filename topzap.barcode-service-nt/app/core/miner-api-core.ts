/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IZapApiClient }          from "@core/zap-miner-api";
import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';

export class MinerApiCore implements IZapApiClient {
	name: string;

	constructor() {}

	public getOffer(barcode: string): Promise<IVendorOfferData> {
		return null;
	}
}

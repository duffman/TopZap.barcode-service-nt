/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';

export interface IZapApiClient {
	name: string;
	getOffer(barcode: string): Promise<IVendorOfferData>;
}

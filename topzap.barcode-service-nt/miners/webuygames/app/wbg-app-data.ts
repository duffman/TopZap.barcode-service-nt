export interface WeBuyGamesBasketResult {
    status: string;
    data:   WbgAppBasketData;
}

export interface WbgAppSignResult {
    status: string;
    data:   WbgAppSignData;
}

export interface WbgAppSignData {
	customerKey:          string;
	customerId:           number;
	basketId:             number;
	basketKey:            string;
}

export interface WbgAppBasketData {
    id:                    number;
    basketKey:             string;
    items:                 BasketItem[];
    survey:                string;
    surveyVersion:         string;
    discountThreshold:     string;
    discountAmount:        string;
    voucherAmount:         number;
    voucherId:             number;
    voucherCode:           string;
    minimumBasketValue:    number;
    voucherModifyMinValue: number;
}

export interface BasketItem {
    id?:                 number;
    itemName?:           string;
    imageUrl?:           string;
    barcode?:            string;
    itemPrice?:          number;
}

export interface WbgAppResult {
    status?: string;
    data?:   WbgAppData;
}

export interface WbgAppData {
    Item?:          Item;
    BasketMessage?: null;
}

export interface Item {
    id?:                 number;
    site?:               number;
    Basket?:             WbgAppBasket;
    itemName?:           string;
    imageUrl?:           string;
    barcode?:            string;
    asin?:               string;
    itemCondition?:      string;
    itemWeight?:         number;
    itemHeight?:         number;
    itemLength?:         number;
    itemWidth?:          number;
    itemPrice?:          string;
    dateAdded?:          DateAdded;
    ProductGroup?:       ProductGroup;
    hardwarePlatform?:   string;
    salesRank?:          number;
    lowestPrice?:        number;
    averagePrice?:       number;
    totalOffers?:        number;
    totalUsedOffers?:    number;
    source?:             string;
    method?:             string;
    OldBasket?:          null;
    storage?:            null;
    prescanResult?:      number;
    freeItem?:           boolean;
    monsoonOrderItemId?: null;
    deleted?:            boolean;
    deletedDate?:        null;
    releaseDate?:        DateAdded;
}

export interface WbgAppBasket {
    id?:             number;
    Site?:           Site;
    Customer?:       null;
    Courier?:        null;
    ipAddress?:      string;
    basketKey?:      string;
    dateCreated?:    DateAdded;
    dateUpdated?:    DateAdded;
    Voucher?:        null;
    Charity?:        null;
    charityPercent?: number;
    charityGiftAid?: number;
    fasttrack?:      number;
    completed?:      number;
    acceptedInRow?:  number;
    rejectedInRow?:  number;
    _Items?:         Items;
    utmSource?:      null;
    utmMedium?:      null;
    awinAwc?:        null;
}

export interface Site {
    id?:   number;
    name?: string;
}

export interface Items {
}

export interface DateAdded {
    date?:          string;
    timezone_type?: number;
    timezone?:      string;
}

export interface ProductGroup {
    __initializer__?:             null;
    __cloner__?:                  null;
    __isInitialized__?:           boolean;
    id?:                          number;
    typeName?:                    string;
    ordinal?:                     number;
    allowed?:                     number;
    monsoonAllowed?:              boolean;
    disputeReturnAmount?:         number;
    warehouseAllowed?:            boolean;
    warehouseIconLocation?:       string;
    warehouseActiveIconLocation?: string;
}

export namespace Convert {
	export function toWeBuyGamesBasketResult(json: any): WeBuyGamesBasketResult {
		return json;
	}

	export function toWeBuyGamesResult(json: any): WbgAppResult {
		return json;
	}

	export function toWeBuyGamesSignResult(json: any): WbgAppSignResult {
		return json;
	}

	export function weBuyGamesBasketResultToJson(value: WeBuyGamesBasketResult): string {
		return JSON.stringify(value);
	}

	export function weBuyGamesResultToJson(value: WbgAppResult): string {
		return JSON.stringify(value);
	}

	export function weBuyGamesSignResultToJson(value: WbgAppSignResult): string {
		return JSON.stringify(value);
	}
}
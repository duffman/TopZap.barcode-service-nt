
export interface MomoxResult {
	id?:               string;
	title?:            string;
	image_url?:        string;
	description?:      string;
	meta?:             Meta;
	price?:            string;
	currency?:         string;
	warehouse_status?: number;
	demand_rating?:    number;
}

export interface MomoxCartResult {
    marketplace?:                         string;
    last_update?:                         string;
    currency?:                            string;
    good_items_ab_test_bonus_percentage?: null;
    good_items_ab_test_bonus_value?:      null;
    items?:                               Item[];
}

export interface Item {
    product_pk?: string;
    price?:      string;
    price_date?: string;
    quantity?:   number;
    product?:    Product;
}

export interface Product {
    id?:          string;
    title?:       string;
    image_url?:   string;
    description?: string;
    meta?:        Meta;
}

export interface Meta {
	ean?:      string;
	type?:     string;
	edition?:  null;
	asin?:     string;
	platform?: string;
	creator?:  string;
	binding?:  null;
}

// Converts JSON strings to/from your types
export namespace Convert {
	export function toMomoxResult(json: any): MomoxResult {
		return json;
	}

	export function toMomoxCartResult(json: any): MomoxCartResult {
		return json;
	}

	export function momoxResultToJson(value: MomoxResult): string {
		return JSON.stringify(value);
	}
	
	export function momoxCartResultToJson(value: MomoxCartResult): string {
		return JSON.stringify(value);
	}
}

export interface ZiffitResult {
    response_code?: number;
    response_text?: string;
    product?:       Product;
    cart?:          Cart;
}

export interface ZiffitCartResult {
    response_code?: number;
    cart?:          Cart;
}

export interface Cart {
    created_stamp?:     string;
    cart_id?:           string;
    products?:          Product[];
    promos?:            any[];
    total_offer_price?: number;
}

export interface Product {
    product_id?:   string;
    title?:        string;
    offer_price?:  number;
    weight?:       number;
    product_type?: string;
}

// Converts JSON strings to/from your types
export namespace Convert {
	export function toZiffitResult(json: string): ZiffitResult {
		return JSON.parse(json);
	}
	
	export function toZiffitCartResult(json: string): ZiffitCartResult {
		return JSON.parse(json);
	}

	export function ziffitResultToJson(value: ZiffitResult): string {
		return JSON.stringify(value);
	}
	
	export function ziffitCartResultToJson(value: ZiffitCartResult): string {
		return JSON.stringify(value);
	}
}
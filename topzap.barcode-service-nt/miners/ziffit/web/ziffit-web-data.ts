
export interface ZiffitTokenResult {
    token?:         string;
    message?:       string;
}

export interface ZiffitResult {
    eventMessages?: string[];
    errorMessages?: string[];
    basketItemId?:  string;
    description?:   string;
    ean?:           string;
    itemType?:      string;
    offerPrice?:    number;
    accepted?:      boolean;
}

export interface CartItem {
    basketItemId?: string;
    barcodeLogId?: string;
    weight?:       number;
    description?:  string;
    ean?:          string;
    itemType?:     string;
    offerPrice?:   number;
}

export interface ZiffitCartResult {
    basketId?:         number;
    algorithmVersion?: string;
    promotionValue?:   number;
    items?:            CartItem[];
    size?:             number;
}

export interface ZiffitCartRemoveResult {
    exceptionMessage?: string;
    eventMessages?:    string[];
    errorMessages?:    string[];
}

// Converts JSON strings to/from your types
export namespace Convert {
    export function toZiffitTokenResult(json: any): ZiffitTokenResult {
        return json;
    }

    export function toZiffitResult(json: any): ZiffitResult {
        return json;
    }

    export function toZiffitCartResult(json: any): ZiffitCartResult {
        return json;
    }

    export function toZiffitCartRemoveResult(json: any): ZiffitCartRemoveResult {
        return json
    }

    export function ziffitTokenResultToJson(value: ZiffitTokenResult): string {
        return JSON.stringify(value);
    }

    export function ziffitResultToJson(value: ZiffitResult): string {
        return JSON.stringify(value);
    }

    export function ziffitCartResultToJson(value: ZiffitCartResult): string {
        return JSON.stringify(value);
    }

    export function ziffitCartRemoveResultToJson(value: ZiffitCartRemoveResult): string {
        return JSON.stringify(value);
    }
}
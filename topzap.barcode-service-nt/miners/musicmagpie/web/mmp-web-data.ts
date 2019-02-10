import * as cheerio from "cheerio";


export interface MMPBasketResult {
    items?:     Item[];
	viewstate?: string;
}

export interface Item {
	no?:    number;
    ean?:   string;
    title?: string;
    price?: number;
}

export namespace Convert {
	export function toMusicMagpieBasketResult(html: string): MMPBasketResult {
		var doc = cheerio.load(html);
		var output = {
			'items': [],
			'viewstate': doc('#__VIEWSTATE').attr('value')
		};
		doc('div.rowDetails_Media').each(function(i, mediaEl) {
			var item = {
				'no': i,
				'ean': doc('div.col_Code', mediaEl).text().trim(),
				'title': doc('div.col_Title', mediaEl).text().trim(),
				'price': Number(doc(`div.col_Price`, mediaEl).text())
			}
			output['items'].push(item);
		});
		return output;
	}
}
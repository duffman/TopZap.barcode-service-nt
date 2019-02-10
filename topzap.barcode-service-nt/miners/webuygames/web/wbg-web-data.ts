import * as cheerio from "cheerio";


export interface WeBuyGamesCartSummary {
	summary: string;
	price:   string;
	noItems: number;
}

export interface WeBuyGamesCartResult {
	items: WeBuyGamesResult[]
}

export interface WeBuyGamesResult {
    rowId: number;
    ean:   string;
    title: string;
    price: number;
}

export namespace Convert {
	export function toWeBuyGamesCartSummary(json: any): WeBuyGamesCartSummary {
		return json;
	}

	export function toWeBuyGamesCartResult(html: string): WeBuyGamesCartResult {
		var output = {
			'items': []
		}
		var doc = cheerio.load(html);
		doc('tr.trrow').each(function(row) {
			output['items'].push(Convert.toWeBuyGamesResult(row.html()));
		});
		return output;
	}

	export function toWeBuyGamesResult(html: string): WeBuyGamesResult {
		if(html.includes('Sorry, we did not recognise the item you added')){
			return null;
		}
		var doc = cheerio.load('<table>' + html + '</table>');
		return {
			'rowId': Number(doc('input.rowId').attr('value')),
			'ean': doc('td.tdisbn').text(),
			'title': doc('td.tdtitle').text(),
			'price': Number(doc('td.tdval').text().trim().replace('£',''))
		};
	}
}
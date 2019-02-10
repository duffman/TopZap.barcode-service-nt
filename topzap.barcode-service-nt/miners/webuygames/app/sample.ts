import { WbgAppWorker}           from "./wbg-app-worker";
import {WeBuyGamesBasketResult, WbgAppResult, WbgAppSignResult} from "./wbg-app-data";


async function testData(){
	var worker = new WbgAppWorker();


	// Signin so you are able to add multiple items to basket
	var sign = await worker.signin(undefined);
	console.log(sign);


	await worker.search('0045496590444', sign);

	/*/ Add some items to basket
	await worker.search('0045496590451', sign);

	await worker.search('0045496590444', sign);
	await worker.search('5390102520885', sign);
	await worker.search('5060102954781', sign);
	await worker.search('0887195000424', sign);
	await worker.search('5060528030373', sign);
	*/

	// Get basket after adding new items
	var basket = await worker.getBasket(sign);
	console.log("ITEMS :: ", basket.data.items);

	return;

	// Remove few items
	var item = basket.data.items.find(o => o.barcode === '5060102954781');
	if(item){
		await worker.removeFromBasket(item.id, sign);
	}

	var item = basket.data.items.find(o => o.barcode === '0887195000424');
	if(item){
		await worker.removeFromBasket(item.id, sign);
	}

	// Get basket after item removal
	basket = await worker.getBasket(sign);
	console.log(basket.data.items);
}

testData();
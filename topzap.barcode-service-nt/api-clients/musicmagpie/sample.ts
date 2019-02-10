import { MmpAppWorker}           from "./mmp-app-worker";
import {MagpieResult, MagpieBasketResult} from "./mmp-app-data";


async function testData(){
	var worker = new MmpAppWorker();


	// Create new basket
	var basketToken = await worker.generateToken();
	console.log(basketToken);


	/*/ Add some items
	await worker.search('0045496590444', basketToken);
	await worker.search('5390102520885', basketToken);
	await worker.search('5060102954781', basketToken);
	await worker.search('0887195000424', basketToken);
	await worker.search('5060528030373', basketToken);
	*/
	await worker.search('0045496590451', basketToken);



	// Get WbgAppBasket listing
	var basket = await worker.getBasket(basketToken);
	console.log(basket);


	// Remove some items from the basket (have to find item id first)
	var item = basket.GetBasketFullResult.find(o => o.barcode === '5060102954781');
	if(item){
		await worker.removeFromBasket(item.id, basketToken);
	}
	var item = basket.GetBasketFullResult.find(o => o.barcode === '0887195000424');
	if(item){
		await worker.removeFromBasket(item.id, basketToken);
	}


	// Get basket after item removal
	basket = await worker.getBasket(basketToken);
	console.log(basket);
}

testData();
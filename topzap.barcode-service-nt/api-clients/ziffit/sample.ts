import { ZiffitAppWorker}           from "./ziffit-app-worker";
import {ZiffitResult, ZiffitCartResult} from "./ziffit-app-data";


async function testData(){
	var worker = new ZiffitAppWorker();


	// Add some items (Add first one without cart_id, to get a new cart)
	var result = await worker.search('0045496590444', undefined);
	await worker.search('5390102520885', result.cart.cart_id);
	await worker.search('5060102954781', result.cart.cart_id);
	await worker.search('0887195000424', result.cart.cart_id);
	await worker.search('5060528030373', result.cart.cart_id);


	// Get Cart listing
	var cart = await worker.getCart(result.cart.cart_id);
	console.log("\n\nCart before removal\n");
	console.log(cart.cart.products);


	// Remove some items from cart
	await worker.removeFromCart('5060102954781', result.cart.cart_id);
	await worker.removeFromCart('0887195000424', result.cart.cart_id);


	// Get cart after item removal
	cart = await worker.getCart(result.cart.cart_id);
	console.log("\n\nCart after removal\n");
	console.log(cart.cart.products);
}

testData();
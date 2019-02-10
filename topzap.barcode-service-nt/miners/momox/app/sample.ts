import { MomoxMobileWorker}           from "./momox-app-worker";
import {MomoxResult, MomoxCartResult} from "./momox-app-data";
import * as request from "request";


async function testData(){
	var worker = new MomoxMobileWorker();


	// Create new session
	var cookieJar = request.jar();


	/*/ Add some items
	await worker.addToCart('0045496590444', cookieJar);
	await worker.addToCart('5390102520885', cookieJar);
	await worker.addToCart('5060102954781', cookieJar);
	await worker.addToCart('0887195000424', cookieJar);
	await worker.addToCart('5060528030373', cookieJar);
		*/

	await worker.addToCart('5060102954781', cookieJar);


	// Get Cart listing
	var cart = await worker.getCart(cookieJar);
	console.log(cart);


	// Remove some items from cart
	await worker.removeFromCart('5060102954781', cookieJar);
	await worker.removeFromCart('0887195000424', cookieJar);


	// Get cart after item removal
	cart = await worker.getCart(cookieJar);
	console.log(cart);
}

testData();
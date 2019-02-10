/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import {MomoxAppApi} from '@apiClient/momox-api-client';
import {WbgAppApi} from '@apiClient/wbg-api-client';
import {WbgAppWorker} from '@miners/webuygames/app/wbg-app-worker';

/*
var worker = new WbgAppWorker();

async function testData() {
	// Signin so you are able to add multiple items to basket
	var sign = await worker.signin(undefined);
	console.log(sign);
}

testData();
*/

let code = "0045496590451";
//let miner1 = new MomoxAppApi();
let miner2 = new WbgAppApi();

/*
miner1.getOffer(code).then(res => {
	console.log("1 :: RESOLVE ::", res);
	console.log(" ");
	console.log(" ");

}).catch(err => {
	console.log("1 :: ERR ::", err);
	console.log(" ");
	console.log(" ");
});
*/

miner2.getOffer(code).then(res => {
	console.log("2 :: RESOLVE ::", res);
	console.log(" ");
	console.log(" ");

}).catch(err => {
	console.log("2 :: ERR ::", err);
	console.log(" ");
	console.log(" ");
});
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import {PriceController} from '@webapp/controllers/price-controller';
import {MmpAppApi} from '@apiClient/mmp-api-client';
import {ZiffitAppApi} from '@apiClient/ziffit-api-client';
import {MomoxAppApi} from '@apiClient/momox-api-client';
import {WbgAppApi} from '@apiClient/wbg-api-client';
import {IZapMiner} from '@core/zap-miner';
import {IZapApiClient} from '@core/zap-miner-api';

let controller = new PriceController();


let wbgMiner = new WbgAppApi();
let momoxMiner = new MomoxAppApi(true);
let ziffitMiner = new ZiffitAppApi();
let magpieMiner = new MmpAppApi();

let zapMiners = new Array<IZapApiClient>();

zapMiners.push(magpieMiner);
//zapMiners.push(momoxMiner);
//zapMiners.push(wbgMiner);
//zapMiners.push(ziffitMiner);

controller.setApiClients(zapMiners);
//5390102520885
// 0045496590451
controller.doSearch("0045496590451").then(res => {
	console.log("#### RES ::", res);
});
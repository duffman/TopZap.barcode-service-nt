/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { WebApp }                 from "@webapp/webapp";
import { Logger }                 from "@cli/logger";
import { Constants }              from "@inc/constants";
import { IZapApiClient }          from "@core/zap-miner-api";

import { MomoxAppApi }            from "@miners/api/momox-api-client";
import { WbgAppApi }              from "@miners/api/wbg-api-client";
import { ZiffitAppApi }           from "@miners/api/ziffit-api-client";
import { MmpAppApi }              from "@miners/api/mmp-api-client";

export class Application {
	webApp: WebApp;
	zapMiners: IZapApiClient[];

	constructor(public debug: boolean = false) {
		Logger.logGreen("Starting up...");
		this.webApp = new WebApp();
		this.zapMiners = new Array<IZapApiClient>();
		Logger.logPurple(Constants.APP_NAME);

		if (this.configure()) {
			this.start();
		}
	}

	public configure(): boolean {
		Logger.logGreen("App configure...");
		//
		// Create Api Managers
		// TODO: We should really investigate using inversify for this
		//
		try {
			let wbgMiner = new WbgAppApi();
			let momoxMiner = new MomoxAppApi(true);
			let ziffitMiner = new ZiffitAppApi();
			let magpieMiner = new MmpAppApi();

			this.zapMiners.push(ziffitMiner);
			this.zapMiners.push(momoxMiner);
			this.zapMiners.push(magpieMiner);
			this.zapMiners.push(wbgMiner);

			for (let index in this.zapMiners) {
				let miner = this.zapMiners[index];
				Logger.logGreen("Registered Miner ::", miner.name);
			}

		} catch (err) {
			Logger.logError("Error Initializing Miners ::", err);
			return false;
		}

		this.webApp.setApiClients(this.zapMiners);

		return true;
	}

	public start(): void {
		this.webApp.start(this.debug);
	}
}
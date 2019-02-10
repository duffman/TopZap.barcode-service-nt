/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as express               from "express";
import * as bodyParser            from "body-parser";
import { Request }                from 'express';
import { Response}                from 'express';
import { NextFunction }           from 'express';
import { Router }                 from "express";
import { Logger }                 from "@cli/logger";
import { PriceController }        from "./controllers/price-controller";
import { IZapApiClient }          from "@core/zap-miner-api";
import { Settings }               from "@app/settings";
import { IVendorOfferData }       from '@app/models/zap-ts-models/zap-offer.model';

export class WebApp {
	isRunning: boolean = false;
	public webApp: express.Application;
	public webRoutes: Router = Router();
	public priceController: PriceController;
	public apiClients: IZapApiClient[];

	constructor() {
		this.webApp = express();
		this.webApp.use(this.webRoutes);

		// Move...
		this.priceController = new PriceController();
		this.priceController.initRouter(this.webRoutes);
	}

	public showSettings() {
		Logger.logGreen("Using Port :", Settings.Server.ServicePort);
	}

	public setApiClients(clients: IZapApiClient[]) {
		console.log("setApiClients ::", clients);

		if (clients) {
			this.apiClients = clients;
			this.priceController.setApiClients(clients);
		} else {
			Logger.logFatalError("ERROR ::: WebApp ::: setApiClients");
		}
	}

	private configureWebServer(): void {
		//let zpWorkElfNr = Math.floor(Math.random() * 66) + 1;
		let zpNameVer = "ZapStorm/2.0.3";
		let zpPoweredBy = ["X-PoweredBy", "ZapperWorkerElves:Elf1"];
		let zpServer = ["Server", zpNameVer];

		this.webRoutes.use(bodyParser.json());
		this.webRoutes.use(bodyParser.urlencoded({ extended: true }));

		this.webRoutes.use((req, res, next) => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});

		this.initRoutes();

		this.webRoutes.get("/", (req, resp) => {
			let min = 300;
			let max = 10000;

			let randRespTime = Math.floor(Math.random()*(max-min+1)+min);

			setTimeout((function() {
				resp.send("Random::" + randRespTime.toString());
			}), randRespTime);
		});
	}

	private debug() {
		let barcode = "0819338020068";
		try {
			this.apiClients.map(miner => {
				console.log("Calling miner :::", miner.name);
				miner.getOffer(barcode).then((res: IVendorOfferData) => {
					console.log("RES :::", res);
				});
			});
		} catch(err) {
			console.log(`Miner failed ::`, err);
		}
	}

	// Do not call directly
	private initRoutes() {
		let scope = this;

		if (!this.apiClients) {
			Logger.logError("No API Clients Set");
			process.exit(233)
		}
	}

	public start(debug: boolean = false) {
		this.configureWebServer();

		if (debug) {
			this.debug();

		} else  {
			Logger.logGreen("Starting...");

			this.webApp.listen(Settings.Server.ServicePort, () => {
				this.isRunning = true;
				console.log("Express server listening on port " + Settings.Server.ServicePort)
			});
		}
	}
}

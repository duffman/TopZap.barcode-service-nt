/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Request, Response}       from 'express';
import { NextFunction, Router }   from 'express';
import { IApiController }         from "./webapp-controller";
import { Logger }                 from "@cli/logger";

//
// Api Clients
//
import { MmpAppApi }              from "@miners/api/mmp-api-client";
import { MomoxAppApi }            from "@miners/api/momox-api-client";
import { ZiffitAppApi }           from "@miners/api/ziffit-api-client";
import { WbgAppApi }              from "@apiClient/wbg-api-client";

//
// Mongo
//
// import { IDataEngine }            from "@app/datalog/data-engine";
// import { MongoDataEngine }        from "@app/datalog/mongo-data-engine";

import { PStrUtils }              from "@putte/pstr-utils";
import { IZapApiClient }          from "@core/zap-miner-api";
import { CliCommander }           from "@cli/cli-commander";
import { ICompiledOffersResult }  from "@app/models/compiled-offers-result";
import { CompiledOffersResult }   from "@app/models/compiled-offers-result";
import { ControllerUtils }        from "@webapp/controllers/controller.utils";
import { ISocketServer }          from '@igniter/coldmind/socket-io.server';
import { SocketServer }           from '@igniter/coldmind/socket-io.server';
import { Socket}                  from 'socket.io';
import { SocketEvents }           from '@igniter/coldmind/igniter-event.types';
import { IOTypes }                from '@igniter/coldmind/socket-io.types';
import { IMessage }               from '@igniter/messaging/igniter-messages';
import { IgniterMessage }         from '@igniter/messaging/igniter-messages';
import { MessageType}             from '@igniter/messaging/message-types';
import { IVendorOfferResult }     from '@app/models/zap-ts-models/vendor-offer-result';
import { GetOffersInit }          from '@app/models/zap-ts-models/messages/get-offers-messages';
import { IgniterSettings }        from '@igniter/igniter.settings';
import { ZapMessageType }         from '@app/models/zap-ts-models/messages/zap-message-types';
import {IVendorOfferData, VendorOfferData} from '@app/models/zap-ts-models/zap-offer.model';

type ApiClientPromise = Promise<IVendorOfferData>;

export class PriceController implements IApiController {
	serviceServer: ISocketServer;
	private zapResultCache;
	public apiClients: IZapApiClient[];

	constructor() {
		let scope = this;

		//this.dataEngine = new MongoDataEngine();

		this.apiClients = new Array<IZapApiClient>();
		this.serviceServer = new SocketServer(true);
		this.serviceServer.startListen(IgniterSettings.DefSocketServerPort);

		this.serviceServer.onServerStarted((port) => {
			console.log("EVENT :: Server Started on Port ::", port);
		});

		this.serviceServer.onServerStartError((err) => {
			console.log("EVENT :: Server Start FAIL ::", err);
		});

		this.serviceServer.onMessage(this.onMessage.bind(this));
	}

	/**
	 * New message received
	 * @param {IMessage} message
	 */
	private onMessage(message: IMessage): void {
		if (!message.is(MessageType.Action) || !message.idIs(ZapMessageType.GetOffers)) {
			return;
		}

		let vendorCount = this.apiClients.length;
		this.emitOfferMessage(message, ZapMessageType.GetOffersInit, new GetOffersInit(vendorCount));

		this.doSearch(message.data.code, message).then(res => {
			Logger.logGreen("SEARCH RES ::", res);
			this.emitOfferMessage(message, ZapMessageType.GetOffersDone);

		}).catch(err => {
			Logger.logError("onMessage :: doSearch :: err ::", err);
		});
	}

	public emitSearchDone(message: IMessage) {
		message.reply(MessageType.Action, ZapMessageType.GetOffersDone, {});
	}

	public initRouter(routes: Router) {
		let scope = this;
		Logger.logPurple("PriceController :: initRouter");

		routes.get('/:code', (req: Request, resp: Response) => {
			let barcode = req.params.code;

			scope.doSearch(barcode).then((result) => {
				resp.json(result);
				resp.end();

			}).catch((err) => {
				Logger.logError("Routes Code :: err", err);
				ControllerUtils.internalError(resp);
			});
		});

		routes.post('/code', (req: Request, resp: Response) => {
			console.log("", req.body);
			let barcode = req.body.code;

			scope.doSearch(barcode).then((result) => {
				resp.json(result);

			}).catch((err) => {
				Logger.logError("Routes Code :: err", err);
				ControllerUtils.internalError(resp);
			});
		});
	}

	public setApiClients(clients: IZapApiClient[]): void {
		this.apiClients = clients;
	}

	public doSearch(barcode: string, message: IgniterMessage = null): Promise<ICompiledOffersResult> {
		return new Promise((resolve, reject) => {
			if (PStrUtils.isEmpty(barcode)) {
				let err = new Error("Code is missing");
				message.error(err);
				reject(err);

			} else {
				return this.runMiners(barcode, message).then((res) => {
					resolve(res);
				}).catch((err) => {
					reject(err);
				});

			}
		});
	}

	private emitOfferMessage(message: IMessage, type: string, data: any = null) {
		data = data === null ? {} : data;
		message.reply(MessageType.Action, type, data);
	}

	private formatOffer(input: string): number {
		let res = -1;

		try {
			let resStr = input.trim().replace(",", ".");
			res = parseFloat(resStr);

		} catch (err) {
			console.log("formatOffer :: ERROR ::", err);
			res = -1;
		}

		return res;
	}

	public runMiners(code: string, message: IgniterMessage = null): Promise<ICompiledOffersResult> {
		let scope = this;
		let result = new CompiledOffersResult();
		let apiClients = scope.apiClients;

		function getVendorResultPromise(index: number): Promise<IVendorOfferData> {
			let validIndex = index >= 0 && index <= scope.apiClients.length;

			return new Promise((resolve, reject) => {
				if (validIndex) {
					let apiClient = apiClients[index];

					console.log("apiClient ::", apiClient.name);

					// TODO: HERE IS WHEE WE SPLIT THE RESULT INTO CHUNKS IF IT EVER HAPPENS....
					apiClient.getOffer(code).then((res) => {
						if (res.offer !== null) {
							let offerNum = scope.formatOffer(res.offer);
							res.accepted = offerNum > -1;
							res.offer = offerNum.toString();

							// Append the code to the result
							res.code = code;
						}

						console.log("INNAN :::", res);

						if (res.success) {
							if (message !== null) {
								scope.emitOfferMessage(message, ZapMessageType.VendorOffer, res);
							} else {
								let reqRes = new VendorOfferData();
								reqRes.code = code;
								scope.emitOfferMessage(message, ZapMessageType.VendorReqRes, null);
							}

							result.vendors.push(res);
						}

						resolve(res);

					}).catch((err) => {
						console.log("getOffer :: ERR", err);
						reject(err);
					});

				} else {
					reject(new Error("Invalid API Client"));
				}
			});
		}

		let vendorResultPromises = new Array<ApiClientPromise>();

		return new Promise((resolve, reject) => {
			try {
				for (let index = 0; index < apiClients.length; index++) {
					vendorResultPromises.push(getVendorResultPromise(index))
				}

				Promise.all(
					vendorResultPromises
				).catch((err) => {
					console.log("ERRRROOLL ::", err);
					message.error(err);
				}).then(() => {
					Logger.logYellow("Promises Done");
					resolve(result);
				});

			} catch (err) {
				message.error(err);
				reject(err);
			}
		});
	}

	public debugSetMiners(): boolean {
		//
		// Create Api Managers
		// TODO: We should really investigate using inversify for this
		//
		try {
			let momoxMiner = new MomoxAppApi(true);
			let wbgMiner = new WbgAppApi();
			let ziffitMiner = new ZiffitAppApi();
			let magpieMiner = new MmpAppApi();

			this.apiClients.push(wbgMiner);
			this.apiClients.push(momoxMiner);
			this.apiClients.push(ziffitMiner);
			this.apiClients.push(magpieMiner);

		} catch (err) {
			Logger.logError("Error Initializing Miners ::", err);
			return false;
		}

		return true;
	}
}

if (CliCommander.haveArgs()) {
	let priceController	= new PriceController();
	priceController.debugSetMiners();
	let barcode = "0045496590444";

	priceController.runMiners(barcode).then((res) => {
		console.log("RES ::", res);
	}).catch((err) => {
		console.log("ERROR ::", err);
	});
}

/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import * as request               from "request"
import * as fs                    from "fs"
import * as querystring           from "querystring";

import { CookieJar }              from "./cookie-jar";
import { Logger }                 from "@cli/logger";

import { MinerRequest }           from "@core/miner-request";
import { RequestType }            from "@core/miner-request";
import {SessionRetriever}         from "./session-retriever";
import {ProxyConfig}              from "@session/proxy-config";
import {Global}                   from "../../inc/global";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36";

/**
 * Used when dealing with PHPSessions such as Zapper and WebuyGames
 */

export class PhpSession {
	cookieData: CookieJar = null;
	phpSessionId: string = null;
	private useProxy: boolean;

	constructor() {}

	public useProxyServer(useProxy: boolean) {
		this.useProxy = useProxy;
	}

	/**
	 * Sets the php session id, if it´s not already set
	 *
	 * @param {string} sessionId
	 * @param {boolean} force - if set the new id will be forced (if not null)
	 */
	public setPHPSessionId(sessionId: string, force: boolean = false) {
		if ((sessionId != null && this.phpSessionId == null) || (force && sessionId != null)) {
			this.phpSessionId = sessionId; //sessionId;
		}
	}

	/**
	 *
	 * @param payload
	 * @param {boolean} useProxy
	 * @returns {Promise<any>}
	 */
	public postRequest(reqUri: string, payload: any, useProxy: boolean = false): Promise<any> {
		let formData = querystring.stringify(payload);
		let contentLength = formData.length;

		if (Global.VerboseDevDebug) {
			Logger.logCyan("PhpSession :: postRequest");
			Logger.logCyan("\t\tPHPSESSID ::", this.phpSessionId);
			Logger.logCyan("\t\tUsing Proxy ::", this.phpSessionId);
		}

		let options = {
			uri: reqUri, //"https://zapper.co.uk/ZapResponder",
			headers: {
				"user-agent": USER_AGENT,
				"cache-control": "no-cache",
				'Content-Length': contentLength,
				'Content-Type': 'application/x-www-form-urlencoded',
				"accept": "*/*",
				"cookie": this.phpSessionId,
				"x-requested-with": "XMLHttpRequest" // Do we need this here?
			},
			method: MinerRequest.RequestTypeToStr(RequestType.POST),
			body: formData
		};

		let newRequest: any;

		if (useProxy) {
			options["ca"] = ProxyConfig.getCertificate();
			options["requestCert"] =  true;
			options["rejectUnauthorized"] = true;

			newRequest = request.defaults({
				'proxy': ProxyConfig.ProxyUrl()
			});

		} else {
			newRequest = request.defaults();
		}


		let scope = this;

		return new Promise((resolve, reject) => {
			return newRequest(options, (error: any, response: any, body: any) => {

				let reqCookie = response.headers['set-cookie'];
				if (reqCookie != null) {
					this.cookieData = new CookieJar(reqCookie);
					this.setPHPSessionId(
						this.cookieData.getPHPSession()
					);
				}

				if (!error && response.statusCode == 200) {
					Logger.logError("Success", body);
					resolve(body);
				}
				else {
					Logger.logError("PhpSession :: postRequest :: Error", error);
					reject(error);
				}
			});
		});
	}

	/**
	 * Execute a HTTP request with specified parameters
	 * @param {RequestType} reqType
	 * @param {string} reqUri
	 * @param payload
	 * @returns {Promise<any>}
	 */
	public executeRequest1(reqType: RequestType, reqUri: string, payload: any = null): Promise<any> {
		let options = {
			uri: reqUri,
			headers: {
				"referer": "https://www.ziffit.com/basket",
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
				"content-type": "application/json;charset=UTF-8",
				"cookie": this.phpSessionId,
				"cache-control": "no-cache",
				"accept-encoding": "gzip, deflate, br",
				"accept": "*/*",
				"x-requested-with": "XMLHttpRequest",
			},
			method: MinerRequest.RequestTypeToStr(reqType),
			json: true,
			gzip: true
		};

		if (payload != null) {
			options["body"] = payload;
		}


		let newRequest = request.defaults();

		/*
		let newRequest = request.defaults({
			'proxy': Settings.PROXY_URL
		});
		*/

		let scope = this;

		return new Promise((resolve, reject) => {
			function callback(error: any, response: any, body: any) {
				if (!error && response.statusCode == 200) {
					resolve(body);
				}
				else {
					Logger.logError("ERROR", response);
					reject(error);
				}
			}
			newRequest(options, callback);
		});
	}


	public executeRequest(reqType: RequestType, reqUri: string, payload: any = null, useProxy: boolean = false): Promise<any> {
		let formData = querystring.stringify(payload);
		let contentLength = formData.length;

		console.log("FORM-DATA:", formData);

		let options = {
			uri: reqUri,
			headers: {
				"user-agent": USER_AGENT,

				'Content-Length': contentLength,
				'Content-Type': 'application/x-www-form-urlencoded',

			/*	Optionsl ?? -----------------------------
				"origin": "https://www.webuygames.co.uk",
				"pragma": "no-cache",
				"referer": "https://www.webuygames.co.uk/",
			*/

				"cookie": this.phpSessionId, //Is extra if we want a basket to persist??
				"cache-control": "no-cache",
				"accept-encoding": "gzip, deflate, br",
				"accept": "*/*",
				"x-requested-with": "XMLHttpRequest",
			},
			method: MinerRequest.RequestTypeToStr(reqType),
			body: formData,
			json: true,
			gzip: true
		};


		let newRequest: any;

		if (useProxy) {
			options["ca"] = ProxyConfig.getCertificate();
			options["requestCert"] =  true;
			options["rejectUnauthorized"] = true;

			newRequest = request.defaults({
				'proxy': ProxyConfig.ProxyUrl()
			});

		} else {
			newRequest = request.defaults();
		}

		let scope = this;

		return new Promise((resolve, reject) => {
			function callback(error: any, response: any, body: any) {
				if (!error && response.statusCode == 200) {
					resolve(body);
				}
				else {
					Logger.logError("PhpSession :: executeRequest ::", response);
					reject(error);
				}
			}
			newRequest(options, callback);
		});
	}

	/**
	 * Create a new session by requesting a URL like a browser does,
	 * collects the PHP Session id and requests the page again in order to
	 * trick the remote to "tie" the server side cookie.
	 * @param {string} url
	 * @returns {Promise<void>}
	 */
	public createSession(url: string): Promise<void> {
		let scope = this;

		function getPhpSessionId(): Promise<string> {
			return new Promise((resolve, reject) => {
				let sessionRet = new SessionRetriever();
				sessionRet.getPHPSessionId().then((res) => {
					Logger.logChainStep("### aquirePHPSessionId >> PHP Session ID ::" + res, 1);
					resolve(res);

				}).catch((err) => {
					Logger.logError("Error Aquiring PHP Session ID ::", err);
					reject(err);
				});
			});
		}

		/**
		 *  Do a second get with the session id retrieved in order
		 *  to fool Zapper to "tie" the session cookie server side...
		 *
		 * @param {string} sessionId
		 * @returns {Promise<string>}
		 */
		function pokeSession(sessionId: string): Promise<string> {
			return new Promise((resolve, reject) => {
				let sessionRet = new SessionRetriever();
				sessionRet.initSessionId(sessionId).then((res) => {
					Logger.logChainStep("### initSessionId >> PHP Session ID ::" + res, 1);
					resolve(res);

				}).catch((err) => {
					Logger.logError("Error initSessionId PHP Session ID ::", err);
					reject(err);
				});
			});
		}

		async function aquireSession(): Promise<void> {
			if (scope.phpSessionId == null) {
				let phpSessId = await getPhpSessionId();
				scope.setPHPSessionId(phpSessId);
				let initSessionRes = await pokeSession(phpSessId);

			} else {
				console.log("Session ID PRE SET AS ::", scope.phpSessionId);
			}
		}

		return new Promise((resolve, reject) => {
			aquireSession().then(() => {
				Logger.logGreen("S")
				resolve();
			}).catch((err) => {
				reject(err);
			})
		});
	}
}

let app = new PhpSession();
let args = process.argv.slice(2);


const testUrl = `https://www.webuygames.co.uk/`;

switch (args[0]) {
	case "get":
		app.createSession(testUrl).then((basket) => {
			console.log("Session Created", app.phpSessionId);


		});
		break;

	case "add":
		let code = args[1] != null ? args[1] : "0887195000424";
		let sessId = args[2];

		/*
		webApp.setPHPSessionId(sessId);

		webApp.addItem(code).then((res) => {
			Logger.logGreen("EXEC2", res);
		}).catch((err) => {
			Logger.logError("Error Adding Item", err);
		});
		*/
		break;
}
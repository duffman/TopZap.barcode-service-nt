/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import { Global }                 from "../../inc/global";
import * as fs                    from "fs";
import * as path                  from "path";

const CRAWLERA_API_KEY            = "20609bc8ea624cc3a8b2bd21b4759383";
const CRAWLERA_CA_CRT             = "crawlera-ca.crt";
const  PROXY_URL                  = `http://${CRAWLERA_API_KEY}:@proxy.crawlera.com:8010`;

export class ProxyConfig {
	constructor() {}

	public static getCertificate(): any {
		let configPath = path.resolve(process.cwd(), "configureWebServer");
		let certFile = path.resolve(configPath, CRAWLERA_CA_CRT);

		console.log("getCertificate() ::", certFile);
		//fs.readFileSync("./crawlera-ca.crt")
	}

	public static ProxyUrl(): string {
		return PROXY_URL;
	}
}
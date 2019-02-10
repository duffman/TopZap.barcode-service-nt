/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export module Settings {
	export module Server {
		export let ServicePort = 6562;
	}

	export class Endpoints {
		public static API_SERVER_URI = "http://topzap.com:8080";
		public static API_KEY = "20609bc8ea624cc3a8b2bd21b4759383";
		public static  PROXY_URL = `http://${Endpoints.API_KEY}:@proxy.crawlera.com:8010`;
	}
}

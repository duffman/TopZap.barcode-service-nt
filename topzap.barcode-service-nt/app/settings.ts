/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import {DateInterval} from '@lib/putte-ts/date/DateInterval';

export module Settings {
	export module Global {
		export let debug                         = true;
		export let terminateOnError: boolean     = false;
	}

	export module Server {
		export let ServicePort = 6562;
	}

	export module Caching {
		export const UseCachedOffers = true;
		export const CacheTTL = DateInterval.days(10); // 5760; // 4 days
	}

	/**
	 *	Public Application Settings
	 */
	export module Database {
		export module MySQL {
			export const dbName = "topzap-prod";
			export const dbHost = "localhost";
			export const dbUser = "duffman";
			export const dbPass = "bjoe7151212";
		}
	}

	export class Endpoints {
		public static API_SERVER_URI = "http://topzap.com:8080";
		public static API_KEY = "20609bc8ea624cc3a8b2bd21b4759383";
		public static  PROXY_URL = `http://${Endpoints.API_KEY}:@proxy.crawlera.com:8010`;
	}
}

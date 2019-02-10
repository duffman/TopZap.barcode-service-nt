/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Application } from "@app/app";
import { Logger } from "@cli/logger";

// FOR DEBUGGING PURPOSES ONLY //
import { WbgAppApi } from "@apiClient/wbg-api-client";
import {CliCommander} from "@cli/cli-commander";

////////////////////////////////


let debug = false;

if (!debug) {
	Logger.logGreen("NORMAL MODE");
	let app = new Application(debug);

} else {
	Logger.logYellow("DEBUG MODE");

	let cp = new WbgAppApi();
	cp.getOffer("819338020068").then((res) => {
		console.log("YEAH", res);

	}).catch(err => {
		console.log("FUCK YOU", err);
	});
}

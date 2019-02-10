/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Application }            from "@app/app";
import { Logger }                 from "@cli/logger";
import { CliCommander }           from "@cli/cli-commander";

if (!CliCommander.haveArgs()) {
	Logger.logFatalError("No Miner Client API Specified");
} else {
	let param = CliCommander.first();
	let app = new Application(true, param);
}

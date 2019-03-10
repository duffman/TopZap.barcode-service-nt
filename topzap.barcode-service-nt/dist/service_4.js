"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@cli/logger");
const app_1 = require("@app/app");
let serviceName = "WeBuyGames";
let serviceKey = "wbg";
logger_1.Logger.logPurple("Starting Service ::", serviceName);
let app = new app_1.Application(true, serviceKey);

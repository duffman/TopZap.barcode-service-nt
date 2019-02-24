/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Logger } from '@cli/logger';
import { Application } from '@app/app';

let serviceName = "MOMOX";
let serviceKey = "momox";

Logger.logPurple("Starting Service ::", serviceName);
let app = new Application(true, serviceKey);

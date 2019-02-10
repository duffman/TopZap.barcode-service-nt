/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Express }                from "express";
import { Request, Response }      from 'express';

export class ControllerUtils {
	public static internalError(res: Response, message: string = "Internal Server Error KaZap/0.9") {
		res.writeHead(501, {'Content-Type': 'text/plain'});
		res.end(message);
	}
}

#! /usr/bin/env node
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

const args = process.argv.slice(2);

export class CliCommander {
	public static haveArgs(): boolean {
		return args.length > 0;
	}

	public static first(): string {
		return args.length > 0 ? args[0] : null;
	}

	public static debug(): boolean {
		return this.first() === "debug";
	}

	public static parseCliArgs(args: any): void {

	}
}

CliCommander.parseCliArgs(args);

/*

SELECT
mq.id,
	mq.session_id,
	pe.game_id AS product_id,
	mq.barcode,
	mq.title,
	mq.price,
	mq.message,
	mq.processed_when,
	ms.vendor_id
FROM
	price_miner_queue AS mq,
	price_miner_session AS ms,
	product_edition AS pe
WHERE
mq.processed_when IS NOT NULL
AND
mq.bid_migrated = 0
AND
ms.id = 31
AND
mq.price > -1
AND
mq.session_id = ms.id
AND
pe.barcode = mq.barcode

LIMIT 1000
*/
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as uuidV1 from "uuid/v1";
import * as uuidV4 from "uuid/v4";

class Spike {
	public resolver: any;
	public rejecter: any;

	constructor() {
	}

	public getPromise(): Promise<string> {
		return new Promise((resolve, reject) => {
			this.resolver = resolve;
			this.rejecter = reject;
		});
	}

	public startTimer() {
		let count = 0;
		let scope = this;

		function intervalFunc() {
			count++;

			console.log("Ticking Away::", count);

			if (count > 5) {
				console.log("Resolving...");
				scope.resolver("Yeah Man");
			}

			if (count > 10) {
				clearInterval(this);
			}
		}
		setInterval(intervalFunc, 1500);
	}
}


console.log(uuidV4());

let spike = new Spike();


spike.getPromise().then(res => {
	console.log("Promise Reolved With ::", res);
}).catch(err => {
	console.log("Promise REJECTED With ::", err);
});


spike.startTimer();
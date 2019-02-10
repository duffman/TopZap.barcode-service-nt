/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as mongoose              from "mongoose";
import { IDataEngine }            from "@app/datalog/data-engine";
import { IDataEngineResult }      from "@app/datalog/data-engine";
import { Document, Schema }       from "mongoose";
import { Model, model }           from "mongoose";
import { CliCommander }           from "@cli/cli-commander";

export class MongoDbRes implements IDataEngineResult {
	constructor(public success: boolean = false) {}
}

export class MongoDataEngine implements IDataEngine {
	constructor() {
		let uri = 'mongodb://localhost/topzap';
		mongoose.connect(uri, { useNewUrlParser: true }, (err) => {
			if (err) {
				console.log(err.message);
				console.log(err);
			}
			else {
				console.log('Connected to MongoDb');
			}
		});
	}

	public logData(data: any): IDataEngineResult {
		throw new Error("Method not implemented.");
	}

	public test(): void {

	}

	private saveData(name: string, dataObj: any): IDataEngineResult {

		function save() {}

		let result = new MongoDbRes();
		let schema = new Schema({ any: Schema.Types.Mixed });

		let DataModel = model(name, schema);
		let data = new DataModel(dataObj);

		data.save().then((res) => {

		}).catch((err) => {

		});

		return null;
	}

}

if (CliCommander.debug()) {
	let engine = new MongoDataEngine();

	engine.test();

}
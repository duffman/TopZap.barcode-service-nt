/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */


export interface IDataEngineResult {
	success: boolean;
}

export interface IDataEngine {
	logData(data: any): IDataEngineResult;
}
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import {PVarUtils} from "@putte/pvar-utils";

export class PNumUtils {
	public static relNumsEqual(number1: number, number2: number): boolean {
		return (!PVarUtils.isNothing(number1)
				&& !PVarUtils.isNothing(number1)
				&& number1 === number2);
	}
}
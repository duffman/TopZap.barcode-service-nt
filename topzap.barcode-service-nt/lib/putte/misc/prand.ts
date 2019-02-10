/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export class PRand {
	public static randRange(min: number = 0, max: number = 10): number {
		return Math.floor(Math.random()*(max-min+1)+min);
	}
}
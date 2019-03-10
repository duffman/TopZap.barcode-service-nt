/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * March 2019
 */

export module DroneConfig {
	export let encryptionMasterKey = "1gulka9n";

	export module Development {
		export let app_id = "732308";
		export let key = "fae6c314f74fb399e2ac";
		export let secret = "a3cb03f78682777ed2d1";
		export let cluster = "eu";
	}

	export module Staging {
		export let app_id = "732309";
		export let key = "e4edc1b3369575571fb6";
		export let secret = "111889a0dd6ac436d854";
		export let cluster = "eu";
	}

	export module Production {
		export let app_id = "732310";
		export let key = "7499aff899392dc45ce1";
		export let secret = "0b54fc267b5f9968251a";
		export let cluster = "eu";
	}
}
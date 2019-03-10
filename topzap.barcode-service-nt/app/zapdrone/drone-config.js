"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * March 2019
 */
exports.__esModule = true;
var DroneConfig;
(function (DroneConfig) {
    DroneConfig.encryptionMasterKey = "1gulka9n";
    var Development;
    (function (Development) {
        Development.app_id = "732308";
        Development.key = "fae6c314f74fb399e2ac";
        Development.secret = "a3cb03f78682777ed2d1";
        Development.cluster = "eu";
    })(Development = DroneConfig.Development || (DroneConfig.Development = {}));
    var Staging;
    (function (Staging) {
        Staging.app_id = "732309";
        Staging.key = "e4edc1b3369575571fb6";
        Staging.secret = "111889a0dd6ac436d854";
        Staging.cluster = "eu";
    })(Staging = DroneConfig.Staging || (DroneConfig.Staging = {}));
    var Production;
    (function (Production) {
        Production.app_id = "732310";
        Production.key = "7499aff899392dc45ce1";
        Production.secret = "0b54fc267b5f9968251a";
        Production.cluster = "eu";
    })(Production = DroneConfig.Production || (DroneConfig.Production = {}));
})(DroneConfig = exports.DroneConfig || (exports.DroneConfig = {}));

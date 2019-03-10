"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
const DateInterval_1 = require("@lib/putte-ts/date/DateInterval");
var Settings;
(function (Settings) {
    let Global;
    (function (Global) {
        Global.debug = true;
        Global.terminateOnError = false;
    })(Global = Settings.Global || (Settings.Global = {}));
    let Server;
    (function (Server) {
        Server.ServicePort = 6562;
    })(Server = Settings.Server || (Settings.Server = {}));
    let Caching;
    (function (Caching) {
        Caching.UseCachedOffers = true;
        Caching.CacheTTL = DateInterval_1.DateInterval.days(10); // 5760; // 4 days
    })(Caching = Settings.Caching || (Settings.Caching = {}));
    /**
     *	Public Application Settings
     */
    let Database;
    (function (Database) {
        Database.dbName = "topzap-prod";
        Database.dbHost = "localhost";
        Database.dbUser = "duffman";
        Database.dbPass = "bjoe7151212";
    })(Database = Settings.Database || (Settings.Database = {}));
    class Endpoints {
    }
    Endpoints.API_SERVER_URI = "http://topzap.com:8080";
    Endpoints.API_KEY = "20609bc8ea624cc3a8b2bd21b4759383";
    Endpoints.PROXY_URL = `http://${Endpoints.API_KEY}:@proxy.crawlera.com:8010`;
    Settings.Endpoints = Endpoints;
})(Settings = exports.Settings || (exports.Settings = {}));

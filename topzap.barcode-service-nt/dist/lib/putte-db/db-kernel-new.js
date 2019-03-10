"use strict";
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const data_sheet_1 = require("./data-containers/data-sheet");
const sql_table_data_1 = require("./sql-table-data");
const db_result_1 = require("./db-result");
const db_logger_1 = require("./db-logger");
const settings_1 = require("@app/settings");
const log = console.log;
var DbState;
(function (DbState) {
    DbState[DbState["Unset"] = 0] = "Unset";
    DbState[DbState["Connected"] = 1] = "Connected";
    DbState[DbState["Disconnected"] = 2] = "Disconnected";
})(DbState || (DbState = {}));
class DbKernel {
    constructor(dbHost = settings_1.Settings.Database.dbHost, dbUser = settings_1.Settings.Database.dbUser, dbPass = settings_1.Settings.Database.dbPass, dbName = settings_1.Settings.Database.dbName, tag = "NO_TAG") {
        this.dbHost = dbHost;
        this.dbUser = dbUser;
        this.dbPass = dbPass;
        this.dbName = dbName;
        this.tag = tag;
        this.connLost = false;
        this.conn = this.createConnection();
        this.conn.on("error", (err) => {
            console.log("FAT FET FUCK::: TAG ==", tag);
            if (err.code == 'PROTOCOL_CONNECTION_LOST') {
                console.log("FAT FET FUCK -- LOST --:::", err);
                this.connLost = true;
            }
        });
    }
    getState() {
        let result = DbState.Unset;
        switch (this.conn.state) {
            case "disconnected":
        }
        return result;
    }
    showDebugInfo() {
        /*
        if(connection.state === 'disconnected'){
            return respond(null, { status: 'fail', message: 'server down'});
        }
        */
        console.log("Connection State ::", this.conn.state);
    }
    getConnection() {
        return this.conn;
    }
    createConnection(openConnection = true) {
        try {
            if (this.connLost) {
                console.log("createConnection :: NOT PROCEEDING");
                return;
            }
            this.conn = mysql.createConnection({
                host: this.dbHost,
                user: this.dbUser,
                password: this.dbPass,
                database: this.dbName
            });
            if (openConnection) {
                this.conn.connect();
            }
        }
        catch (ex) {
            console.log("createConnection :: ERROR ::", ex);
        }
        return this.conn;
    }
    static getInstance() {
        let dbManager = new DbKernel();
        dbManager.open();
        return dbManager;
    }
    open() {
        this.conn.connect();
    }
    close() {
        this.conn.end();
    }
    query(sql, callback) {
        let dataSheet = new data_sheet_1.DataSheet();
        this.conn.connect();
        this.conn.query(sql, (error, result, fields) => {
            this.conn.end();
            if (error)
                throw error;
            dataSheet.parseFields(fields);
            callback(dataSheet);
        });
    }
    static escape(value) {
        if (value === null || value === undefined) {
            value = '';
        }
        value = value.replace('"', '\"');
        value = value.replace("'", '\"');
        return value;
    }
    parseMysqlQueryResult(error, result, tableFields) {
        return new Promise((resolve, reject) => {
            let queryResult = new db_result_1.DbResult();
            if (error) {
                queryResult.success = false;
                queryResult.error = error;
                let customError = error;
                //error code 1292
                if (error.errno === 'ECONNREFUSED') {
                    customError = new Error("ECONNREFUSED");
                }
                if (error.errno == 1062) {
                    customError = new Error("DUP_ENTRY");
                }
                else {
                    db_logger_1.DbLogger.logErrorMessage("dbQuery :: Error ::", error.errno);
                }
                reject(customError);
                //resolve(queryResult);
            }
            else {
                queryResult.affectedRows = result.affectedRows;
                queryResult.lastInsertId = result.insertId;
                let data = new sql_table_data_1.SQLTableData();
                data.parseResultSet(result, tableFields).then((res) => {
                    queryResult.result = res;
                    resolve(queryResult);
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    }
    runInTransaction(sql) {
        let scope = this;
        let result;
        let executeError = null;
        function beginTransaction() {
            return new Promise((resolve, reject) => {
                scope.conn.query("START TRANSACTION", (error, result) => {
                    if (!error) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
            });
        }
        function executeSql(sql) {
            return new Promise((resolve, reject) => {
                scope.conn.query(sql, (error, result, tableFields) => {
                    scope.parseMysqlQueryResult(error, result, tableFields).then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                });
            });
        }
        function commit() {
            return new Promise((resolve, reject) => {
                scope.conn.query("COMMIT", (error, result) => {
                    console.log("error ::", error);
                    console.log("result ::", result);
                    if (!error) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
            });
        }
        function rollback() {
            return new Promise((resolve, reject) => {
                scope.conn.query("ROLLBACK", (error, result) => {
                    console.log("error ::", error);
                    console.log("result ::", result);
                    if (!error) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
            });
        }
        async function execute() {
            let beginTransRes = await beginTransaction();
            try {
                result = await executeSql(sql);
                await commit();
            }
            catch (err) {
                let transError = err != null ? err : new Error("SQL Execution failed");
                executeError = transError;
            }
            if (executeError != null || !result.success) {
                await rollback();
            }
        }
        return new Promise((resolve, reject) => {
            execute().then(() => {
                if (executeError != null) {
                    reject(executeError);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    returnResult() {
        return new Promise((resolve, reject) => {
        });
    }
    countRows(table, where, is) {
        let countAlias = "count";
        return new Promise((resolve, reject) => {
            let query = `SELECT COUNT(*) AS ${countAlias} FROM ${table} WHERE ${where}${is}`;
            this.dbQuery(query).then(res => {
                let row = res.safeGetFirstRow();
                let count = row.getValAsNum(countAlias);
                resolve(count);
            }).catch(err => {
                resolve(-1);
            });
        });
    }
    dbQuery(sql) {
        if (this.connLost) {
            console.log("createConnection :: NOT PROCEEDING");
            return;
        }
        // Detta är nytt
        return new Promise((resolve, reject) => {
            this.conn.query(sql, (error, result, tableFields) => {
                if (error) {
                    console.log("dbQuery ERROR ::", error);
                    if (error.fatal) {
                        console.trace('fatal error: ' + error.message);
                    }
                    reject(error);
                }
                else {
                    return this.parseMysqlQueryResult(error, result, tableFields).then((res) => {
                        if (error) {
                            console.log("FET ERROR ::", error);
                        }
                        else {
                            resolve(res);
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
        });
    }
    dbQuery2(sql) {
        let result;
        function parseResult(error, result, tableFields) { }
        async function execute() {
            this.conn.query(sql, (error, result, tableFields) => {
                if (error) {
                    if (error.fatal) {
                        console.trace('fatal error: ' + error.message);
                    }
                    //	reject(error);
                }
                else {
                    return this.parseMysqlQueryResult(error, result, tableFields).then((res) => {
                        if (error) {
                            console.log("FET ERROR ::", error);
                            result.setError(error);
                        }
                        else {
                            //			resolve(res);
                        }
                    }).catch((err) => {
                        result.e;
                        //		reject(err);
                    });
                }
            });
        }
        return new Promise((resolve, reject) => {
            execute().then(() => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        });
    }
}
exports.DbKernel = DbKernel;
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

const mysql = require("mysql2");
const dbconfig = require("./database");
const pool = mysql.createPool(dbconfig);

const promisePool = pool.promise();

module.exports = promisePool;

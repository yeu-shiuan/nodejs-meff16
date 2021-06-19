const mysql = require("mysql");
const Promise = require("bluebird");
require("dotenv").config();

//設定資料庫連結
let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings:true,
});

//connection->Promise化
connection = Promise.promisifyAll(connection);

module.exports = connection;
  
const axios = require("axios");
const moment = require("moment");
const fs = require("fs/promises");
const mysql= require('mysql');
//bluebird沒有promise
const Promise = require("bluebird");
require('dotenv').config()

// 設定資料庫初始化
let connection = mysql.createConnection({
 host: process.env.DB_HOST,
 port: process.env.DB_PORT,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_NAME,
});

connection = Promise.promisifyAll(connection);

(async function() {
try {

// Promise後函式後面要加上Async
await connection.connectAsync();

let data = await fs.readFile("stock.txt", "utf8");
console.log (`讀到的 stock code: ${data}`);

//檢查資料是否在資料庫中
let stock = await connection.queryAsync(
  `SELECT stock_id FROM stock WHERE stock_id = ${data}`
);
console.log(stock);

//如果小於等於0資料庫無資料，則抓資料
if (stock.length <= 0) {
  console.log ("atart to query")
  let response = await axios.get(
    `https://www.twse.com.tw/zh/api/codeQuery?query=${data}`
  );
let answer = response.data.suggestions.shift();
let answers = answer.split("\t");

//如果大於1寫回資料庫
if(answers.length > 1) {
  connection.queryAsync(
    `INSERT INTO stock (stock_id, stock_name) VALUES ('${answers[0]}','${answers[1]}');`
  );
  
}else{
  console.log("無資料");
}
}
}catch (err) {
  console.error(err);

//連線成功後勿務將它關閉
} finally {
  connection.end();
}

})();
const axios = require("axios");
const moment = require("moment");
const fs = require("fs/promises");
const mysql= require('mysql');
const Promise = require("bluebird");

// 設定初始化
let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'stock'
});

connection = Promise.promisifyAll(connection);

(async function() {
try {

// Promise後函式後面要加上Async
await connection.connectAsync();

let data = await fs.readFile("stock.txt", "utf8");
console.log (`讀到的 stock code: ${data}`);
let stock = await connection.queryAsync(
  `SELECT stock_id FROM stock WHERE stock_id = ${data}`
);
console.log(stock);

// 檢查資料長度是否小於等於0，小於等於0則抓資料
if (stock.length <= 0) {
  console.log ("atart to query")
  let response = await axios.get(
    `https://www.twse.com.tw/zh/api/codeQuery?query=${data}`
  );
let answer = response.data.suggestions.shift();
let answers =answer.split("\t");

//如果大於1寫入資料庫
if(answers.length > 1) {
  connection.queryAsync(
    `INSERT INTO stock (stock_id, stock_name) VALUES ('${answers[0]}','${answers[1]}');`
  );
}
}
}catch (err) {
  console.error(err);

//連線成功後勿務將它關閉
} finally {
  connection.end();
}

})();
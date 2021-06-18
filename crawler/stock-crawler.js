const axios = require("axios");
const fs = require("fs/promises");
const Promise = require("bluebird");
const sys_date = require("moment");
const connection = require("./db");
const twse = require("./twse")

// 用await
(async function () {
      try {
        await connection.connectAsync();

        let stockId = await fs.readFile("stock.txt", "utf-8");
        
        let stockCode = stockId.split("\r\n");
        for (let i=0; i < stockCode.length; i++) {
            if (stockCode[i] !==""){
                // 查詢資料庫是否有股票代碼
                let stock = await connection.queryAsync(`SELECT stock_id FROM stock WHERE stock_id = ${stockCode[i]}`);

                // 查詢證交所是否有此股票，執行 axios 抓取
                if (stock.length <= 0) {
                  let response = await axios.get(`https://www.twse.com.tw/zh/api/codeQuery?query=${stockCode[i]}`);
                    checkStock(response.data.suggestions[0]);      
                };
                
                // 抓取的資料有 [stock_id, stock_name] ,寫入資料庫
                function checkStock(resData){
                  let answers = resData.split("\t");
                  if (answers.length > 1) {
                      connection.queryAsync(`INSERT INTO stock (stock_id, stock_name) VALUES (?);`,[answers]
                      );
                    } else {
                      throw "查詢股票名稱錯誤";
                    }
              };

                // 表示 stock 裡，已經有該 stock id 跟 name 了
                let response = await axios.get(
                    "https://www.twse.com.tw/exchangeReport/STOCK_DAY",
                    {
                      params: {
                        response: "json", 
                        date: sys_date().format("YYYYMMDD"), 
                        stockNo: stockCode[i],
                              },
                      }
                );

                // 查無此股票代碼
                if (response.data.stat !== "OK") {
                  throw "查詢股價失敗";
                }; 

                // 處理insert資料
                function replace(stockData, stockCode){
                  stockData = stockData.map((value) => {return value.replace(/,/g, "");});
                  stockData[0] = parseInt(stockData[0].replace(/\//g, ""), 10) + 19110000;
                  stockData[0] = sys_date(stockData[0], "YYYYMMDD").format("YYYY-MM-DD");
                  stockData.unshift(stockCode);
                  console.log(`交易日期 : ` + stockData[1] + `   收盤價格 : ` + stockData[6]);
                  return stockData;
              };

                // 寫進stock-price資料庫欄位
                let stockData = response.data.data;
                let prepareData = response.data.data.map((stockData) => {
                          return replace(stockData, stockCode[i]);
                        }
                );
                await connection.queryAsync(`INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?`, [prepareData]);
                console.log(`股票代碼： ${stockCode[i]} 已完成更新\n\n`);
                      };
                  };
                } catch (err) {
                  console.error("我是 catch");
                  console.error(err);
                } finally {
                  connection.end();
                };
              })();


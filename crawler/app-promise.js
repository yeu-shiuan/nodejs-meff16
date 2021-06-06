const axios = require("axios");

const fs = require("fs");

// fs.readFile("stock.txt", "utf8", (err, data) => {
//   if (err) {
//     return console.error("讀檔錯誤", err);
//   }
//   console.log(`讀到的 stock code: ${data}`);

function readFilePromise() {
return new Promise((resolve, reject) => {
           fs.readFile("stock.txt", "utf8", (err, data) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }
    
    readFilePromise()
            
            .then((data) => {
                return axios
            .get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
            params: {
                response: "json",
                date: "20210530",
                stockNo: data,
            },
            })
            .then(function (response) {
            if (response.data.stat === "OK") {
                console.log(response.data.date);
                console.log(response.data.title);
            }
            });
        })
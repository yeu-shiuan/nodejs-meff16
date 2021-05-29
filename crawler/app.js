//https://www.twse.com.tw/exchangeReport/STOCK_DAY?
//?response=json
//&date=20210523
//&stockNo=2610

const axios = require("axios");

axios
.get(
    "https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20210523&stockNo=2610"
)
.then(function (response){
    console.log(response);
    if(response.data.stat === "OK"){
        console.log(response.data.data);
        console.log(response.data.title);
    }
})
.catch(function(error){
    console.log(error);
})
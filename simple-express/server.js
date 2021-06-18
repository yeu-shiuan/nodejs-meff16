const connection =require("./utils/db")
const express = require("express");
let app = express();

// 可指定一個或多個目錄是「靜態資源目錄」
// 自動幫你為public裡面的檔案建立路由
app.use(express.static("public"));// 必須建立在所有中間件上面


// 第一個是變數views
// 第二個是檔案夾名稱S
app.set("views","views");
// 告訴 express 我們用的 view engine 是 pug
app.set("view engine","pug");

app.use(function (req, res, next) {
  console.log("Middleware");
  next();
});

// 中間件 middleware
app.use(function(req, res, next){
  let current = new Date();
  console.log(`有人來訪問了在${current}`)
  next();
})

// 路由router  (request, response){} 去回應這個請求
// 由上而下找，找到就停住了，不會在往下一個同樣的執行
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/test", function (req, res) {
  res.send("Test Express");
});

app.get("/stock/list",async (req, res)=>{
  let queryResults = await connection.queryAsync("SELECT * FROM stock;")
  res.render("stock/list", {
    stocks: queryResults,
  });
})

app.listen(3000, async()=>{
    // 在 web server 開始的時候連結
    await connection.connectAsync();
    console.log(`跑起來 3000 Port`);
});
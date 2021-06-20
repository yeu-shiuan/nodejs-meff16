const connection = require("./utils/db");
require("dotenv").config();
const express = require("express");
let app = express();

// 可指定一個或多個目錄是「靜態資源目錄」
// 自動幫你為public裡面的檔案建立路由
app.use(express.static("public"));// 必須建立在所有中間件上面

//加上這個中間件，可以解讀 post 過來的資料
app.use(express.urlencoded({extended: false}));
// 前端取得json data 用 express
app.use(express.json());
//要拿到cookie
const cookieParser = require("cookie-parser");
app.use(cookieParser());
//要處理session
const expressSession = require("express-session");
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);


// 第一個是變數views
// 第二個是檔案夾名稱S
app.set("views","views");
// 告訴 express 我們用的 view engine 是 pug
app.set("view engine","pug");

//中間函式可以給每個路由使用
app.use(function(req, res, next){
  res.locals.member = req.session.member;
  next();
})

// 中間件 middleware
app.use(function(req, res, next){
  let current = new Date();
  console.log(`有人來訪問了在${current}`)
  next();
})

app.use(function(req, res, next){
  if(req.session.message){
    res.locals.massage =req.session.message;
    delete req.ression.message;
  }
  next();
})

let stockRouter = require("./routes/stock");
app.use("/stock", stockRouter);
let apiRouter = require("./routes/api");
app.use("/api", apiRouter);
let authRouter = require("./routes/auth");
app.use("/auth", authRouter);
let memberRouter = require("./routes/member");
app.use("/member", memberRouter);

// 路由router  (request, response){} 去回應這個請求
// 由上而下找，找到就停住了，不會在往下一個同樣的執行
app.get("/", function (req, res) {
  // res.send("Hello Express BBB");
  console.log("這裡是首頁");

  res.cookie("lang", "zh-TW");

  res.render("index");
  // views/index.pug
});

app.get("/about", function (req, res, next) {
  // res.send("About Express AAAA");
  res.render("about");
});

app.get("/test", function (req, res) {
  // res.send("Test Express");
  next();
});

app.use(function (req, res, next) {
  console.log("啊啊啊，有人 404 了!!!");
  next();
});

// 所有的路由的下面
app.use(function (req, res, next) {
  // 表示前面的路由都找不到
  // http status code: 404
  res.status(404);
  res.render("404");
});

// 500 error
// 放在所有的路由的後面
// 這裡一定要有4個參數-->最後的錯誤處理
// express 預設的錯誤處理函式
app.use(function (err, req, res, next) {
  console.log("ERROR:", err);
  res.status(500);
  res.send("500 - Internal Sever Error 請洽系統管理員");
});

app.listen(3000, async () => {
  // 在 web server 開始的時候，去連線資料庫
  await connection.connectAsync();
  console.log(`我跑起來了喔 在 port 3000`);
});
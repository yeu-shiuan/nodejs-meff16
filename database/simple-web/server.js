// https://nodejs.org/docs/latest-v14.x/api/http.html
// http 是 nodejs 內建 web server 不用安裝
const http = require ("http");

 //request 是請求物件
const server = http.createServer((req, res) => {
  console.log("有連線進來了");
  console.log(req.url);

  //response 是回覆物件
  res.statusCode = 200; 
  res.setHeader("Content-Type", "text/plain;charset=UTF-8");
  
switch(req.url){
    case "/":
        res.end("Hi 這是首頁");
        break;
    case "/test":
        res.end("這是測試頁面");
        break;
    case "/about":
        res.end("這是關於我們");
        break;
        default:
        res.writeHead(404);
        res.end("找不到網頁");
 }
});


server.listen(3000, () => {
  console.log("跑起來，收3000 port");
});

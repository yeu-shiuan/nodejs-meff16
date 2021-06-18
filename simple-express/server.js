const express = require("express");
let app = express();

// middleware 中間件
app.use(function(req, res, next){
    let current = new Date();
    console.log(`有人來訪問了 在 ${current}`)
    next();
})

// 可指定一個或多個目錄是「靜態資源目錄」
// 自動幫你為public裡面的檔案建立路由
app.use(express.static("public"));// 必須建立在所有中間件上面


// 路由router  (request, response){} 去回應這個請求
// 由上而下找，找到就停住了，不會在往下一個同樣的執行
app.get("/",function(req,res){
    res.send("Hello Express")
});

app.get("/about",function(req,res){
    res.send("About Express") 
});

app.get("/test",function(req,res){
    res.send("test Express")
});

app.listen(3000, ()=>{
    console.log(`跑起來 3000 Port`);
});
const express = require("express");
let app = express();

//middleware 中間件
app.use(function(req, res, next){
    let current = new Date();
    console.log(`有人來訪問了 在 ${current}`)
    next();
})

//路由 router
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
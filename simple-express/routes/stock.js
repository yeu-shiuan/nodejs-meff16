const express = require("express");
const router = express.Router();

const connection =require("../utils/db")

router.get("/",async (req, res)=>{
  let queryResults = await connection.queryAsync("SELECT * FROM stock;")
  res.render("stock/list", {
    stocks: queryResults,
  });
   res.render("stock/detail", {
    stockPrices: queryResults,
  });
})

router.get("/:stockCode", async (req, res) => {
  let queryResults = await connection.queryAsync(
    "SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date;",
    req.params.stockCode
  );
  res.render("stock/detail", {
    stockPrices: queryResults,
  });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

module.exports = router;

router.get("/", async (req, res) => {
  let queryResults = await connection.queryAsync("SELECT * FROM stock;");
  res.render("stock/list", {
    stocks: queryResults,
  });
});

router.get("/:stockCode", async (req, res) => {
  let stock = await connection.queryAsync(
    "SELECT * FROM stock WHERE stock_id=?;",
    req.params.stockCode
  );

  if (stock.length === 0) {
    throw new Error("查無代碼");
  }
  stock = stock[0];

  //分頁
  let count = await connection.queryAsync(
    "SELECT COUNT(*) as total FROM stock_price WHERE stock_id =?;",
    req.params.stockCode
  );
  
  const total = count[0].total; // 總頁數
  const perPage = 10; 
  const lastPage = Math.ceil(total / perPage); 

  const currentPage = req.query.page || 1;
  const offset = (currentPage - 1) * perPage;

  let queryResult = await connection.queryAsync(
    "SELECT *FROM stock_price WHERE stock_id = ? ORDER BY date LIMIT ? OFFSET ?;",[req.params.stockCode, perPage, offset]);

  // pagination 包所有需要的變數
  res.render("stock/detail", {
    stock,
    stockPrices: queryResult,
    pagination: {
      lastPage,
      currentPage,
      total,
    },
  });
});
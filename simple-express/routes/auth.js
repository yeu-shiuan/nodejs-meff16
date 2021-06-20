const express = require("express");
const router = express.Router();
const connection = require("../utils/db");
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcrypt");
const path =require("path"); // 內件模組
const multer =require("multer");

// 設定上傳檔案的儲存方式
const myStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      console.log("AAA")
    // routes/auth.js --> 現在位置
    // public/uploads --> 希望上傳儲存的位置
    // __dirname: ..../routes/../public/uploads
    cb(null, path.join(__dirname, "../", "public", "uploads"));
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    // 組合出自己想要的檔案名稱
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});
// 要用 multer 來做一個上傳工具
const uploader = multer({
  storage: myStorage,
  fileFilter: function (req, file, cb) {
    // console.log(file);
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      return cb(new Error("不合法的 file type"), false);
    }
  
    // if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    //   return cb(new Error("是不合格的副檔名"));
    // }
    // 檔案ＯＫ, 接受這個檔案
    cb(null, true);
  },
  limits: {
    // 限制檔案的上限 1M
    fileSize: 1024 * 1024,
  },
});

router.get("/register", (req, res) => {
  res.render("auth/register");
});

// 註冊表單資料的驗證規則
const registerRules = [
  // 確認 Email 格式是否正確
  body("email").isEmail().withMessage("請正確輸入 Email 格式"),
  // 密碼限制至少 6碼以上
  body("password").isLength({ min: 6 }),
  body("confirmPassword").custom((value, { req }) => {
    return value === req.body.password;
  }),
];

router.post("/register",uploader.single("photo"),registerRules,
  async (req, res, next) => {
      console.log(req.body);

    const validateResult = validationResult(req);
    if (!validateResult.isEmpty()) {
      console.log(validateResult);
      return next(new Error("註冊表單資料有問題"));
    }

    // 先檢查這個 Email 是否已經註冊過
    let checkResult = await connection.queryAsync(
      "SELECT * FROM members WHERE email = ?",
      req.body.email
    );
    console.log(checkResult)
    // 如果已經註冊過
    if (checkResult.length > 0) {
      return next(new Error("已經註冊過了"));
    }
    let filepath = req.file ? "/uploads/" + req.file.filename : null;
    // 沒有註冊過，新增一筆到資料庫
    // bcrypt是密碼加密套件，套件記得都要 require 進來才能使用
    let result = await connection.queryAsync(
        "INSERT INTO members (email, password, name, photo) VALUES (?);",
        [[req.body.email,
            await bcrypt.hash(req.body.password, 10),
            req.body.name,
            filepath]]
    );
    res.send("註冊成功");
  }
);
router.get("/login", (req, res) => {
  res.render("auth/login");
});

module.exports = router;
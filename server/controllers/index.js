require("dotenv").config();
const { Router } = require("express");
const router = Router();
const { users } = require("../models");
const { getMyPost } = require("../controllers/GetMyPost");
const jwt = require("jsonwebtoken");
const { getMyInfo } = require("./GetMyInfo");

//아이디 닉네임 모바일 비밀번호

router.post("/sign-up", (req, res) => {
  const { id, password, userName, mobile, signUpType } = req.body;
  console.log(id, password, userName, mobile, signUpType);
  if (!id || !password || !userName || !mobile) {
    return res.status(422).send("insufficient parameters supplied");
  }
  passwordToken = jwt.sign(password, process.env.ACCESS_SECRET);
  users
    .findOrCreate({
      where: {
        user_id: id,
      },
      default: {
        password,
        nickname: userName,
        phone_number: mobile,
        sign_up_type: signUpType,
        account_type: "client",
      },
    })
    .then(([result, created]) => {
      if (!created) {
        return res.status(409).send("id exists");
      }
      const data = result.dataValues;
      return res.status(201).json({ message: "ok" });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/", (res, req) => {
  res.send("hello world!");
});

router.get("/user/posting-list/:id", getMyPost);

router.get("/user/:id", getMyInfo);

module.exports = router;

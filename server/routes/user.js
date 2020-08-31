const express = require("express");
const jwt = require("jsonwebtoken");
const jwtKey = require("../config/jwt");
const bcrypt = require("bcrypt");
const rounds = 10; //암호 자릿수
//커넥션 설정
const pool = require("../config/pool"); //pool을 가져온다.
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/login", async (req, res) => {
  //로그인
  const sql = "SELECT user_no,user_password FROM user_info WHERE user_id = ?";
  const { id, password } = req.body;

  try {
    const [result, fields] = await pool.query(sql, [id]);

    if (result.length > 0) {
      //비밀번호 복호화
      bcrypt.compare(password, result[0].user_password, function (err, match) {
        console.log(match);
        if (match) {
          // 토큰생성
          const token = jwt.sign(
            {
              userNo: result[0].user_no, //db의 유저넘버
            },
            jwtKey.secret,
            {
              expiresIn: "5h", //지속시간
            }
          );
          // 쿠키저장
          res.cookie("user", token);
          res.json({ success: true, user: token });
        } else {
          res.json({
            success: false,
            message: "비밀번호가 일치하지 않습니다.",
          });
        }
      });
    } else {
      res.json({ success: false, message: "아이디가 일치하지 않습니다." });
    }
  } catch (err) {
    throw err;
  }
});

router.get("/logout", (req, res) => {
  if (req.cookies.user) {
    //로그아웃하려는 쿠키가 있을때
    res.clearCookie("user");
    res.json({ success: true, message: "로그아웃 성공" });
  } else {
    res.json({ success: false, message: "로그아웃 에러" });
  }
});

router.post("/signup", async (req, res) => {
  //회원가입
  //틀린 정보를 전부다 알려줄 것이므로 일일히 처리함.(이메일,아이디,닉네임)
  const sqlEmail = "SELECT user_email FROM user_info WHERE user_email = ?";
  const sqlId = "SELECT user_id FROM user_info WHERE user_id = ?";
  const sqlNickname =
    "SELECT user_nickname FROM user_info WHERE user_nickname = ?";
  const sqlCreate =
    "INSERT INTO user_info values (null,?,?,?,?,null,null,now(),null,0)";
  const { email, id, password, nickname } = req.body;
  const params = [email, id, password, nickname];
  try {
    const dbEmail = await pool.query(sqlEmail, [email]);
    console.log(dbEmail[0].length);
    if (dbEmail[0].length > 0) {
      return res.json({ success: false, message: "중복된 이메일 입니다." });
    }
    const dbId = await pool.query(sqlId, [id]);
    console.log(dbId[0].length);
    if (dbId[0].length > 0) {
      return res.json({ success: false, message: "중복된 아이디 입니다." });
    }
    const dbNickname = await pool.query(sqlNickname, [nickname]);
    console.log(dbNickname[0].length);
    if (dbNickname[0].length > 0) {
      return res.json({ success: false, message: "중복된 닉네임 입니다." });
    }
    //비밀번호 암호화
    bcrypt.hash(password, rounds, async function (err, hash) {
      const result = await pool.query(sqlCreate, [email, id, hash, nickname]);
      console.log(result);
      return res.json({ success: true, result: result });
    });
  } catch (err) {
    throw err;
  }
});

router.get("/auth", auth, (req, res) => {
  //페이지간 인증구현
  //미들웨어에서 받아온 정보 전달

  res.json({
    _id: req.user.user_id,
    _nickname: req.user.user_nickname,
    _no: req.user.user_no,
    isAuth: true, //로그인 되어 있는 상태를 같이 전달
  });
});

module.exports = router;

const jwt = require("jsonwebtoken");
const jwtKey = require("../config/jwt");
const pool = require("../config/pool"); //pool을 가져온다.

const auth = (req, res, next) => {
  const sql = "SELECT user_id, user_nickname FROM user_info WHERE user_no = ?";
  //클라이언트측에서 쿠키를 가져온다.
  const token = req.cookies.user;
  console.log(token);
  console.log("??");
  if (!token) {
    return res.json({ isAuth: null, error: "로그인이 필요합니다." });
  } else {
    //쿠키 복호화한후 그 유저가 있는지 db에서 찾고 찾으면 넘겨준다.
    jwt.verify(token, jwtKey.secret, async function (err, decoded) {
      if (err) return res.json({ isAuth: false, error: "서버 오류" });
      try {
        const [result, fields] = await pool.query(sql, [decoded.userNo]);
        req.user = result[0]; //req에 넣어서 다음 미들웨어에게 전달
        next();
      } catch {
        return res.json({ isAuth: false, error: "서버 오류" });
      }
    });
  }
};

module.exports = auth;

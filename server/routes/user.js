const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const jwtKey = require("../config/jwt");
const bcrypt = require("bcrypt");
const rounds = 10; //암호 자릿수
//커넥션 설정
const pool = require("../config/pool"); //pool을 가져온다.
const auth = require("../middleware/auth");
const router = express.Router();

const storage = multer.diskStorage({
  //파일 저장 환경설정
  destination: (req, file, cb) => {
    cb(null, "uploads/profile/");
  },
  filename: (req, file, cb) => {
    //저장할때는 날짜 + 파일명
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    //파일 형식 이미지만
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("이미지 파일만 올 수 있습니다"));
    }
  },
});

router.post("/upload/profile", upload.single("profile"), (req, res) => {
  //미들웨어를 거쳤으므로 통과
  res.json({ success: true, url: req.file.path });
});

router.post("/login", async (req, res) => {
  //로그인
  const sql = "SELECT user_no,user_password FROM user_info WHERE user_id = ?";
  const { id, password } = req.body;

  try {
    const [result, fields] = await pool.query(sql, [id]);

    if (result.length > 0) {
      //비밀번호 복호화
      bcrypt.compare(password, result[0].user_password, function (err, match) {
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
          res.cookie("user", token, {
            httpOnly: true,
            secure: true,
            domain: "https://dn9g4x7ek29ym.cloudfront.net",
          });
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
  try {
    const dbEmail = await pool.query(sqlEmail, [email]);
    if (dbEmail[0].length > 0) {
      return res.json({ success: false, message: "중복된 이메일 입니다." });
    }
    const dbId = await pool.query(sqlId, [id]);
    if (dbId[0].length > 0) {
      return res.json({ success: false, message: "중복된 아이디 입니다." });
    }
    const dbNickname = await pool.query(sqlNickname, [nickname]);
    if (dbNickname[0].length > 0) {
      return res.json({ success: false, message: "중복된 닉네임 입니다." });
    }
    //비밀번호 암호화
    bcrypt.hash(password, rounds, async function (err, hash) {
      const result = await pool.query(sqlCreate, [email, id, hash, nickname]);
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
    _email: req.user.user_email,
    _imgFile: req.user.user_img,
    _description: req.user.user_description,
    isAuth: true, //로그인 되어 있는 상태를 같이 전달
  });
});
//금주의 요리사
router.get("/ranking", async (req, res) => {
  //최근순
  const sql = `select ui.user_no,ui.user_nickname nick, count(distinct bl.board_no,bl.user_no) as likes
  from board b left join board_like bl on bl.board_no = b.board_no and bl.is_like = 1
  left join user_info ui on ui.user_no = b.user_no
  group by user_no
  having likes > 0
  order by likes desc limit 10`;
  try {
    const [result] = await pool.query(sql);
    if (result.length > 0) {
      return res.json({ success: true, result: result });
    } else {
      return res.json({ success: true, result: [] });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  }
});
//회원정보수정
router.post("/edit", async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  const {
    userNo,
    imgFile,
    email,
    nickname,
    description,
    password,
    newPassword,
  } = req.body;
  const sql = `update user_info set user_img = ?,
  user_email = ?,user_nickname = ?,user_description = ?,user_password = ?
  where user_no = ?`;

  const userSql = `SELECT user_password,user_email,user_id, user_nickname,user_img,user_description 
    FROM user_info WHERE user_no = ?`;

  const emailSql = `SELECT user_no FROM user_info WHERE user_email = ?`;
  const nicknameSql = `SELECT user_no FROM user_info WHERE user_nickname = ?`;
  try {
    //유저 정보를 찾는다.
    const userData = await connection.query(userSql, [userNo]); //유저 정보를 받아온다.
    if (userData[0][0].user_email !== email) {
      //db 이메일과 body의 이메일이 같지 않으면 변경된 것으로 간주
      const emailData = await connection.query(emailSql, [email]);
      if (emailData[0].length > 0) {
        return res.json({ success: false, message: "중복된 이메일 입니다." });
      }
    }
    if (userData[0][0].user_nickname !== nickname) {
      const nicknameData = await connection.query(nicknameSql, [nickname]);
      if (nicknameData[0].length > 0) {
        return res.json({ success: false, message: "중복된 닉네임 입니다." });
      }
    }
    if (password && newPassword) {
      //패스워드가 있을때는 현재 패스워드가 일치하는지 비교후 변경
      const match = await bcrypt.compare(
        password,
        userData[0][0].user_password
      );

      if (match) {
        //맞으면 변경
        console.log("비밀번호 확인");
        //비밀번호 암호화
        bcrypt.hash(newPassword, rounds, async function (err, hash) {
          const data = await connection.query(sql, [
            imgFile,
            email,
            nickname,
            description,
            hash,
            userNo,
          ]);
          if (data[0].affectedRows > 0) {
            await connection.commit();
            res.json({ success: true, message: "수정 완료!" });
          }
        });
      } else {
        res.json({
          success: false,
          message: "현재 비밀번호가 일치하지 않습니다.",
        });
      }
    } else {
      //변경할 패스워드가 없을때
      const data = await connection.query(sql, [
        imgFile,
        email,
        nickname,
        description,
        userData[0][0].user_password,
        userNo,
      ]);
      if (data[0].affectedRows > 0) {
        await connection.commit();
        res.json({ success: true, message: "수정 완료!" });
      }
    }
  } catch (err) {
    await connection.rollback(); //롤백
    console.log(err);
    return res.json({ success: false, message: "서버에 오류가 발생했습니다." });
  } finally {
    connection.release();
  }
});

router.get("/posts/:no/:type/:limit", async (req, res) => {
  //마이 페이지 포스트 불러오기 or 유저페이지 풀러오기
  const { no, type, limit } = req.params;
  //내가 쓴글
  const sql = `select b.board_no,b.title,ui.user_no,ui.user_nickname writer ,ui.user_img user_img,b.board_img,b.description,b.food_type,b.board_views,count(distinct c.co_no) co,count(distinct bl.user_no) likes, 
  date_format(b.created_date,'%Y-%m-%d') date from board b 
  left join comment c on b.board_no = c.board_no and c.isdeleted = 0
  left join user_info ui on b.user_no = ui.user_no
  left join board_like bl on b.board_no = bl.board_no and bl.is_like = 1
  where b.isdeleted = 0 and b.user_no = ? group by board_no order by board_no desc
  limit 10 offset ?`;
  //스크랩한 게시물
  //count에 조건을 걸어 가져온다. 중복된 컬럼을 제거하고 가져왔으므로
  //좋아요를 눌렀다면 무조건 1이 나오게 된다.
  const likeSql = `select b.board_no,b.title,ui.user_no,ui.user_nickname writer ,ui.user_img user_img,b.board_img,b.description,b.food_type,b.board_views,count(distinct c.co_no) co,count(distinct bl.user_no) likes, 
  count(distinct case when bl.user_no = ? then 1 end) liked, date_format(b.created_date,'%Y-%m-%d') date from board b 
  left join comment c on b.board_no = c.board_no and c.isdeleted = 0
  left join user_info ui on b.user_no = ui.user_no
  left join board_like bl on b.board_no = bl.board_no and (bl.is_like = 1)
  where b.isdeleted = 0 group by board_no having liked > 0 order by board_no desc
  limit 10 offset ?`;

  try {
    if (type === "mypost") {
      //내가쓴글
      const [result] = await pool.query(sql, [no, parseInt(limit)]);
      if (result.length > 0) {
        return res.json({ success: true, result: result });
      } else {
        return res.json({ success: true, result: [] });
      }
    } else {
      //스크랩
      const [result] = await pool.query(likeSql, [no, parseInt(limit)]);
      if (result.length > 0) {
        //liked컬럼이 0이 아니면 자기가 좋아요한 포스트
        return res.json({ success: true, result: result });
      } else {
        return res.json({ success: true, result: [] });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  }
});

router.get("/profile/:no", async (req, res) => {
  //유저페이지 유저정보
  const { no } = req.params;
  //내가 쓴글
  const sql = `select user_nickname,user_description,user_img from user_info where user_no = ?`;
  try {
    const [result] = await pool.query(sql, [no]);
    if (result.length > 0) {
      return res.json({ success: true, result: result[0] });
    } else {
      return res.json({ success: true, result: false });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  }
});

module.exports = router;

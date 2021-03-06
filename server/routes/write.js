const express = require("express");
const multer = require("multer");
//커넥션 설정
const pool = require("../config/pool"); //pool을 가져온다.
const router = express.Router();

const storage = multer.diskStorage({
  //파일 저장 환경설정
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    //저장할때는 날짜 + 파일명
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const orderStorage = multer.diskStorage({
  //요리순서 이미지 파일 저장 환경설정
  destination: (req, file, cb) => {
    cb(null, "uploads/orderimg/");
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

const cUpload = multer({
  //요리 순서 폴더 지정
  storage: orderStorage,
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

router.post("/upload/headerimg", upload.single("headerimg"), (req, res) => {
  //미들웨어를 거쳤으므로 통과
  res.json({ success: true, url: req.file.path });
});

router.post("/upload/orderimg", cUpload.single("orderimg"), (req, res) => {
  //요리 순서 사진
  res.json({ success: true, url: req.file.path });
});

router.post("/upload/board", async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  const {
    writer,
    title,
    description,
    category,
    cookingOrder,
    mainPhoto,
    Ingredients,
    tag,
  } = req.body;
  const boardParams = [
    writer, //board 테이블용
    title,
    description,
    mainPhoto,
    category.type,
    category.time,
    category.difficulty,
  ];

  const sqlBoard = "INSERT INTO board values (null,?,?,?,?,?,?,?,0,now(),0)";
  const sqlIngre = "INSERT INTO board_ingredient values (null,?,?,?,0)";
  const sqlText = "INSERT INTO board_text values (null,?,?,?,0)";
  const sqlTag = "INSERT INTO board_tag values (null,?,?,0)";
  try {
    //board테이블 컬럼추가
    const board = await connection.query(sqlBoard, boardParams);
    let boardNo = board[0].insertId; //추가에 성공하면 id값 할당
    //board_no를 참조하여 ingre테이블 컬럼추가
    for (key in Ingredients) {
      await connection.query(sqlIngre, [
        boardNo,
        Ingredients[key].name,
        Ingredients[key].volume,
      ]);
    }
    //board_text 테이블 컬럼추가
    for (key in cookingOrder) {
      await connection.query(sqlText, [
        boardNo,
        cookingOrder[key].orderPhoto,
        cookingOrder[key].text,
      ]);
    }
    //태그가 있으면 tag테이블 컬럼추가
    if (tag.length > 0) {
      for (key in tag) {
        await connection.query(sqlTag, [boardNo, tag[key].tagName]);
      }
    }
    await connection.commit();
    res.json({ success: true, message: "게시글 업로드 완료." });
  } catch (err) {
    await connection.rollback(); //롤백
    console.log(err);
    return res.json({ success: false, message: "추가 실패" });
  } finally {
    connection.release();
  }
});
module.exports = router;

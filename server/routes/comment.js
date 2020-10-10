const express = require("express");
//커넥션 설정
const pool = require("../config/pool"); //pool을 가져온다.
const router = express.Router();

//댓글 추가,삭제
router.post("/", async (req, res) => {
  const sql = `insert into comment values (null,?,?,?,now(),0)`;
  const { user_no, bo_no, co } = req.body;
  const params = [user_no, bo_no, co];
  try {
    const [result] = await pool.query(sql, params);
    console.log(result.affectedRows);
    if (result.affectedRows > 0) {
      //affectedRows가 있으면 데이터가 변경 되었다는 뜻
      return res.json({ success: true });
    } else {
      return res.json({
        success: false,
        message: "잠시 후 다시 시도해주세요.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  }
});

router.delete("/:id", async (req, res) => {
  const sql = `update comment set isdeleted = 1 where co_no = ?`;
  console.log(req.params.id);
  try {
    const [result] = await pool.query(sql, [req.params.id]);
    console.log(result.affectedRows);
    if (result.affectedRows > 0) {
      return res.json({ success: true });
    } else {
      return res.json({
        success: false,
        message: "잠시 후 다시 시도해주세요.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  }
});

//댓글 좋아요
router.get("/getLike/:id", async (req, res) => {
  const sql = `select distinct user_no, is_like from comment_like where co_no = ?`;
  console.log(req.params.id); //코멘트넘버
  try {
    const [result] = await pool.query(sql, [req.params.id]);
    console.log(result);
    if (result.length > 0) {
      return res.json({ success: true, result: result });
    } else {
      return res.json({
        success: true, //없을때
        result: [],
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  }
});

router.post("/like", async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  const findSql = `select user_no from comment_like where co_no = ? and user_no = ?`;

  //유저가 있으면 update, 없으면 새로 넣어준다.
  const createSql = `insert into comment_like values (null,?,?,?,1)`; //없을때
  const updateSql = `update comment_like set is_like = 1 where co_no = ? and user_no = ?`; //있을때
  const { user, coNo, boNo } = req.body;
  try {
    const [userResult] = await connection.query(findSql, [coNo, user]); //코멘트 넘버와 유저넘버
    if (userResult.length > 0) {
      //있다면 업데이트
      const [data] = await connection.query(updateSql, [coNo, user]);
      if (data.affectedRows > 0) {
        await connection.commit();
        return res.json({ success: true });
      }
    } else {
      //없으면 새로 만든다.
      const [newData] = await connection.query(createSql, [boNo, coNo, user]);
      if (newData.affectedRows > 0) {
        await connection.commit();
        return res.json({ success: true });
      }
    }
  } catch (err) {
    await connection.rollback(); //롤백
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  } finally {
    connection.release();
  }
});

router.post("/unlike", async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  const findSql = `select user_no from comment_like where co_no = ? and user_no = ?`;

  //유저가 있으면 update, 없으면 새로 넣어준다.
  const createSql = `insert into comment_like values (null,?,?,?,2)`; //없을때
  const updateSql = `update comment_like set is_like = 2 where co_no = ? and user_no = ?`; //있을때
  const { user, coNo, boNo } = req.body;
  try {
    const [userResult] = await connection.query(findSql, [coNo, user]); //코멘트 넘버와 유저넘버
    if (userResult.length > 0) {
      //있다면 업데이트
      const [data] = await connection.query(updateSql, [coNo, user]);
      if (data.affectedRows > 0) {
        await connection.commit();
        return res.json({ success: true });
      }
    } else {
      //없으면 새로 만든다.
      const [newData] = await connection.query(createSql, [boNo, coNo, user]);
      if (newData.affectedRows > 0) {
        await connection.commit();
        return res.json({ success: true });
      }
    }
  } catch (err) {
    await connection.rollback(); //롤백
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  } finally {
    connection.release();
  }
});

router.post("/refreshlike", async (req, res) => {
  //이미 눌러져 있을때
  const sql = `update comment_like set is_like = 0 where co_no = ? and user_no = ?`; //있을때
  const { user, coNo } = req.body; //코멘트 넘버와 유저넘버

  try {
    const [result] = await pool.query(sql, [coNo, user]);
    if (result.affectedRows > 0) {
      res.json({ success: true });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  }
});
module.exports = router;

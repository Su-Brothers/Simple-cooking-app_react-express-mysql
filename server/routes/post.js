const express = require("express");
//커넥션 설정
const pool = require("../config/pool"); //pool을 가져온다.
const router = express.Router();

router.get("/getposts", async (req, res) => {
  const sql = `select board.board_no,board.title, user_info.user_nickname as writer,board.board_img,date_format(board.created_date,'%Y-%m-%d') as date from board
   left join user_info on board.user_no = user_info.user_no
   where board.isdeleted = 0`;

  try {
    const [result, fields] = await pool.query(sql);
    if (result.length > 0) {
      console.log(result);
      return res.json({ success: true, posts: result });
    } else {
      return res.json({ success: false, message: "포스트가 없습니다." });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  }
});

router.get("/:postId", async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  const headerSql = `select title,board_img, description, cook_time,cook_diff,food_type,date_format(created_date,'%Y-%m-%d') as created_date 
   from board where board_no = ? and isdeleted = 0`; //헤더
  const ingreSql = `select ingre_no,ingre_name,ingre_volume from board_ingredient where board_no = ? and isdeleted = 0`; //재료
  const recipeSql = `select text_no, main_text,img_file from board_text where board_no = ? and isdeleted = 0`; //레시피
  const tagSql = `select tag_no, tag_name from board_tag where board_no = ? and isdeleted = 0`; //태그

  const coSql = `select user.user_no, user.user_nickname, co_no ,comment.co,date_format(comment.created_date,'%Y-%m-%d') as created_date from comment 
   left join user_info user on comment.user_no = user.user_no 
   where comment.board_no = ? and comment.isdeleted = 0`; //댓글

  try {
    let obj = {}; //담아서 보내줄 것 이다.
    const [header] = await connection.query(headerSql, [req.params.postId]);
    if (header.length > 0) {
      console.log(header);
      obj = { ...obj, header: header[0] };
    }
    const [ingre] = await connection.query(ingreSql, [req.params.postId]);
    if (ingre.length > 0) {
      console.log(ingre);
      obj = { ...obj, ingre: ingre };
    }
    const [recipe] = await connection.query(recipeSql, [req.params.postId]);
    if (recipe.length > 0) {
      console.log(recipe);
      obj = { ...obj, recipe: recipe };
    }
    const [tag] = await connection.query(tagSql, [req.params.postId]);
    if (tag.length > 0) {
      console.log(tag);
      obj = { ...obj, tag: tag };
    }
    const [co] = await connection.query(coSql, [req.params.postId]);
    if (co.length > 0) {
      console.log(co);
      obj = { ...obj, comment: co };
    }
    console.log(obj);
    await connection.commit();
    res.json({ success: true, result: obj });
  } catch (err) {
    await connection.rollback(); //롤백
    console.log(err);
    return res.json({ success: false, message: "포스트 로딩 실패" });
  } finally {
    connection.release();
  }
});

router.get("/getcomments/:postId", async (req, res) => {
  const sql = `select user.user_no,user.user_nickname, co_no ,comment.co,date_format(created_date,'%Y-%m-%d') as created_date from comment 
   left join user_info user on comment.user_no = user.user_no 
   where comment.board_no = ? and comment.isdeleted = 0`; //댓글

  try {
    const [result] = await pool.query(sql, [req.params.postId]);
    if (result.length > 0) {
      console.log(result);
      return res.json({ success: true, result: result });
    } else {
      return res.json({ success: false, message: "댓글이 없습니다." });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  }
});
module.exports = router;

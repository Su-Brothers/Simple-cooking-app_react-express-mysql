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
//수정 데이터 가져오기
router.get("/:postId/edit/getpost/:id", async (req, res) => {
  //포스트아이디와 유저아이디로 조회
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  const findSql = `select board_no from board where user_no = ? and board_no = ?`;
  const headerSql = `select board_no,user_no,title,board_img, description, cook_time,cook_diff,food_type,date_format(created_date,'%Y-%m-%d') as created_date 
  from board where board_no = ? and isdeleted = 0`; //헤더
  const ingreSql = `select ingre_no,ingre_name,ingre_volume from board_ingredient where board_no = ? and isdeleted = 0`; //재료
  const recipeSql = `select text_no, main_text,img_file from board_text where board_no = ? and isdeleted = 0`; //레시피
  const tagSql = `select tag_no, tag_name from board_tag where board_no = ? and isdeleted = 0`; //태그
  const { postId, id } = req.params;
  try {
    const [findResult] = await connection.query(findSql, [id, postId]);
    console.log(findResult);
    if (findResult.length > 0) {
      let obj = {}; //담아서 보내줄 것 이다.
      const [header] = await connection.query(headerSql, [postId]);
      if (header.length > 0) {
        console.log(header);
        obj = {
          ...obj,
          boardNo: header[0].board_no,
          userNo: header[0].user_no, //유저 넘버
          title: header[0].title, //제목
          description: header[0].description, //요리설명
          mainPhoto: header[0].board_img, //대표 사진
          category: {
            time: header[0].cook_time,
            difficulty: header[0].cook_diff,
            type: header[0].food_type,
          },
        };
      }
      const [ingre] = await connection.query(ingreSql, [postId]);
      if (ingre.length > 0) {
        obj = { ...obj, Ingredients: ingre };
      }
      const [recipe] = await connection.query(recipeSql, [postId]);
      if (recipe.length > 0) {
        obj = { ...obj, cookingOrder: recipe };
      }
      const [tag] = await connection.query(tagSql, [postId]);
      if (tag.length > 0) {
        obj = { ...obj, tag: tag };
      }
      console.log(obj);
      await connection.commit();
      res.json({ success: true, result: obj });
    } else {
      return res.json({ success: false, message: "접근 제한" });
    }
  } catch {
    await connection.rollback();
    return res.json({ success: false, message: "서버 오류" });
  } finally {
    connection.release();
  }
});
//게시글 수정
router.post("/:postId/edit", async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  const {
    title,
    description,
    category,
    cookingOrder,
    mainPhoto,
    Ingredients,
    tag,
  } = req.body.post;
  const { deleteIngre, deleteOrder, deleteTag } = req.body;
  const { postId } = req.params;
  const boardParams = [
    title,
    description,
    mainPhoto,
    category.type,
    category.time,
    category.difficulty,
    postId,
  ];

  //c: create
  //u: update
  //d: delete
  //const cSqlBoard = "INSERT INTO board values (null,?,?,?,?,?,?,?,now(),0)";

  //iId,cId,tId는 새로 생긴 데이터이므로 insert, 나머지는 update.
  //update sql
  const uSqlBoard = `update board set title = ?, description = ?, board_img = ?,
   food_type = ?, cook_time = ?, cook_diff = ? where board_no = ?`;
  const uSqlIngre = `update board_ingredient set ingre_name = ?, ingre_volume = ?
    where ingre_no = ?`;
  const uSqlText = `update board_text set img_file = ?, main_text = ?
    where text_no = ?`;

  //create sql
  const cSqlIngre = "INSERT INTO board_ingredient values (null,?,?,?,0)";
  const cSqlText = "INSERT INTO board_text values (null,?,?,?,0)";
  const cSqlTag = "INSERT INTO board_tag values (null,?,?,0)";
  //delete sql
  const dSqlIngre = `update board_ingredient set isdeleted = 1 where ingre_no = ?`;
  const dSqlText = `update board_text set isdeleted = 1 where text_no = ?`;
  const dSqlTag = `update board_tag set isdeleted = 1 where tag_no = ?`;
  //업데이트할 데이터
  const updateIngre = Ingredients.filter((item) => item.ingre_no);
  const updateOrder = cookingOrder.filter((item) => item.text_no);
  //새로 추가할 데이터
  const newIngre = Ingredients.filter((item) => !item.ingre_no);
  const newOrder = cookingOrder.filter((item) => !item.text_no);
  const newTag = tag.filter((item) => !item.tag_no);
  //제거할 데이터
  const delIngre = deleteIngre.filter((item) => item.ingre_no);
  const delOrder = deleteOrder.filter((item) => item.text_no);
  const delTag = deleteTag.filter((item) => item.tag_no);
  try {
    //업데이트
    await connection.query(uSqlBoard, boardParams);
    if (updateIngre.length) {
      for (key in updateIngre) {
        await connection.query(uSqlIngre, [
          updateIngre[key].ingre_name,
          updateIngre[key].ingre_volume,
          updateIngre[key].ingre_no,
        ]);
      }
    }
    if (updateOrder.length) {
      for (key in updateOrder) {
        await connection.query(uSqlText, [
          updateOrder[key].img_file,
          updateOrder[key].main_text,
          updateOrder[key].text_no,
        ]);
      }
    }
    //생성
    if (newIngre.length) {
      for (key in newIngre) {
        await connection.query(cSqlIngre, [
          postId,
          newIngre[key].ingre_name,
          newIngre[key].ingre_volume,
        ]);
      }
    }
    if (newOrder.length) {
      for (key in newOrder) {
        await connection.query(cSqlText, [
          postId,
          newOrder[key].img_file,
          newOrder[key].main_text,
        ]);
      }
    }
    if (newTag.length) {
      for (key in newTag) {
        await connection.query(cSqlTag, [postId, newTag[key].tag_name]);
      }
    }
    //삭제
    if (delIngre.length) {
      for (key in delIngre) {
        await connection.query(dSqlIngre, [delIngre[key].ingre_no]);
      }
    }
    if (delOrder.length) {
      for (key in delOrder) {
        await connection.query(dSqlText, [delOrder[key].text_no]);
      }
    }
    if (delTag.length) {
      for (key in delTag) {
        await connection.query(dSqlTag, [delTag[key].tag_no]);
      }
    }
    await connection.commit();
    res.json({ success: true, message: "게시글 수정완료." });
  } catch (err) {
    await connection.rollback(); //롤백
    console.log(err);
    return res.json({ success: false, message: "수정 실패" });
  } finally {
    connection.release();
  }
});
//게시글 삭제
router.delete("/:postId/delete", async (req, res) => {
  const { postId } = req.params;
  const sql = `update board set isdeleted = 1 where board_no = ?`;
  try {
    //업데이트
    const data = await pool.query(sql, [postId]);
    console.log(data);
    if (data[0].affectedRows > 0) {
      res.json({ success: true, message: "게시글 삭제완료." });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "삭제 실패" });
  }
});

router.get("/:postId", async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  const headerSql = `select board_no,user_no,title,board_img, description, cook_time,cook_diff,food_type,date_format(created_date,'%Y-%m-%d') as created_date 
   from board where board_no = ? and isdeleted = 0`; //헤더
  const ingreSql = `select ingre_no,ingre_name,ingre_volume from board_ingredient where board_no = ? and isdeleted = 0`; //재료
  const recipeSql = `select text_no, main_text,img_file from board_text where board_no = ? and isdeleted = 0`; //레시피
  const tagSql = `select tag_no, tag_name from board_tag where board_no = ? and isdeleted = 0`; //태그

  const coSql = `select user.user_no, user.user_nickname, co_no ,comment.co,date_format(comment.created_date,'%Y-%m-%d') as created_date from comment 
   left join user_info user on comment.user_no = user.user_no 
   where comment.board_no = ? and comment.isdeleted = 0`; //댓글

  const likeSql = `select user_no,is_like from board_like where board_no = ? and is_like = 1`;

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
    const [likes] = await connection.query(likeSql, [req.params.postId]);
    if (likes.length > 0) {
      console.log(likes);
      obj = { ...obj, likes: likes };
    } else {
      obj = { ...obj, likes: [] };
    }
    obj = {
      ...obj,
      isLoading: true, //로딩 해제
    };
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
//좋아요 읽기
router.get("/:postId/likes", async (req, res) => {
  const sql = `select user_no,is_like from board_like where board_no = ? and is_like = 1`;

  try {
    const [result] = await pool.query(sql, [req.params.postId]);
    if (result.length > 0) {
      console.log(result);
      return res.json({ success: true, result: result });
    } else {
      return res.json({ success: true, result: [] });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  }
});
//like
router.post("/like", async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  const findSql = `select user_no from board_like where board_no = ? and user_no = ?`;
  //유저가 있으면 update, 없으면 새로 넣어준다.
  const createSql = `insert into board_like values (null,?,?,1)`; //없을때
  const updateSql = `update board_like set is_like = 1 where board_no = ? and user_no = ?`; //있을때
  const { user, boNo } = req.body;
  try {
    const [userResult] = await connection.query(findSql, [boNo, user]); //코멘트 넘버와 유저넘버
    if (userResult.length > 0) {
      //있다면 업데이트
      const [data] = await connection.query(updateSql, [boNo, user]);
      if (data.affectedRows > 0) {
        await connection.commit();
        return res.json({ success: true });
      }
    } else {
      //없으면 새로 만든다.
      const [newData] = await connection.query(createSql, [boNo, user]);
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
//unlike
router.post("/unlike", async (req, res) => {
  //이미 눌러져 있을때
  const sql = `update board_like set is_like = 0 where board_no = ? and user_no = ?`; //있을때
  const { user, boNo } = req.body; //코멘트 넘버와 유저넘버

  try {
    const [result] = await pool.query(sql, [boNo, user]);
    if (result.affectedRows > 0) {
      res.json({ success: true });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "오류 발생" });
  }
});
module.exports = router;

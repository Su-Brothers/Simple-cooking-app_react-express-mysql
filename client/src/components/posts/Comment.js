import React from "react";
import "../styles/postsStyle/comment.scss";
import CommentItem from "./CommentItem";
import { useState } from "react";
import Axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { readComment } from "../../modules/post";
import { debounce } from "lodash";
function Comment({ postId, user }) {
  const [input, setInput] = useState("");
  const comment = useSelector((state) => state.post.post.comment);
  const dispatch = useDispatch();
  const onInputHandler = (e) => {
    setInput(e.target.value);
  };

  const onSubmitHandler = debounce(
    async () => {
      setInput("");
      if (user) {
        //유저가 있으면 요청을 보낸다.
        if (input === "") return alert("최소 한 글자 이상을 입력해주세요.");
        const data = await Axios.post("/api/comment", {
          user_no: user, //유저 번호
          bo_no: postId, //포스트 번호
          co: input, //인풋값
        })
          .then((res) => res.data)
          .catch((err) => console.log(err));
        if (data.success) {
          dispatch(readComment(postId)); // 요청이 성공이면 다시로드하기 위해 디스패치
        } else {
          alert(data.message);
        }
      } else {
        alert("로그인이 필요한 서비스 입니다.");
      }
    },
    300,
    { leading: true, trailing: false }
  );

  const onDebounceSubmit = (e) => {
    e.preventDefault();
    onSubmitHandler();
  };

  return (
    <div className="post-item">
      <div className="post-item-box post-comment-box">
        <div className="post-comment-title">
          댓글 <span>{comment ? comment.length : 0}</span>{" "}
        </div>
        <div className="comment-write-box">
          <form>
            <input
              type="text"
              placeholder="요리에 대한 평가를 남겨주세요..."
              value={input}
              onChange={onInputHandler}
            />

            <button type="submit" onClick={onDebounceSubmit}>
              등록
            </button>
          </form>
        </div>
        {comment
          ? comment.map((item, index) => (
              <CommentItem
                writer={item.user_nickname}
                writerNo={item.user_no}
                co={item.co}
                date={item.created_date}
                key={item.co_no}
                deleteAuth={user === item.user_no ? true : false}
                coNo={item.co_no}
                postId={postId}
                profile={item.user_img}
              />
            ))
          : "등록된 댓글이 없습니다."}
      </div>
    </div>
  );
}

export default React.memo(Comment);

import React from "react";
import "../styles/postsStyle/comment-item.scss";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Axios from "axios";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { readComment } from "../../modules/post";
import { useEffect } from "react";
import { useState } from "react";
function CommentItem({ writer, date, co, deleteAuth, postId, coNo }) {
  const userState = useSelector((state) => state.user.userData, shallowEqual);
  const dispatch = useDispatch();
  const [like, setLike] = useState({
    isLike: "", //좋아요 정보
    isUnlike: "", //싫어요 정보
    isUser: {
      is_like: "", //db에 정보가 있다면 이 데이터가 들어옴.
      user_no: "",
    }, //로그인 된 유저가 눌렀는지
  });
  console.log(coNo);
  const onDeleteHandler = async () => {
    const data = await Axios.delete(`/api/comment/${coNo}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (data.success) {
      dispatch(readComment(postId));
    } else {
      alert(data.message);
    }
  };

  const getLike = async () => {
    const data = await Axios.get(`/api/comment/getLike/${coNo}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (data.success) {
      const { result } = data;
      const userData =
        result && result.filter((item) => item.user_no === userState._no)[0];

      setLike({
        ...like,
        isLike: result ? result.filter((item) => item.is_like === 1).length : 0,
        isUnlike: result
          ? result.filter((item) => item.is_like === 2).length
          : 0,
        isUser: userData ? userData : { ...like.isUser },
      });
    } else {
      alert(data.message);
    }
  };
  const onLikeHandler = async () => {
    if (userState.isAuth) {
      const data = await Axios.post(`/api/comment/like`, {
        user: userState._no,
        coNo: coNo,
        boNo: postId,
      })
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (data.success) {
        getLike(); //리로드
      } else {
        alert(data.message);
      }
    } else {
      alert("로그인이 필요한 서비스입니다.");
    }
  };

  const onUnlikeHandler = async () => {
    if (userState.isAuth) {
      const data = await Axios.post(`/api/comment/unlike`, {
        user: userState._no,
        coNo: coNo,
        boNo: postId,
      })
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (data.success) {
        getLike(); //리로드
      } else {
        alert(data.message);
      }
    } else {
      alert("로그인이 필요한 서비스입니다.");
    }
  };

  useEffect(() => {
    getLike(); //좋아요 정보를 가져온다.
  }, []);
  console.log(like);
  return (
    <div className="comment-item">
      <div className="comment-left">
        <img
          src="https://placeimg.com/100/100/any"
          alt="대표 이미지"
          className="comment-profil-img"
        />
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <div className="comment-writer">{writer}</div>
          <span className="comment-date">{date}</span>
          <button
            type="button"
            onClick={onLikeHandler}
            className={like.isUser.is_like === 1 ? "active" : ""}
          >
            <FaThumbsUp /> {like.isLike}
          </button>
          <button
            type="button"
            onClick={onUnlikeHandler}
            className={like.isUser.is_like === 2 ? "active" : ""}
          >
            <FaThumbsDown /> {like.isUnlike}
          </button>
          {deleteAuth ? (
            <>
              <button
                type="button"
                className="comment-delete-btn"
                onClick={onDeleteHandler}
              >
                삭제
              </button>
            </>
          ) : null}
        </div>
        <div className="comment-text">{co}</div>
      </div>
    </div>
  );
}

export default React.memo(CommentItem);

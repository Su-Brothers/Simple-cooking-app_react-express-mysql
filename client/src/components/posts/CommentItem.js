import React from "react";
import "../styles/postsStyle/comment-item.scss";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Axios from "axios";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { readComment } from "../../modules/post";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
function CommentItem({ writer, date, co, deleteAuth, postId, coNo }) {
  const userState = useSelector((state) => state.user.userData, shallowEqual);
  const dispatch = useDispatch();
  const [isLike, setIsLike] = useState(0);
  const [isUnlike, setIsUnlike] = useState(0);
  const [isUser, setIsUser] = useState({
    is_like: "", //db에 정보가 있다면 이 데이터가 들어옴.
    user_no: "",
  });

  //let mounted = true;
  let isMounted = useRef(null); //마운트 확인
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
      const userData = //현재 로그인 된 사용자가 이 코멘트의 좋아요와 연관이 있는지 확인
        //유저가 일치하면 데이터가 있을 것이고 일치 하지 않으면 없을 것이다.
        result && result.filter((item) => item.user_no === userState._no)[0];
      console.log("Dd");
      if (isMounted.current) {
        setIsLike(result.filter((item) => item.is_like === 1).length);
        setIsUnlike(result.filter((item) => item.is_like === 2).length);
        setIsUser(userData ? userData : { ...isUser });
      }
    } else {
      alert(data.message);
    }
  };
  const onLikeHandler = async () => {
    if (userState.isAuth) {
      if (isUser.is_like === 1) {
        const data = await Axios.post(`/api/comment/refreshlike`, {
          user: userState._no,
          coNo: coNo,
        })
          .then((res) => res.data)
          .catch((err) => console.log(err));
        if (data.success) {
          getLike(); //리로드
        } else {
          alert(data.message);
        }
      } else {
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
      }
    } else {
      alert("로그인이 필요한 서비스입니다.");
    }
  };

  const onUnlikeHandler = async () => {
    if (userState.isAuth) {
      if (isUser.is_like === 2) {
        const data = await Axios.post(`/api/comment/refreshlike`, {
          user: userState._no,
          coNo: coNo,
        })
          .then((res) => res.data)
          .catch((err) => console.log(err));
        if (data.success) {
          getLike(); //리로드
        } else {
          alert(data.message);
        }
      } else {
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
      }
    } else {
      alert("로그인이 필요한 서비스입니다.");
    }
  };

  useEffect(() => {
    isMounted.current = true;
    getLike(); //좋아요 정보를 가져온다.
    return () => (isMounted.current = false); //누수 방지
  }, []);
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
            className={isUser.is_like === 1 ? "active" : ""}
          >
            <FaThumbsUp /> {isLike}
          </button>
          <button
            type="button"
            onClick={onUnlikeHandler}
            className={isUser.is_like === 2 ? "active" : ""}
          >
            <FaThumbsDown /> {isUnlike}
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

import React from "react";
import "../styles/postsStyle/comment-item.scss";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Axios from "axios";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { debounce } from "lodash";
import { readComment } from "../../modules/post";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../loadingCompo/LoadingSpinner";
import normalProfile from "../../images/normal-profile.png";
function CommentItem({
  writer,
  writerNo,
  date,
  co,
  deleteAuth,
  postId,
  coNo,
  profile,
}) {
  const userState = useSelector((state) => state.user.userData, shallowEqual);
  const dispatch = useDispatch();
  const [isDeleted, setIsDeleted] = useState(false); //삭제 했을때 나오는 로딩 스피너
  const [isLike, setIsLike] = useState(0);
  const [isUnlike, setIsUnlike] = useState(0);
  const [isUser, setIsUser] = useState({
    is_like: "", //db에 정보가 있다면 이 데이터가 들어옴.
    user_no: "",
  });

  //let mounted = true;
  let isMounted = useRef(null); //마운트 확인
  const onDeleteHandler = debounce(
    async () => {
      setIsDeleted(true);
      const data = await Axios.delete(
        `${process.env.REACT_APP_SERVER_HOST}/api/comment/${coNo}`
      )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (data.success) {
        dispatch(readComment(postId));
      } else {
        alert(data.message);
      }
    },
    300,
    { leading: true, trailing: false }
  );

  const getLike = async () => {
    const data = await Axios.get(
      `${process.env.REACT_APP_SERVER_HOST}/api/comment/getLike/${coNo}`
    )
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (data.success) {
      const { result } = data;
      const userData = //현재 로그인 된 사용자가 이 코멘트의 좋아요와 연관이 있는지 확인
        //유저가 일치하면 데이터가 있을 것이고 일치 하지 않으면 없을 것이다.
        result && result.filter((item) => item.user_no === userState._no)[0];
      if (isMounted.current) {
        setIsLike(result.filter((item) => item.is_like === 1).length);
        setIsUnlike(result.filter((item) => item.is_like === 2).length);
        setIsUser(userData ? userData : { ...isUser });
      }
    } else {
      alert(data.message);
    }
  };

  const onLikeHandler = debounce(async () => {
    if (userState.isAuth) {
      if (isUser.is_like === 1) {
        setIsLike(isLike - 1);
        setIsUser({
          is_like: 0,
          user_no: userState._no,
        });
        const data = await Axios.post(
          `${process.env.REACT_APP_SERVER_HOST}/api/comment/refreshlike`,
          {
            user: userState._no,
            coNo: coNo,
          }
        )
          .then((res) => res.data)
          .catch((err) => console.log(err));
        if (data.success) {
          getLike(); //리로드
        } else {
          alert(data.message);
        }
      } else {
        setIsLike(isLike + 1);
        setIsUser({
          is_like: 1,
          user_no: userState._no,
        });
        if (isUser.is_like === 2) {
          setIsUnlike(isUnlike - 1);
        }
        const data = await Axios.post(
          `${process.env.REACT_APP_SERVER_HOST}/api/comment/like`,
          {
            user: userState._no,
            coNo: coNo,
            boNo: postId,
          }
        )
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
  }, 300);

  const onUnlikeHandler = debounce(async () => {
    if (userState.isAuth) {
      if (isUser.is_like === 2) {
        setIsUnlike(isUnlike - 1);
        setIsUser({
          is_like: 0,
          user_no: userState._no,
        });
        const data = await Axios.post(
          `${process.env.REACT_APP_SERVER_HOST}/api/comment/refreshlike`,
          {
            user: userState._no,
            coNo: coNo,
          }
        )
          .then((res) => res.data)
          .catch((err) => console.log(err));
        if (data.success) {
          getLike(); //리로드
        } else {
          alert(data.message);
        }
      } else {
        setIsUnlike(isUnlike + 1);
        setIsUser({
          is_like: 2,
          user_no: userState._no,
        });
        if (isUser.is_like === 1) {
          setIsLike(isLike - 1);
        }
        const data = await Axios.post(
          `${process.env.REACT_APP_SERVER_HOST}/api/comment/unlike`,
          {
            user: userState._no,
            coNo: coNo,
            boNo: postId,
          }
        )
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
  }, 300);

  useEffect(() => {
    isMounted.current = true;
    getLike(); //좋아요 정보를 가져온다.
    return () => (isMounted.current = false); //누수 방지
  }, []);
  return (
    <div className="comment-item">
      <div className="comment-left">
        <Link to={deleteAuth ? `/mypage` : `/chef/${writerNo}`}>
          {profile ? (
            <img
              src={`${process.env.REACT_APP_IMG_URL}/${profile}`}
              alt="프로필사진"
            />
          ) : (
            <img src={normalProfile} alt="프로필사진" />
          )}
        </Link>
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
          {deleteAuth && !isDeleted ? (
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
          {isDeleted && (
            <div className="loading-box">
              <LoadingSpinner size={"small"} />
            </div>
          )}
        </div>
        <div className="comment-text">{co}</div>
      </div>
    </div>
  );
}

export default React.memo(CommentItem);

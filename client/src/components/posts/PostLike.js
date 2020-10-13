import Axios from "axios";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { debounce } from "lodash";
function PostLike({ postId, user }) {
  const [likes, setLikes] = useState(0); //좋아요 수
  const [isLiked, setIsLiked] = useState(null); //눌렀는지
  let isMounted = useRef(null); //마운트 확인용
  const onLike = debounce(async () => {
    //디바운스 처리
    console.log("click");
    if (user) {
      if (isLiked) {
        //unlike
        //서버에서 받아오기에 시간이 걸리기 때문에 클라이언트측에서 미리 데이터를 변경하고
        //서버단에서 변경
        console.log("싫어요");
        setLikes(likes - 1);
        setIsLiked(false);
        const data = await Axios.post(
          `${process.env.REACT_APP_SERVER_HOST}/api/post/unlike`,
          {
            boNo: postId,
            user: user,
          }
        )
          .then((res) => res.data)
          .catch((err) => console.log(err));
        if (data.success) {
          //리로드
          getLikes();
        } else {
          alert(data.message);
        }
      } else {
        //like
        console.log(user);
        console.log("좋아요");
        setLikes(likes + 1);
        setIsLiked(true);
        const data = await Axios.post(
          `${process.env.REACT_APP_SERVER_HOST}/api/post/like`,
          {
            boNo: postId,
            user: user,
          }
        )
          .then((res) => res.data)
          .catch((err) => console.log(err));
        if (data.success) {
          //리로드
          getLikes();
        } else {
          alert(data.message);
        }
      }
    } else {
      alert("로그인이 필요한 서비스입니다.");
    }
  }, 200);

  const getLikes = () => {
    Axios.get(
      `${process.env.REACT_APP_SERVER_HOST}/api/post/${postId}/likes`
    ).then((res) => {
      if (res.data.success) {
        if (isMounted.current) {
          setLikes(res.data.result.length); //길이 설정
          const data = res.data.result.find((item) => item.user_no === user)
            ? true
            : false;
          setIsLiked(data);
        }
      } else {
        alert(res.data.message);
      }
    });
  };
  useEffect(() => {
    isMounted.current = true;
    getLikes();
    return () => (isMounted.current = false);
  }, []);
  return (
    <div className="post-category-item">
      <button type="button" onClick={onLike}>
        {user && isLiked ? <FaHeart /> : <FaRegHeart />}
      </button>
      {likes}
    </div>
  );
}

export default React.memo(PostLike);

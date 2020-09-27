import Axios from "axios";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
function PostLike({ postId, user }) {
  const [likes, setLikes] = useState(0); //좋아요 수
  const [isLiked, setIsLiked] = useState(null); //눌렀는지
  let isMounted = useRef(null); //마운트 확인용
  useEffect(() => {
    isMounted.current = true;
    getLikes();
    return () => (isMounted.current = false);
  }, []);
  const onLike = async () => {
    if (user) {
      if (isLiked) {
        //unlike
        const data = await Axios.post("/api/post/unlike", {
          boNo: postId,
          user: user,
        })
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
        const data = await Axios.post("/api/post/like", {
          boNo: postId,
          user: user,
        })
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
  };

  const getLikes = () => {
    Axios.get(`/api/post/${postId}/likes`).then((res) => {
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

import Axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import post from "../../modules/post";
function PostLike({ postId }) {
  const postLikes = useSelector((state) => state.post.post.likes);
  const user = useSelector((state) => state.user.userData);
  const [likes, setLikes] = useState([]);
  useEffect(() => {
    if (postLikes) {
      setLikes(postLikes);
    }
  }, [postLikes]);
  const onLike = async () => {
    if (user.isAuth) {
      const isLike = likes.find((item) => item.user_no === user._no);
      if (isLike) {
        //unlike
        const data = await Axios.post("/api/post/unlike", {
          boNo: postId,
          user: user._no,
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
          user: user._no,
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
  const getLikes = async () => {
    const data = await Axios.get(`/api/post/${postId}/likes`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (data.success) {
      //리로드
      setLikes(data.result);
    } else {
      alert(data.message);
    }
  };
  return (
    <div className="post-category-item">
      <button type="button" onClick={onLike}>
        {user.isAuth && likes.find((item) => item.user_no === user._no) ? (
          <FaHeart />
        ) : (
          <FaRegHeart />
        )}
      </button>
      {likes.length}
    </div>
  );
}

export default React.memo(PostLike);

import React from "react";
import "../styles/postsStyle/post-ingre.scss";
import PostIngreItem from "./PostIngreItem";
import { useSelector } from "react-redux";
function PostInre() {
  const ingre = useSelector((state) => state.post.post.ingre);

  return (
    <div className="post-item post-ingre">
      <div className="post-item-box post-ingre-box">
        <div className="post-ingre-title">재료리스트</div>
        {ingre &&
          ingre.map((item, index) => (
            <PostIngreItem
              name={item.ingre_name}
              volume={item.ingre_volume}
              key={item.ingre_no}
            />
          ))}
      </div>
    </div>
  );
}

export default PostInre;

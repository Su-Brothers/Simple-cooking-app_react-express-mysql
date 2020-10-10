import React from "react";
import PostTagItem from "./PostTagItem";
import "../styles/postsStyle/post-tag.scss";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
function PostTag() {
  const tag = useSelector((state) => state.post.post.tag);
  return (
    <div className="post-item">
      <div className="post-item-box">
        <div className="post-tag-title">태그</div>
        <div className="post-tag-items">
          {tag
            ? tag.map((item, index) => (
                <Link to={`/post/tag/${item.tag_name}`} key={item.tag_no}>
                  <PostTagItem tag={item.tag_name} />
                </Link>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default PostTag;

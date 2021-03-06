import React from "react";
import "../styles/postsStyle/post-tag-item.scss";
function PostTagItem({ tag }) {
  return <div className="post-tag-item">{`# ${tag}`}</div>;
}

export default React.memo(PostTagItem);

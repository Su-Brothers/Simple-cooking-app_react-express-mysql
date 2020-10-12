import React from "react";
import "../styles/postsStyle/post-ingre-item.scss";
function PostIngreItem({ name, volume }) {
  return (
    <div className="post-ingre-item">
      <div className="post-ingre-item-title">{name}</div>
      <div className="post-ingre-item-volume">{volume}</div>
    </div>
  );
}

export default React.memo(PostIngreItem);

import React from "react";
import { useSelector } from "react-redux";

function Views() {
  const views = useSelector((state) => state.post.post.header.board_views);
  return <span>{views}</span>;
}

export default Views;
